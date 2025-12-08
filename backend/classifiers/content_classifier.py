import os
import pickle
import re
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Initialize NLTK components
try:
    stopwords.words('english')
except:
    import nltk
    nltk.download('stopwords', quiet=True)

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'models')

def clean_text(text):
    """Clean and preprocess email text"""
    text = str(text).lower()
    text = re.sub(r'http\S+|www\S+', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    stop_words = set(stopwords.words('english'))
    words = text.split()
    words = [word for word in words if word not in stop_words]
    
    stemmer = PorterStemmer()
    words = [stemmer.stem(word) for word in words]
    
    return ' '.join(words)

class ContentClassifier:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self._load_model()
    
    def _load_model(self):
        model_path = os.path.join(MODEL_DIR, 'content_classifier_basic.pkl')
        vectorizer_path = os.path.join(MODEL_DIR, 'content_vectorizer.pkl')
        
        if os.path.exists(model_path) and os.path.exists(vectorizer_path):
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            with open(vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)
        else:
            # Fallback to old model names
            fallback_model = os.path.join(MODEL_DIR, 'phishing_model.pkl')
            fallback_vec = os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl')
            if os.path.exists(fallback_model):
                with open(fallback_model, 'rb') as f:
                    self.model = pickle.load(f)
                with open(fallback_vec, 'rb') as f:
                    self.vectorizer = pickle.load(f)
    
    def predict(self, email_body, headers=None):
        if self.model is None:
            return {"prediction": "unknown", "confidence": 0.0}
        
        cleaned = clean_text(email_body)
        vectorized = self.vectorizer.transform([cleaned])
        prediction = self.model.predict(vectorized)[0]
        probability = self.model.predict_proba(vectorized)[0]
        
        # Determine phishing probability
        phishing_prob = probability[1] if len(probability) > 1 and self.model.classes_[1] == 'phishing' else probability[0]
        confidence = float(phishing_prob) if prediction == 'phishing' else float(1 - phishing_prob)
        
        return {
            "prediction": prediction,
            "confidence": confidence
        }
    
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
