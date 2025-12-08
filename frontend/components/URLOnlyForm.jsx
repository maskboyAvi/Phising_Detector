"use client";

import { useState } from 'react';

export default function URLOnlyForm({ onAnalyze, isLoading }) {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        onAnalyze({ url: url.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-panel p-8">
                <label className="block text-lg font-semibold text-white mb-4">
                    URL or Email Address
                </label>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://suspicious-link.com or sender@example.com"
                    className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#4169E1]"
                    disabled={isLoading}
                />
                <p className="mt-3 text-sm text-gray-400">
                    Enter a suspicious URL or email address to analyze for phishing indicators
                </p>
            </div>

            <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="w-full py-4 bg-gradient-to-r from-[#4169E1] to-[#6B8AFF] text-white font-bold text-lg rounded-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Analyzing...' : 'Analyze URL'}
            </button>
        </form>
    );
}
