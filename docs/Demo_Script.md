# Demo Script - Phishing Email Detection Framework

## Presentation Flow (10-15 minutes)

### 1. Introduction (2 min)
"Good [morning/afternoon]. Today I'll demonstrate a **dual-mode phishing email detection system** that combines NLP and machine learning to identify phishing attempts in real-time."

**Key Points**:
- Phishing attacks cause billions in losses annually
- Traditional blacklists fail against new threats
- Our system analyzes both content and URLs
- Deployed as a modern web application

---

### 2. System Architecture Overview (2 min)

**Show Architecture Diagram**:
"The system consists of three layers:
1. **Frontend**: Next.js application with dual-mode interface
2. **Backend**: FastAPI with two specialized classifiers
3. **Models**: Trained on Google Colab for reproducibility"

**Highlight**:
- Content Classifier: Logistic Regression + TF-IDF (87% accuracy)
- URL Classifier: Random Forest with 17 features (82% accuracy)
- Ensemble decision logic for final predictions

---

### 3. Live Demo: Full Email Mode (4 min)

**Navigate to**: http://localhost:3000

"Let me show you how the system detects a phishing email."

**Demo Email (paste into Full Email Form)**:
```
From: security@paypal-verify.tk
Reply-To: hacker@malicious.com
Subject: URGENT - Account Suspended

Dear Customer,

Your PayPal account has been suspended due to suspicious activity.
You must verify your identity immediately to restore access.

Click here to verify: http://paypal-verify.tk/login.php

This link expires in 24 hours. Failure to verify will result in
permanent account closure.

Thank you,
PayPal Security Team
```

**Walk Through**:
1. "Notice the mode toggle at the top - we're in Full Email Mode"
2. "I'll paste the suspicious email and click Analyze"
3. **Point out results**:
   - Risk Gauge: ~90% phishing risk
   - Classifier Analysis: Both flagged as phishing
   - Suspicious Keywords: urgent, verify, suspended, account
   - URL Analysis: No HTTPS, suspicious TLD (.tk)
   - **Sender Mismatch**: "This is critical - the From domain doesn't match Reply-To"

"The system caught multiple red flags that a user might miss!"

---

### 4. Live Demo: URL-Only Mode (2 min)

**Switch to URL-Only Mode**:

"For quick checks, users can analyze just a URL."

**Test URLs**:
1. Phishing: `http://paypal-secure.tk/verify-account.php`
   - Result: HIGH RISK
   - Indicators: No HTTPS, suspicious TLD, many special characters

2. Legitimate: `https://www.google.com`
   - Result: LEGITIMATE
   - Indicators: HTTPS present, trusted TLD

"Notice how fast this is - under 1 second for URL analysis!"

---

### 5. Technical Implementation (3 min)

**Code Walkthrough** (show briefly):

**Backend - Ensemble Classifier** (`backend/classifiers/ensemble.py`)
```python
def predict_full_email(self, email_body, headers, urls):
    # Content analysis
    content_result = self.content_clf.predict(email_body, headers)
    
    # URL analysis
    url_results = [self.url_clf.predict(url) for url in urls]
    
    # Ensemble decision
    if content_result['confidence'] > 0.85:
        return content_result
    else:
        # Consider URL evidence...
```

**Frontend - Mode Toggle** (`frontend/components/ModeToggle.jsx`)
```jsx
<button onClick={() => onModeChange('full-email')}>
  Full Email Analysis
</button>
<button onClick={() => onModeChange('url-only')}>
  URL Only
</button>
```

**Training - Google Colab**
"Models trained in 3-5 minutes total using:
- phishing_dataset.csv (5,575 emails)
- phishtank_data.csv (1,000 URLs)
- Version-locked dependencies for reproducibility"

---

### 6. Key Features & Advantages (2 min)

**Unique Capabilities**:
1. **Dual-Mode Operation**: Flexibility for different use cases
2. **Interpretable Results**: Shows WHY an email is flagged
3. **Ensemble Intelligence**: Combines multiple signals
4. **Lightweight Models**: Fast training (5 min) and inference (<1 sec)
5. **Cloud Training**: No expensive local GPUs needed
6. **Modern UI**: Accessible to non-technical users

**Performance Metrics**:
- Content Accuracy: 87.3%
- URL Accuracy: 82.5%
- Latency: <500ms per prediction
- Training Time: 2-3 min (content), 1-2 min (URL)

---

### 7. Challenges Overcome

**Technical Challenges**:
1. **Numpy Compatibility**: Solved with version locking
2. **Import Errors**: Embedded preprocessing functions
3. **UI Readability**: High-contrast design with large fonts
4. **Model Portability**: Used pickle for cross-platform compatibility

---

###8. Future Enhancements

**Roadmap**:
1. Advanced models (LSTM, BERT) for higher accuracy
2. Image-based phishing detection (OCR)
3. Real-time URL scanning APIs (VirusTotal)
4. Browser extension integration
5. Multi-language support
6. PDF/attachment analysis

---

### 9. Q&A Preparation

**Expected Questions**:

**Q: "What happens if the phisher uses a legitimate domain?"**
A: "The content classifier analyzes the email body for suspicious patterns regardless of the sender domain. We also check for sender mismatches between From and Reply-To headers."

**Q: "How do you prevent adversarial attacks?"**
A: "Current version is vulnerable to sophisticated obfuscation. Future work includes adversarial training and character-level analysis to detect obfuscated text."

**Q: "Why not use pre-trained models like BERT?"**
A: "Lightweight models train faster (3 min vs 30 min) and run faster (<1 sec vs 2-3 sec). For production, BERT could improve accuracy by 3-5% but at significant cost."

**Q: "Can this integrate with email clients?"**
A: "Yes! Future version will include browser extensions for Gmail/Outlook. The API is already designed for external integration."

**Q: "How often do models need retraining?"**
A: "Phishing tactics evolve constantly. Recommended retraining: monthly for content classifier, weekly for URL classifier (using updated PhishTank data)."

---

### 10. Closing (1 min)

"To summarize:
- Built a production-ready dual-mode phishing detector
- Achieved 85%+ accuracy with fast, lightweight models
- Demonstrated real-time detection with comprehensive explanations
- Used modern stack: FastAPI, Next.js, scikit-learn
- Trained on Google Colab for accessibility

Thank you! Questions?"

---

## Demo Checklist

**Before Presentation**:
- [ ] Backend running: `cd backend && uvicorn main:app --reload`
- [ ] Frontend running: `cd frontend && npm run dev`
- [ ] Models trained and in `models/` folder
- [ ] Test URLs bookmarked
- [ ] Demo email ready in clipboard
- [ ] Architecture diagram prepared
- [ ] Code snippets highlighted in IDE

**During Demo**:
- [ ] Clear browser cache for clean demo
- [ ] Use fullscreen mode for visibility
- [ ] Zoom in on important UI elements
- [ ] Walk slowly through results
- [ ] Highlight numerical scores clearly

**Backup Plan**:
- Screenshots of successful detection
- Pre-recorded video demo
- Jupyter notebook with results
