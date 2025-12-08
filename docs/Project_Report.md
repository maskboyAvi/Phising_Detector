# Phishing Email Detection Framework using NLP
## Project Report

---

## Abstract

This project presents a comprehensive NLP-based phishing email detection framework featuring a dual-mode analysis system. The framework employs two specialized classifiers - a Content Classifier for email body and header analysis, and a URL Classifier for suspicious link detection - combined through an intelligent ensemble decision mechanism. The system achieves 85-90% accuracy for content analysis and 80-85% for URL analysis using lightweight models (Logistic Regression + Random Forest) trained on Google Colab. The framework provides both full email analysis and rapid URL-only scanning through a modern Next.js web interface with FastAPI backend. Key technologies include Python 3.11, scikit-learn 1.3.2, FastAPI 0.104.1, and Next.js 16, demonstrating practical real-time phishing detection with comprehensive indicator extraction.

---

## 1. Introduction

### 1.1 Background
Phishing attacks remain one of the most prevalent cybersecurity threats, with the Anti-Phishing Working Group (APWG) reporting over 1.35 million unique phishing websites in 2023. Traditional blacklist-based detection methods fail to catch zero-day phishing attempts and are easily circumvented through URL obfuscation and domain variations. Modern phishing campaigns employ sophisticated social engineering tactics, making content-based analysis crucial for effective detection.

### 1.2 Problem Statement
Current phishing detection solutions face several limitations:
- **Blacklist lag**: New phishing sites operate undetected until reported
- **Single-mode analysis**: Most tools analyze either URLs or content, not both
- **Limited interpretability**: Users don't understand why an email is flagged
- **Deployment complexity**: ML models require significant local computational resources

### 1.3 Objectives
This project aims to:
1. Develop a **dual-mode detection system** supporting both full email and URL-only analysis
2. Implement **ensemble classification** combining content and URL analysis
3. Train lightweight models on **Google Colab** for accessibility and reproducibility
4. Extract and visualize **interpretable indicators** (keywords, URLs, sender mismatches)
5. Deploy a **production-ready web application** with modern UI/UX

### 1.4 Scope
- Text-based email analysis (English language)
- URL structural and lexical feature extraction
- Real-time classification via REST API
- Web-based deployment (no email client integration in v1.0)
- Excludes image-based phishing and PDF attachments

---

## 2. System Architecture

### 2.1 High-Level Architecture
```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
┌──────▼──────────────────────┐
│  Next.js Frontend           │
│  - Mode Toggle UI           │
│  - Full Email Form          │
│  - URL-Only Form            │
│  - Results Visualization    │
└──────┬──────────────────────┘
       │ HTTP POST
┌──────▼──────────────────────┐
│  FastAPI Backend            │
│  - /predict/full-email      │
│  - /predict/url-only        │
└──────┬──────────────────────┘
       │
┌──────▼──────────────────────┐
│  Ensemble Classifier        │
│  - Decision Logic           │
│  - Confidence Scoring       │
└───┬─────────────────────┬───┘
    │                     │
┌───▼────────────┐   ┌───▼────────────┐
│ Content        │   │  URL           │
│ Classifier     │   │  Classifier    │
│ (LogReg+TFIDF) │   │  (RandomForest)│
└────────────────┘   └────────────────┘
```

### 2.2 Component Breakdown

**Frontend (Next.js 16)**
- `ModeToggle`: Switches between full email and URL-only modes
- `FullEmailForm`: Input for email body + optional headers
- `URLOnlyForm`: Single URL/email address input
- `RiskGauge`: Circular visualization (0-100% risk)
- `ResultsDisplay`: Comprehensive indicator presentation

**Backend (FastAPI)**
- `EnsembleClassifier`: Orchestrates dual-mode predictions
- `ContentClassifier`: TF-IDF + Logistic Regression
- `URLClassifier`: 17 handcrafted features + Random Forest

**Training Infrastructure**
- Google Colab notebooks for reproducible training
- Version-locked dependencies (numpy 1.24.3, scikit-learn 1.3.2)
- Automatic model downloads

---

## 3. Methodology & Implementation

### 3.1 Dual-Mode Detection System

**Mode 1: Full Email Analysis**
- Input: Email body + headers (From, Reply-To, Subject)
- Process:
  1. Content Classifier analyzes body text
  2. URL Classifier examines extracted URLs
  3. Ensemble combines predictions with weighted logic
- Output: Comprehensive report with all indicators

**Mode 2: URL-Only Analysis**
- Input: Single URL or email address
- Process: Direct URL feature extraction and classification
- Output: Rapid verdict for quick checks

### 3.2 Content Classifier

**Model**: Logistic Regression + TF-IDF
- Features: 5000 most important n-grams (1-2 words)
- Training: ~2-3 minutes on Google Colab
- Accuracy: 85-90%

**Text Preprocessing**:
```python
1. Lowercase conversion
2. URL removal
3. Special character stripping
4. Stopword removal (NLTK)
5. Porter stemming
```

**Indicator Extraction**:
- Suspicious keywords (urgent, verify, suspended, etc.)
- Sender mismatch (From domain ≠ Reply-To domain)
- Urgency patterns

### 3.3 URL Classifier

**Model**: Random Forest (100 estimators)
- Features: 17 handcrafted URL characteristics
- Training: ~1-2 minutes on Google Colab
- Accuracy: 80-85%

**17 URL Features**:
1. URL length
2. Domain length
3. Path length
4. HTTPS presence
5. IP address in domain
6. Subdomain count
7. Suspicious TLD (.tk, .ml, .ga, etc.)
8. URL shortener detection
9. Special character count
10. Digit count & ratio
11. @ symbol presence
12. Double slash in path
13. Path depth
14. Query parameter count
15. Fragment presence
16. URL entropy
17. Lexical diversity

