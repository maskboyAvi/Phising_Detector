import pickle
import os
import re
from urllib.parse import urlparse
import math

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'models')

class URLClassifier:
    def __init__(self):
        self.model = None
        self._load_model()
    
    def _load_model(self):
        model_path = os.path.join(MODEL_DIR, 'url_classifier_basic.pkl')
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
    
    def extract_features(self, url):
        parsed = urlparse(url)
        domain = parsed.netloc
        path = parsed.path
        
        suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work']
        url_shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly']
        
        features = {
            'url_length': len(url),
            'domain_length': len(domain),
            'path_length': len(path),
            'has_https': 1 if parsed.scheme == 'https' else 0,
            'has_ip_address': 1 if re.match(r'\d+\.\d+\.\d+\.\d+', domain) else 0,
            'subdomain_count': domain.count('.') - 1 if domain else 0,
            'suspicious_tld': 1 if any(domain.endswith(tld) for tld in suspicious_tlds) else 0,
            'url_shortener': 1 if any(short in domain for short in url_shorteners) else 0,
            'special_char_count': len(re.findall(r'[^a-zA-Z0-9]', url)),
            'digit_count': len(re.findall(r'\d', url)),
            'digit_ratio': len(re.findall(r'\d', url)) / max(len(url), 1),
            'has_at_symbol': 1 if '@' in url else 0,
            'has_double_slash': 1 if '//' in path else 0,
            'path_depth': path.count('/'),
            'query_params_count': len(parsed.query.split('&')) if parsed.query else 0,
            'fragment_present': 1 if parsed.fragment else 0,
        }
        
        text = url.lower()
        if text:
            char_freq = {}
            for char in text:
                char_freq[char] = char_freq.get(char, 0) + 1
            entropy = -sum((freq / len(text)) * math.log2(freq / len(text)) for freq in char_freq.values())
            features['entropy'] = entropy
        else:
            features['entropy'] = 0.0
        
        return features
    
    def predict(self, url):
        if self.model is None:
            features = self.extract_features(url)
            risk_score = 0
            if features['has_https'] == 0:
                risk_score += 20
            if features['suspicious_tld']:
                risk_score += 30
            if features['has_ip_address']:
                risk_score += 25
            if features['url_shortener']:
                risk_score += 15
            
            prediction = 'phishing' if risk_score > 40 else 'legitimate'
            confidence = min(risk_score / 100.0 + 0.5, 0.95) if prediction == 'phishing' else 0.7
            
            return {
                "prediction": prediction,
                "confidence": confidence,
                "rule_based": True
            }
        
        features = self.extract_features(url)
        feature_vector = [[features[k] for k in sorted(features.keys())]]
        prediction = self.model.predict(feature_vector)[0]
        probability = self.model.predict_proba(feature_vector)[0]
        
        phishing_prob = probability[1] if len(probability) > 1 else probability[0]
        confidence = float(phishing_prob) if prediction == 'phishing' else float(1 - phishing_prob)
        
        return {
            "prediction": prediction,
            "confidence": confidence,
            "rule_based": False
        }
    
    def get_url_indicators(self, url):
        features = self.extract_features(url)
        parsed = urlparse(url)
        
        indicators = {
            "domain": parsed.netloc,
            "no_https": features['has_https'] == 0,
            "suspicious_tld": features['suspicious_tld'] == 1,
            "has_ip_address": features['has_ip_address'] == 1,
            "url_shortener": features['url_shortener'] == 1,
            "path_depth": features['path_depth'],
            "special_chars": features['special_char_count']
        }
        
        return indicators
