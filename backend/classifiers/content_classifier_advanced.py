import os
import pickle
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import re

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'models')

class ContentClassifierAdvanced:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self._load_model()
    
    def _load_model(self):
        model_path = os.path.join(MODEL_DIR, 'content_classifier_distilbert')
        
        if os.path.exists(model_path):
            try:
                self.tokenizer = DistilBertTokenizer.from_pretrained(model_path)
                self.model = DistilBertForSequenceClassification.from_pretrained(model_path)
                self.model.to(self.device)
                self.model.eval()
                
                # Load model info
                info_path = os.path.join(model_path, 'model_info.pkl')
                if os.path.exists(info_path):
                    with open(info_path, 'rb') as f:
                        self.model_info = pickle.load(f)
                else:
                    self.model_info = {'label_map': {0: 'legitimate', 1: 'phishing'}}
                
                print(f"✓ Loaded DistilBERT content classifier on {self.device}")
            except Exception as e:
                print(f"Error loading DistilBERT model: {e}")
                self.model = None
    
    def predict(self, email_body, headers=None):
        if self.model is None:
            return {"prediction": "unknown", "confidence": 0.0}
        
        try:
            # Tokenize input
            inputs = self.tokenizer(
                email_body, 
                return_tensors="pt", 
                truncation=True, 
                padding=True, 
                max_length=128
            )
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Get prediction
            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = torch.nn.functional.softmax(outputs.logits, dim=1)
                prediction_idx = torch.argmax(probs, dim=1).item()
                confidence = probs[0][prediction_idx].item()
            
            # Map to label
            prediction = self.model_info['label_map'].get(prediction_idx, 'unknown')
            
            return {
                "prediction": prediction,
                "confidence": float(confidence)
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            return {"prediction": "unknown", "confidence": 0.0}
    
    def extract_indicators(self, email_body, headers=None):
        # Extract URLs
        urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', email_body)
        
        # Check for suspicious keywords
        suspicious_keywords = [
            'urgent', 'verify', 'account', 'suspended', 'lottery', 'winner', 
            'bank', 'password', 'login', 'confirm', 'security', 'alert',
            'expires', 'immediately', 'click here', 'act now', 'limited time'
        ]
        
        found_keywords = list(set([word for word in suspicious_keywords if word in email_body.lower()]))
        
        # Check for sender mismatch
        sender_mismatch = None
        if headers:
            from_addr = headers.get('from', '').lower()
            reply_to = headers.get('reply_to', '').lower()
            if from_addr and reply_to and from_addr != reply_to:
                from_domain = from_addr.split('@')[-1] if '@' in from_addr else ''
                reply_domain = reply_to.split('@')[-1] if '@' in reply_to else ''
                if from_domain != reply_domain:
                    sender_mismatch = {
                        "detected": True,
                        "from_domain": from_domain,
                        "reply_to_domain": reply_domain
                    }
        
        return {
            "suspicious_keywords": found_keywords,
            "detected_urls": urls,
            "sender_mismatch": sender_mismatch
        }
