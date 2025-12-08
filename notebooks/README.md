# Model Training

Google Colab notebooks for training phishing detection models.

## Notebooks

1. **Colab_Train_Content_Classifier.ipynb** - Email content analysis
2. **Colab_Train_URL_Classifier.ipynb** - URL feature analysis

## Training Steps

1. Open notebook in Google Colab
2. Upload dataset when prompted
3. Run all cells
4. Download trained models
5. Copy `.pkl` files to `../models/` directory

## Datasets Required

- `phishing_dataset.csv` - For content classifier
- `phishtank_data.csv` - For URL classifier

## Training Time

- Content: ~2-3 minutes
- URL: ~1-2 minutes

## Output

- `content_classifier_basic.pkl`
- `content_vectorizer.pkl`
- `url_classifier_basic.pkl`
