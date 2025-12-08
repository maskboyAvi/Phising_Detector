"use client";

import { useState } from 'react';

export default function ModeToggle({ mode, onModeChange }) {
    return (
        <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg p-1 bg-[#1a1a2e] border border-[#2a2a3e]">
                <button
                    onClick={() => onModeChange('full-email')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${mode === 'full-email'
                            ? 'bg-gradient-to-r from-[#4169E1] to-[#6B8AFF] text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Full Email Analysis
                </button>
                <button
                    onClick={() => onModeChange('url-only')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${mode === 'url-only'
                            ? 'bg-gradient-to-r from-[#4169E1] to-[#6B8AFF] text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    URL/Email Only
                </button>
            </div>
        </div>
    );
}
