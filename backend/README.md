# Backend - Phishing Detection API

FastAPI backend with ML classifiers for phishing detection.

## Installation

```bash
pip install -r requirements.txt
```

## Run Server

```bash
uvicorn main:app --reload
```

Backend runs at: **http://localhost:8000**

API docs: **http://localhost:8000/docs**

## Requirements

- Python 3.11+
- numpy==1.26.4
- scikit-learn==1.4.2
- FastAPI==0.110.0

## Endpoints

- `POST /predict/full-email` - Analyze complete email
- `POST /predict/url-only` - Analyze single URL
