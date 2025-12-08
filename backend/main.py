from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import re

from classifiers.ensemble import EnsembleClassifier

app = FastAPI(title="Phishing Email Detection API", description="Dual-mode phishing detection using NLP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ensemble = EnsembleClassifier()

class FullEmailRequest(BaseModel):
    email_body: str
    headers: Optional[Dict[str, str]] = None

class URLRequest(BaseModel):
    url: str

class LegacyEmailRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Phishing Detection API - Dual Mode (Full Email | URL-Only)"}

@app.post("/predict/full-email")
def predict_full_email(request: FullEmailRequest):
    if not request.email_body:
        raise HTTPException(status_code=400, detail="No email body provided")
    
    try:
        urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', request.email_body)
        result = ensemble.predict_full_email(request.email_body, request.headers, urls)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/url-only")
def predict_url_only(request: URLRequest):
    if not request.url:
        raise HTTPException(status_code=400, detail="No URL provided")
    
    try:
        result = ensemble.predict_url_only(request.url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
def predict_legacy(request: LegacyEmailRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="No text provided")
    
    try:
        urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', request.text)
        result = ensemble.predict_full_email(request.text, None, urls)
        
        return {
            "classification": result["prediction"],
            "confidence": result["confidence"],
            "features": {
                "urls": result["indicators"]["suspicious_urls"],
                "suspicious_keywords": result["indicators"]["suspicious_keywords"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
