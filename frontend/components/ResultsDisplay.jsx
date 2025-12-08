"use client";

import RiskGauge from './RiskGauge';

export default function ResultsDisplay({ result }) {
    const { mode, prediction, confidence, risk_percentage, classifiers, indicators, indicator_scores } = result;

    return (
        <div className="space-y-8">
            <div className="glass-panel p-8 flex justify-center">
                <RiskGauge riskPercentage={risk_percentage} prediction={prediction} />
            </div>

            {mode === 'full_email' && classifiers && (
                <div className="glass-panel p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">Classifier Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div style={{
                            background: '#1a2332',
                            border: '1px solid #2d3748',
                            borderRadius: '12px',
                            padding: '1.5rem'
                        }}>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#8895a7',
                                marginBottom: '0.75rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                Content Classifier
                            </p>
                            <p style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#ffffff',
                                marginBottom: '0.5rem',
                                textTransform: 'capitalize'
                            }}>
                                {classifiers.content_classifier.prediction}
                            </p>
                            <p style={{
                                fontSize: '1rem',
                                color: '#b8c5d6'
                            }}>
                                Confidence: {(classifiers.content_classifier.confidence * 100).toFixed(1)}%
                            </p>
                        </div>
                        <div style={{
                            background: '#1a2332',
                            border: '1px solid #2d3748',
                            borderRadius: '12px',
                            padding: '1.5rem'
                        }}>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#8895a7',
                                marginBottom: '0.75rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                URL Classifier
                            </p>
                            <p style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#ffffff',
                                marginBottom: '0.5rem',
                                textTransform: 'capitalize'
                            }}>
                                {classifiers.url_classifier.prediction === 'N/A' ? 'N/A' : classifiers.url_classifier.prediction}
                            </p>
                            <p style={{
                                fontSize: '1rem',
                                color: '#b8c5d6'
                            }}>
                                Confidence: {classifiers.url_classifier.confidence ? (classifiers.url_classifier.confidence * 100).toFixed(1) + '%' : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {indicators && (
                <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Detected Indicators</h3>
                    <div className="space-y-4">
                        {indicators.suspicious_keywords && indicators.suspicious_keywords.length > 0 && (
                            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-4">
                                <p className="text-sm font-semibold text-gray-300 mb-3">Suspicious Keywords</p>
                                <div className="flex flex-wrap gap-3">
                                    {indicators.suspicious_keywords.map((keyword, idx) => (
                                        <span
                                            key={idx}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#ef444420',
                                                color: '#ef4444',
                                                borderRadius: '9999px',
                                                fontSize: '0.95rem',
                                                border: '1px solid #ef444440',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {indicators.suspicious_urls && indicators.suspicious_urls.length > 0 && (
                            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-4">
                                <p className="text-sm font-semibold text-gray-300 mb-2">Detected URLs</p>
                                <div className="space-y-2">
                                    {indicators.suspicious_urls.map((url, idx) => (
                                        <div key={idx} className="text-sm text-orange-400 break-all font-mono bg-orange-500/10 p-2 rounded border border-orange-500/30">
                                            {url}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {indicators.sender_mismatch && indicators.sender_mismatch.detected && (
                            <div className="bg-[#1a1a2e] border border-red-500/30 rounded-lg p-4">
                                <p className="text-sm font-semibold text-red-400 mb-2">⚠️ Sender Mismatch Detected</p>
                                <div className="text-sm text-gray-300 space-y-1">
                                    <p><span className="text-gray-400">From:</span> {indicators.sender_mismatch.from_domain}</p>
                                    <p><span className="text-gray-400">Reply-To:</span> {indicators.sender_mismatch.reply_to_domain}</p>
                                </div>
                            </div>
                        )}

                        {indicators.url_features && Object.keys(indicators.url_features).length > 0 && (
                            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-4">
                                <p className="text-sm font-semibold text-gray-300 mb-3">URL Features</p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {indicators.url_features.domain && (
                                        <div>
                                            <span className="text-gray-400">Domain:</span>
                                            <span className="ml-2 text-white font-mono">{indicators.url_features.domain}</span>
                                        </div>
                                    )}
                                    {indicators.url_features.no_https && (
                                        <div className="text-orange-400">⚠️ No HTTPS</div>
                                    )}
                                    {indicators.url_features.suspicious_tld && (
                                        <div className="text-red-400">⚠️ Suspicious TLD</div>
                                    )}
                                    {indicators.url_features.has_ip_address && (
                                        <div className="text-red-400">⚠️ IP Address in URL</div>
                                    )}
                                    {indicators.url_features.url_shortener && (
                                        <div className="text-yellow-400">⚠️ URL Shortener</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {indicator_scores && (
                <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Indicator Risk Scores</h3>
                    <div className="space-y-4">
                        {indicator_scores.keywords_score > 0 && (
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">Keywords</span>
                                    <span className="text-white font-semibold">{indicator_scores.keywords_score}/100</span>
                                </div>
                                <div className="h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                                        style={{ width: `${indicator_scores.keywords_score}%` }}
                                    />
                                </div>
                            </div>
                        )}
                        {indicator_scores.url_score > 0 && (
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">URL Analysis</span>
                                    <span className="text-white font-semibold">{indicator_scores.url_score}/100</span>
                                </div>
                                <div className="h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                                        style={{ width: `${indicator_scores.url_score}%` }}
                                    />
                                </div>
                            </div>
                        )}
                        {indicator_scores.header_score > 0 && (
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">Email Headers</span>
                                    <span className="text-white font-semibold">{indicator_scores.header_score}/100</span>
                                </div>
                                <div className="h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                                        style={{ width: `${indicator_scores.header_score}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
