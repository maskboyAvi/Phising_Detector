"use client";

import { useState } from 'react';

export default function FullEmailForm({ onAnalyze, isLoading }) {
    const [emailBody, setEmailBody] = useState('');
    const [showHeaders, setShowHeaders] = useState(false);
    const [headers, setHeaders] = useState({
        from: '',
        reply_to: '',
        subject: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!emailBody.trim()) return;

        const payload = {
            email_body: emailBody,
            headers: showHeaders ? headers : null
        };

        onAnalyze(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-panel p-8">
                <label className="block text-lg font-semibold text-white mb-4">
                    Email Content
                </label>
                <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Paste the complete email content here..."
                    rows={Math.max(10, emailBody.split('\n').length)}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#1a1a2e',
                        border: '1px solid #2a2a3e',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '1rem',
                        fontFamily: 'monospace',
                        resize: 'vertical',
                        minHeight: '250px'
                    }}
                    disabled={isLoading}
                />
            </div>

            <div className="glass-panel p-6">
                <button
                    type="button"
                    onClick={() => setShowHeaders(!showHeaders)}
                    className="flex items-center justify-between w-full text-left text-white font-medium hover:text-[#6B8AFF] transition-colors"
                >
                    <span>Email Headers (Optional)</span>
                    <span className="text-2xl">{showHeaders ? '−' : '+'}</span>
                </button>

                {showHeaders && (
                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">From Address</label>
                            <input
                                type="text"
                                value={headers.from}
                                onChange={(e) => setHeaders({ ...headers, from: e.target.value })}
                                placeholder="sender@example.com"
                                className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4169E1]"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Reply-To Address</label>
                            <input
                                type="text"
                                value={headers.reply_to}
                                onChange={(e) => setHeaders({ ...headers, reply_to: e.target.value })}
                                placeholder="reply@example.com"
                                className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4169E1]"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Subject</label>
                            <input
                                type="text"
                                value={headers.subject}
                                onChange={(e) => setHeaders({ ...headers, subject: e.target.value })}
                                placeholder="Email subject line"
                                className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4169E1]"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading || !emailBody.trim()}
                className="w-full py-4 bg-gradient-to-r from-[#4169E1] to-[#6B8AFF] text-white font-bold text-lg rounded-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Analyzing...' : 'Analyze Email'}
            </button>
        </form>
    );
}
