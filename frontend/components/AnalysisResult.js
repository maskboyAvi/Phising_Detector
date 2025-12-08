"use client";

import { Link2, FileText, Paperclip } from 'lucide-react';

export default function AnalysisResult({ result }) {
    if (!result) return null;

    const isPhishing = result.classification === 'phishing';
    const confidencePercent = (result.confidence * 100).toFixed(1);

    // Risk percentage represents the likelihood of the email being malicious
    const riskPercent = isPhishing
        ? confidencePercent
        : (100 - parseFloat(confidencePercent)).toFixed(1);

    // Determine risk level based on risk percentage
    const getRiskLevel = () => {
        const risk = parseFloat(riskPercent);
        if (isPhishing) {
            if (risk >= 70) return 'High Risk';
            if (risk >= 40) return 'Medium Risk';
            return 'Low Risk';
        } else {
            if (risk >= 70) return 'Low Risk';
            if (risk >= 40) return 'Medium Risk';
            return 'High Risk';
        }
    };

    // Color scheme based on phishing detection
    const primaryColor = isPhishing ? '#FF8C42' : '#5B7FFF';

    return (
        <div className="space-y-8">
            {/* Bottom Section: NLP Model Classification */}
            <div
                className="border-2 rounded-lg bg-gradient-to-br from-[#0f0f1f]/80 to-[#1a1a2e]/60 backdrop-blur-sm"
                style={{
                    borderColor: isPhishing ? 'rgba(255, 140, 66, 0.3)' : 'rgba(65, 105, 225, 0.3)',
                    boxShadow: isPhishing
                        ? '0 0 15px rgba(255, 140, 66, 0.15)'
                        : '0 0 15px rgba(65, 105, 225, 0.15)',
                    paddingLeft: '40px',
                    paddingRight: '40px',
                    paddingTop: '32px',
                    paddingBottom: '32px'
                }}
            >
                <h3 className="text-lg font-semibold text-white mb-6">NLP Model Classification</h3>

                {/* Classification Banner - Bigger and Fatter */}
                <div
                    className="rounded-lg text-center mb-4"
                    style={{
                        background: isPhishing
                            ? 'linear-gradient(to right, #FF6B35, #FF8C42)'
                            : 'linear-gradient(to right, #4169E1, #6B8AFF)',
                        boxShadow: isPhishing
                            ? '0 0 20px rgba(255, 107, 53, 0.2), 0 4px 20px rgba(255, 107, 53, 0.4)'
                            : '0 0 20px rgba(65, 105, 225, 0.5), 0 4px 20px rgba(65, 105, 225, 0.4)',
                        paddingTop: '28px',
                        paddingBottom: '28px',
                        paddingLeft: '32px',
                        paddingRight: '32px'
                    }}
                >
                    <div className="text-3xl font-bold text-white tracking-wide">
                        {isPhishing ? 'PHISHING EMAIL DETECTED' : 'LEGITIMATE EMAIL'}
                    </div>
                </div>

                {/* Confidence Score Below */}
                {/* <div className="text-center py-3">
                    <div className="text-white/80 text-base">
                        Confidence Score: {confidencePercent}%
                    </div>
                </div> */}
            </div>
            {/* Top Section: Score and Extracted Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left: Phishing Detection Score with Circular Gauge */}
                <div
                    className="border-2 rounded-lg bg-gradient-to-br from-[#0f0f1f]/80 to-[#1a1a2e]/60 backdrop-blur-sm"
                    style={{
                        borderColor: isPhishing ? 'rgba(255, 140, 66, 0.3)' : 'rgba(65, 105, 225, 0.3)',
                        boxShadow: isPhishing
                            ? '0 0 15px rgba(255, 140, 66, 0.15)'
                            : '0 0 15px rgba(65, 105, 225, 0.15)',
                        paddingLeft: '40px',
                        paddingRight: '40px',
                        paddingTop: '32px',
                        paddingBottom: '32px'
                    }}
                >
                    <h3 className="text-lg font-semibold text-white mb-8">Phishing Detection Score</h3>
                    <div className="flex flex-col items-center justify-center py-4">
                        {/* Circular Gauge Container */}
                        <div className="relative" style={{ width: '240px', height: '240px' }}>
                            {/* SVG Circle */}
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
                                {/* Background circle */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="75"
                                    fill="none"
                                    stroke="#1a1a2e"
                                    strokeWidth="14"
                                />
                                {/* Progress circle with dynamic gradient */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="75"
                                    fill="none"
                                    stroke={`url(#gaugeGradient-${isPhishing ? 'phishing' : 'safe'})`}
                                    strokeWidth="14"
                                    strokeDasharray={`${(parseFloat(riskPercent) / 100) * 471} 471`}
                                    strokeLinecap="round"
                                    style={{
                                        transition: 'stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                        filter: isPhishing
                                            ? 'drop-shadow(0 0 10px rgba(255, 140, 66, 0.7))'
                                            : 'drop-shadow(0 0 10px rgba(91, 127, 255, 0.7))'
                                    }}
                                />
                                <defs>
                                    <linearGradient id="gaugeGradient-phishing" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FF6B35" />
                                        <stop offset="50%" stopColor="#FF8C42" />
                                        <stop offset="100%" stopColor="#FFA566" />
                                    </linearGradient>
                                    <linearGradient id="gaugeGradient-safe" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#5B7FFF" />
                                        <stop offset="50%" stopColor="#4169E1" />
                                        <stop offset="100%" stopColor="#7B9CFF" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            {/* Centered Percentage Text - Absolutely positioned */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <div
                                    className="font-bold text-white"
                                    style={{
                                        fontSize: '48px',
                                        lineHeight: '1',
                                        textShadow: isPhishing
                                            ? '0 0 20px rgba(255, 140, 66, 0.4)'
                                            : '0 0 20px rgba(91, 127, 255, 0.4)'
                                    }}
                                >
                                    {riskPercent}%
                                </div>
                            </div>
                        </div>
                        {/* Risk Level Label Below Circle */}
                        <div className="text-gray-300 text-base font-medium mt-6">{getRiskLevel()}</div>
                    </div>
                </div>

                {/* Right: Extracted Information */}
                <div
                    className="border-2 rounded-lg bg-gradient-to-br from-[#0f0f1f]/80 to-[#1a1a2e]/60 backdrop-blur-sm"
                    style={{
                        borderColor: isPhishing ? 'rgba(255, 140, 66, 0.3)' : 'rgba(65, 105, 225, 0.3)',
                        boxShadow: isPhishing
                            ? '0 0 15px rgba(255, 140, 66, 0.15)'
                            : '0 0 15px rgba(65, 105, 225, 0.15)',
                        paddingLeft: '40px',
                        paddingRight: '40px',
                        paddingTop: '32px',
                        paddingBottom: '32px'
                    }}
                >
                    <h3 className="text-lg font-semibold text-white mb-6">Extracted Information</h3>

                    <div className="space-y-6">
                        {/* Suspicious Links */}
                        <div>
                            <div className="flex items-start gap-3 text-gray-300 mb-3">
                                <Link2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} />
                                <div className="flex-1">
                                    <span className="font-medium block mb-2 text-sm">Suspicious Links:</span>
                                    {result.features?.urls?.length > 0 ? (
                                        result.features.urls.map((url, i) => (
                                            <a
                                                key={i}
                                                href="#"
                                                className="text-sm block mb-1 break-all hover:underline"
                                                style={{ color: primaryColor }}
                                            >
                                                {url}
                                            </a>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-sm">None detected</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            &nbsp;
                        </div>
                        {/* Keywords */}
                        <div>
                            <div className="flex items-start gap-3 text-gray-300 mb-3">
                                <FileText className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} />
                                <div className="flex-1">
                                    <span className="font-medium block mb-2 text-sm">Keywords:</span>
                                    {result.features?.suspicious_keywords?.length > 0 ? (
                                        <p className="text-sm text-gray-300">
                                            {result.features.suspicious_keywords.map(k => `"${k}"`).join(', ')}
                                        </p>
                                    ) : (
                                        <span className="text-gray-500 text-sm">None detected</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Attachments */}
                        {/* <div>
                            <div className="flex items-start gap-3 text-gray-300 mb-3">
                                <Paperclip className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} />
                                <div className="flex-1">
                                    <span className="font-medium block mb-2 text-sm">Attachments:</span>
                                    <span className="text-gray-500 text-sm">Not analyzed (text-only mode)</span>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>



        </div>
    );
}