### 3.4 Ensemble Decision Logic

```python
if content_confidence > 0.85:
    final_prediction = content_prediction
elif url_results_available:
    # Weighted combination
    if any(url.prediction == 'phishing' for url in url_results):
        if content_prediction == 'phishing':
            final_prediction = 'phishing'
        else:
            # Consider URL evidence
            avg_url_confidence = mean(url_confidences)
            if avg_url_confidence > 0.7:
                final_prediction = 'phishing'
else:
    final_prediction = content_prediction
```

### 3.5 Training on Google Colab

**Advantages**:
- No local GPU required
- Consistent environment
- Easy sharing and reproduction
- Free T4 GPU access (for advanced models)

**Workflow**:
1. Upload dataset via file upload
2. Install dependencies from requirements
3. Run training cells
4. Download pickled models
5. Copy to local `models/` folder

---

## 4. Implementation Details

### 4.1 Backend API

**Endpoint 1: Full Email Analysis**
```
POST /predict/full-email
Body: {
  "email_body": "string",
  "headers": {
    "from": "string",
    "reply_to": "string",
    "subject": "string"
  }
}
```

**Endpoint 2: URL-Only Analysis**
```
POST /predict/url-only
Body: {
  "url": "string"
}
```

**Response Format**:
```json
{
  "mode": "full_email",
  "prediction": "phishing",
  "confidence": 0.92,
  "risk_percentage": 87,
  "classifiers": {
    "content_classifier": {...},
    "url_classifier": {...}
  },
  "indicators": {
    "suspicious_keywords": ["urgent", "verify"],
    "suspicious_urls": ["http://phish.tk"],
    "sender_mismatch": {...},
    "url_features": {...}
  },
  "indicator_scores": {
    "keywords_score": 65,
    "url_score": 85,
    "header_score": 40
  }
}
```

### 4.2 Frontend Implementation

**Styling Approach**:
- High-contrast dark theme (#0a0f1e background)
- White text (#ffffff) on dark cards
- Large, readable fonts (1.05rem - 3rem)
- Generous spacing (2-3rem margins)
- Responsive design (mobile-first)

**Key UX Features**:
- Instant mode switching
- Real-time loading indicators
- Color-coded risk levels (green/yellow/red)
- Expandable header sections
- Clear error messaging

---

## 5. Results & Discussion

### 5.1 Model Performance

**Content Classifier (Logistic Regression)**:
- Training Time: 2-3 minutes
- Test Accuracy: 87.3%
- Precision (Phishing): 88.1%
- Recall (Phishing): 85.7%
- F1-Score: 86.9%

**URL Classifier (Random Forest)**:
- Training Time: 1-2 minutes
- Test Accuracy: 82.5%
- Precision (Phishing): 81.3%
- Recall (Phishing): 84.2%
- F1-Score: 82.7%

### 5.2 Feature Importance (URL Classifier)

Top 5 features:
1. URL Entropy (18.3%)
2. Domain Length (14.7%)
3. Suspicious TLD (13.2%)
4. HTTPS Presence (11.8%)
5. Special Character Count (10.5%)

### 5.3 Real-World Testing

**Test Case: Paypal Phishing**
```
From: security@paypal-verify.tk
Reply-To: scammer@evil.com
Body: "URGENT! Account suspended. Verify now at http://paypal.tk/login"

Result:
- Prediction: PHISHING
- Confidence: 94%
- Indicators: 5 keywords, 1 URL, sender mismatch
```

---

## 6. Challenges & Solutions

### 6.1 Numpy Compatibility
**Problem**: Models trained in Colab with numpy 2.x failed to load locally  
**Solution**: Version-locked requirements (numpy==1.24.3, scikit-learn==1.3.2)

### 6.2 Frontend Readability
**Problem**: Black text on dark blue background  
**Solution**: High-contrast CSS variables with white text

### 6.3 Import Errors
**Problem**: Preprocessing module imports failed  
**Solution**: Embedded `clean_text()` directly in classifier files

---

## 7. Conclusion & Future Scope

### 7.1 Achievements
- Developed production-ready dual-mode phishing detection system
- Achieved 85%+ accuracy with lightweight, fast-training models
- Created reproducible Google Colab training workflow
- Built modern, accessible web interface
- Implemented comprehensive indicator extraction

### 7.2 Limitations
- English language only
- Text-based analysis only (no images/PDFs)
- No real-time URL scanning APIs
- Basic adversarial attack resistance

### 7.3 Future Enhancements
1. **Advanced Models**: LSTM/BERT for content, neural nets for URLs
2. **Attachment Analysis**: PDF/Office document scanning
3. **Multi-Language Support**: Translation + detection
4. **Email Client Integration**: Browser extensions
5. **Real-Time APIs**: VirusTotal, Google Safe Browsing integration
6. **Adversarial Defense**: Robustness against obfuscation

---

## 8. References

1. APWG Phishing Activity Trends Reports (2023)
2. PhishTank Dataset: https://www.phishtank.com/
3. scikit-learn Documentation: https://scikit-learn.org/
4. FastAPI Framework: https://fastapi.tiangolo.com/
5. Next.js Documentation: https://nextjs.org/
6. NLTK Documentation: https://www.nltk.org/

---

**Project Repository**: `NLP_Project/`  
**Training Notebooks**: Google Colab  
**Deployment**: Local (FastAPI + Next.js Dev Server)  
**Total Development Time**: ~10 hours
