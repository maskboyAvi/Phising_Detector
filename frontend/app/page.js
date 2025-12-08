"use client";

import { useState } from 'react';
import axios from 'axios';
import ModeToggle from '@/components/ModeToggle';
import FullEmailForm from '@/components/FullEmailForm';
import URLOnlyForm from '@/components/URLOnlyForm';
import ResultsDisplay from '@/components/ResultsDisplay';

export default function HomePage() {
  const [mode, setMode] = useState('full-email');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear results when mode changes
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async (payload) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = mode === 'full-email'
        ? 'http://localhost:8000/predict/full-email'
        : 'http://localhost:8000/predict/url-only';

      const response = await axios.post(endpoint, payload);
      setResult(response.data);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze. Please ensure the backend server is running at http://localhost:8000");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      padding: '3rem 2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '3rem',
          letterSpacing: '-0.02em'
        }}>
          Phishing Email Detection
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Advanced NLP-based phishing detection with dual-mode analysis
        </p>

        <ModeToggle mode={mode} onModeChange={handleModeChange} />

        {mode === 'full-email' ? (
          <FullEmailForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        ) : (
          <URLOnlyForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}

        {isLoading && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-white mb-6">
              Analyzing... Running {mode === 'full-email' ? 'Content & URL' : 'URL'} Classifier
            </h2>
            <div className="max-w-md mx-auto">
              <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden border border-[#2a2a3e]">
                <div className="h-full bg-gradient-to-r from-[#4169E1] to-[#6B8AFF] animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-16">
            <h1 className="text-4xl font-bold text-white text-center mb-12">
              Analysis Results
            </h1>
            <ResultsDisplay result={result} />
          </div>
        )}
      </div>
    </main>
  );
}
