"use client";

export default function RiskGauge({ riskPercentage, prediction }) {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (riskPercentage / 100) * circumference;

    const getRiskLevel = () => {
        if (riskPercentage <= 30) return { text: 'Low Risk', color: '#22c55e' };
        if (riskPercentage <= 60) return { text: 'Medium Risk', color: '#f59e0b' };
        return { text: 'High Risk', color: '#ef4444' };
    };

    const riskLevel = getRiskLevel();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
        }}>
            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Background circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#2a2a3e"
                        strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke={riskLevel.color}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                </svg>

                {/* Centered text */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    width: '100%'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        color: riskLevel.color,
                        lineHeight: '1'
                    }}>
                        {riskPercentage}%
                    </div>
                    <div style={{
                        fontSize: '1rem',
                        color: riskLevel.color,
                        marginTop: '0.5rem',
                        fontWeight: '600'
                    }}>
                        {riskLevel.text}
                    </div>
                </div>
            </div>

            <div style={{
                padding: '1rem 2rem',
                background: prediction === 'phishing' ? '#ef444410' : '#22c55e10',
                border: `2px solid ${prediction === 'phishing' ? '#ef4444' : '#22c55e'}`,
                borderRadius: '8px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '0.875rem', color: '#8895a7', marginBottom: '0.25rem' }}>
                    Classification
                </div>
                <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: prediction === 'phishing' ? '#ef4444' : '#22c55e',
                    textTransform: 'uppercase'
                }}>
                    {prediction}
                </div>
            </div>
        </div>
    );
}
