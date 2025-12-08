from .content_classifier_advanced import ContentClassifierAdvanced
from .url_classifier_advanced import URLClassifierAdvanced

class EnsembleClassifier:
    def __init__(self):
        print("Initializing advanced classifiers...")
        self.content_clf = ContentClassifierAdvanced()
        self.url_clf = URLClassifierAdvanced()
        print("✓ Ensemble ready with DistilBERT + RF(25 features)")
    
    def predict_full_email(self, email_body, headers=None, urls=None):
        content_result = self.content_clf.predict(email_body, headers)
        
        url_results = []
        if urls:
            for url in urls:
                url_results.append(self.url_clf.predict(url))
        
        if content_result['confidence'] > 0.85:
            final_prediction = content_result['prediction']
            final_confidence = content_result['confidence']
        else:
            if url_results:
                avg_url_confidence = sum(r['confidence'] for r in url_results) / len(url_results)
                url_prediction = 'phishing' if any(r['prediction'] == 'phishing' for r in url_results) else 'legitimate'
                
                content_weight = 0.7
                url_weight = 0.3
                
                if content_result['prediction'] == url_prediction:
                    final_prediction = content_result['prediction']
                    final_confidence = content_weight * content_result['confidence'] + url_weight * avg_url_confidence
                else:
                    final_prediction = content_result['prediction']
                    final_confidence = content_result['confidence']
            else:
                final_prediction = content_result['prediction']
                final_confidence = content_result['confidence']
        
        indicators = self.content_clf.extract_indicators(email_body, headers)
        
        url_indicators = []
        if urls:
            for url in urls:
                url_indicators.append(self.url_clf.get_url_indicators(url))
        
        indicator_scores = self._calculate_indicator_scores(indicators, url_indicators)
        
        return {
            "mode": "full_email",
            "prediction": final_prediction,
            "confidence": float(final_confidence),
            "risk_percentage": int(final_confidence * 100) if final_prediction == 'phishing' else int((1 - final_confidence) * 100),
            "classifiers": {
                "content_classifier": {
                    "prediction": content_result['prediction'],
                    "confidence": content_result['confidence']
                },
                "url_classifier": {
                    "prediction": url_results[0]['prediction'] if url_results else "N/A",
                    "confidence": url_results[0]['confidence'] if url_results else 0.0
                }
            },
            "indicators": {
                "suspicious_keywords": indicators.get('suspicious_keywords', []),
                "suspicious_urls": indicators.get('detected_urls', []),
                "sender_mismatch": indicators.get('sender_mismatch'),
                "url_features": url_indicators[0] if url_indicators else {}
            },
            "indicator_scores": indicator_scores
        }
    
    def predict_url_only(self, url):
        result = self.url_clf.predict(url)
        url_indicators = self.url_clf.get_url_indicators(url)
        
        url_score = int(result['confidence'] * 100) if result['prediction'] == 'phishing' else int((1 - result['confidence']) * 50)
        
        return {
            "mode": "url_only",
            "prediction": result['prediction'],
            "confidence": float(result['confidence']),
            "risk_percentage": int(result['confidence'] * 100) if result['prediction'] == 'phishing' else int((1 - result['confidence']) * 100),
            "url_features": url_indicators,
            "indicator_scores": {
                "url_score": url_score
            }
        }
    
    def _calculate_indicator_scores(self, indicators, url_indicators):
        keyword_score = min(len(indicators.get('suspicious_keywords', [])) * 15, 100)
        
        url_score = 0
        if url_indicators:
            for url_ind in url_indicators:
                if url_ind.get('no_https'):
                    url_score += 20
                if url_ind.get('suspicious_tld'):
                    url_score += 30
                if url_ind.get('has_ip_address'):
                    url_score += 25
                if url_ind.get('url_shortener'):
                    url_score += 15
            url_score = min(url_score, 100)
        
        header_score = 0
        if indicators.get('sender_mismatch'):
            header_score = 75
        
        return {
            "keywords_score": keyword_score,
            "url_score": url_score,
            "header_score": header_score
        }
