# Phishing Email Detection System

Dual-mode phishing detection using NLP and machine learning. Analyzes email content and URLs to identify phishing attempts with comprehensive indicator extraction.

**Demo Video :** https://youtu.be/PWgZXcUmApw
## Features

- **Dual-Mode Analysis**
  - Full Email: Complete content + headers + URLs
  - URL-Only: Quick link verification
- **ML Models**
  - Content Classifier: Logistic Regression + TF-IDF (87% accuracy)
  - URL Classifier: Random Forest with 17 features (82% accuracy)
- **Real-Time Detection**: <1 second response
- **Interpretable Results**: Shows suspicious keywords, sender mismatches, URL features

## Quick Start

### 1. Train Models (Google Colab)

See `notebooks/` directory for training instructions. Models are trained in Google Colab - no local GPU required (~5 minutes total).

### 2. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Access: **http://localhost:3000**

## Project Structure

```
├── backend/           # FastAPI server
├── frontend/          # Next.js application
├── models/            # Trained ML models (.pkl files)
├── notebooks/         # Google Colab training notebooks
├── data/              # Datasets
└── docs/              # Detailed documentation
```

## Documentation

- **Demo Script**: `docs/Demo_Script.md`
- **Presentation**: `docs/Presentation_Slides.md`
- **Project Report**: `docs/Project_Report.md`

## Tech Stack

- **Backend**: Python 3.11, FastAPI, scikit-learn, NLTK
- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Training**: Google Colab, Jupyter notebooks

## Performance

- Content Classifier: 87.3% accuracy
- URL Classifier: 82.5% accuracy
- Latency: <500ms per prediction
- Training Time: 5 minutes (both models)

## License

MIT License - See LICENSE file

## Authors

Aviral Katiyar

Kashish Garg

Yash Agarwal

Neelesh Saxena

Kshitij Gupta
