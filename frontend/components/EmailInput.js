"use client";

import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export default function EmailInput({ onAnalyze, isLoading }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAnalyze(text);
        }
    };

    return (
        <div className="mb-16">

            {/* Single Column: Paste Email Content */}
            <div className="border-2 border-[#2a2a3e] rounded-lg bg-gradient-to-br from-[#0f0f1f]/80 to-[#1a1a2e]/60 backdrop-blur-sm glow-border mb-8" style={{ paddingLeft: '40px', paddingRight: '40px', paddingTop: '32px', paddingBottom: '32px' }}>
                <h3 className="text-lg font-semibold text-white mb-6">Paste Email Content</h3>
                <form onSubmit={handleSubmit}>
                    <TextareaAutosize
                        minRows={10}
                        maxRows={20}
                        className="w-full bg-[#1a1a2e] border-2 border-[#2a2a3e] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4169E1] transition-colors resize-none"
                        placeholder="Paste email content here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isLoading}
                        style={{ fontSize: '15px', lineHeight: '1.6', paddingLeft: '20px', paddingRight: '20px', paddingTop: '16px', paddingBottom: '16px' }}
                    />
                </form>
            </div>

            {/* Analyze Button - Larger and Fatter */}
            <button
                onClick={handleSubmit}
                disabled={!text.trim() || isLoading}
                className="w-full bg-gradient-to-r from-[#4169E1] to-[#5B7FFF] hover:from-[#2952CC] hover:to-[#4169E1] text-white font-bold rounded-lg border-2 border-[#5179F1] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl"
                style={{ boxShadow: '0 4px 15px rgba(65, 105, 225, 0.3)', paddingTop: '24px', paddingBottom: '24px' }}
            >
                {isLoading ? 'Analyzing...' : 'Analyze Email'}
            </button>
        </div>
    );
}
