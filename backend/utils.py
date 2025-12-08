import pickle
import os
import sys
import re
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from preprocessing.clean_text import clean_text

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'phishing_model.pkl')
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'tfidf_vectorizer.pkl')

_model = None
_vectorizer = None

def load_model():
    global _model, _vectorizer
    if _model is None:
        with open(MODEL_PATH, 'rb') as f:
            _model = pickle.load(f)
    if _vectorizer is None:
        with open(VECTORIZER_PATH, 'rb') as f:
            _vectorizer = pickle.load(f)
    return _model, _vectorizer

def predict_email(text: str):
    model, vectorizer = load_model()
    cleaned = clean_text(text)
    vectorized = vectorizer.transform([cleaned])
    prediction = model.predict(vectorized)[0]
    probability = model.predict_proba(vectorized)[0]
    
    phishing_prob = probability[1] if model.classes_[1] == 'phishing' else probability[0]
    
    return {
        "prediction": prediction,
        "confidence": float(phishing_prob) if prediction == 'phishing' else float(1 - phishing_prob)
    }

def extract_features(text: str):
    urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text)
    suspicious_keywords = ['urgent', 'verify', 'account', 'suspended', 'lottery', 'winner', 'bank', 'password', 'login']
    found_keywords = [word for word in suspicious_keywords if word in text.lower()]
    
    return {
        "urls": urls,
        "suspicious_keywords": list(set(found_keywords))
    }
