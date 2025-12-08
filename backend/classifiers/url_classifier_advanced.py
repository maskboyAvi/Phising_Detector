import pickle
import os
import re
from urllib.parse import urlparse
import math
import pandas as pd

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'models')

class URLClassifierAdvanced:
    def __init__(self):
        self.model = None
        self._load_model()
    
    def _load_model(self):
        model_path = os.path.join(MODEL_DIR, 'url_classifier_advanced.pkl')
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            print(f"✓ Loaded advanced URL classifier (25 features)")
        else:
            print(f"Warning: advanced model not found at {model_path}")
    
    def extract_advanced_features(self, url):
        """Extract 25 advanced features from URL"""
        try:
            # Ensure URL has scheme
            if not url.startswith(('http://', 'https://')):
                url = 'http://' + url
            
            parsed = urlparse(url)
            domain = parsed.netloc
            path = parsed.path
            
            # Suspicious patterns
            suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', '.bid', '.win', '.pw', '.cc']
            url_shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'buff.ly', 'is.gd']
            trusted_tlds = ['.com', '.org', '.edu', '.gov', '.net']
            
            # Basic features
            features = {
                'url_length': len(url),
                'domain_length': len(domain),
                'path_length': len(path),
                'has_https': 1 if parsed.scheme == 'https' else 0,
                'has_ip_address': 1 if re.match(r'\d+\.\d+\.\d+\.\d+', domain) else 0,
            }
            
            # Domain analysis
            features['subdomain_count'] = domain.count('.') - 1 if domain else 0
            features['suspicious_tld'] = 1 if any(domain.endswith(tld) for tld in suspicious_tlds) else 0
            features['trusted_tld'] = 1 if any(domain.endswith(tld) for tld in trusted_tlds) else 0
            features['url_shortener'] = 1 if any(short in domain for short in url_shorteners) else 0
            
            # Character analysis
            features['special_char_count'] = len(re.findall(r'[^a-zA-Z0-9]', url))
            features['digit_count'] = len(re.findall(r'\d', url))
            features['digit_ratio'] = len(re.findall(r'\d', url)) / max(len(url), 1)
            features['letter_ratio'] = len(re.findall(r'[a-zA-Z]', url)) / max(len(url), 1)
            
            # Suspicious patterns
            features['has_at_symbol'] = 1 if '@' in url else 0
            features['has_double_slash'] = 1 if '//' in path else 0
            features['has_hyphen_in_domain'] = 1 if '-' in domain else 0
            features['consecutive_dots'] = 1 if '..' in url else 0
            
            # Path analysis
            features['path_depth'] = path.count('/')
            features['query_params_count'] = len(parsed.query.split('&')) if parsed.query else 0
            features['fragment_present'] = 1 if parsed.fragment else 0
            
            # Entropy (randomness)
            text = url.lower()
            if text:
                char_freq = {}
                for char in text:
                    char_freq[char] = char_freq.get(char, 0) + 1
                entropy = -sum((freq / len(text)) * math.log2(freq / len(text)) for freq in char_freq.values())
                features['entropy'] = entropy
            else:
                features['entropy'] = 0.0
            
            # Additional features
            features['uppercase_ratio'] = sum(1 for c in url if c.isupper()) / max(len(url), 1)
            features['domain_digit_ratio'] = len(re.findall(r'\d', domain)) / max(len(domain), 1)
            features['suspicious_keywords'] = sum(1 for word in ['login', 'verify', 'secure', 'account', 'update', 'confirm'] if word in url.lower())
            features['vowel_ratio'] = len(re.findall(r'[aeiou]', url.lower())) / max(len(url), 1)
            
            return features
        except:
            # Default features if parsing fails
            return {k: 0 for k in ['url_length', 'domain_length', 'path_length', 'has_https', 
                                    'has_ip_address', 'subdomain_count', 'suspicious_tld', 'trusted_tld',
                                    'url_shortener', 'special_char_count', 'digit_count', 'digit_ratio',
                                    'letter_ratio', 'has_at_symbol', 'has_double_slash', 'has_hyphen_in_domain',
                                    'consecutive_dots', 'path_depth', 'query_params_count', 'fragment_present',
                                    'entropy', 'uppercase_ratio', 'domain_digit_ratio', 'suspicious_keywords',
                                    'vowel_ratio']}
    
    def predict(self, url):
        if self.model is None:
            # Fallback to rule-based
            features = self.extract_advanced_features(url)
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
        
        # Use ML model
        features = self.extract_advanced_features(url)
        feature_df = pd.DataFrame([features])
        
        prediction = self.model.predict(feature_df)[0]
        probability = self.model.predict_proba(feature_df)[0]
        
        # Get phishing probability
        phishing_prob = probability[1] if len(probability) > 1 else probability[0]
        confidence = float(phishing_prob) if prediction == 'phishing' else float(1 - phishing_prob)
        
        return {
            "prediction": prediction,
            "confidence": confidence,
            "rule_based": False
        }
    
    def get_url_indicators(self, url):
        features = self.extract_advanced_features(url)
        parsed = urlparse(url if url.startswith(('http://', 'https://')) else 'http://' + url)
        
        indicators = {
            "domain": parsed.netloc,
            "no_https": features['has_https'] == 0,
            "suspicious_tld": features['suspicious_tld'] == 1,
            "has_ip_address": features['has_ip_address'] == 1,
            "url_shortener": features['url_shortener'] == 1,
            "path_depth": features['path_depth'],
            "special_chars": features['special_char_count'],
            "suspicious_keywords": features['suspicious_keywords']
        }
        
        return indicators
