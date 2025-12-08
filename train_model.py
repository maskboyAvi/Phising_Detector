import pandas as pd
import pickle
import os
import sys
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

# Add parent directory to path
sys.path.append(os.path.dirname(__file__))
from preprocessing.clean_text import clean_text

def train():
    print("Loading data...")
    data_path = os.path.join('data', 'phishing_dataset.csv')
    if not os.path.exists(data_path):
        print("Data file not found!")
        return

    df = pd.read_csv(data_path)
    print(f"Data loaded. Shape: {df.shape}")

    print("Cleaning text...")
    df['cleaned_text'] = df['text'].apply(clean_text)

    X = df['cleaned_text']
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Vectorizing...")
    tfidf = TfidfVectorizer(max_features=5000)
    X_train_tfidf = tfidf.fit_transform(X_train)
    X_test_tfidf = tfidf.transform(X_test)

    print("Training SVM model...")
    model = SVC(probability=True, kernel='linear')
    model.fit(X_train_tfidf, y_train)

    y_pred = model.predict(X_test_tfidf)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc:.4f}")

    # Save artifacts
    if not os.path.exists('models'):
        os.makedirs('models')
        
    with open('models/tfidf_vectorizer.pkl', 'wb') as f:
        pickle.dump(tfidf, f)
    
    with open('models/phishing_model.pkl', 'wb') as f:
        pickle.dump(model, f)
        
    print("Model and vectorizer saved to models/")

if __name__ == "__main__":
    train()
