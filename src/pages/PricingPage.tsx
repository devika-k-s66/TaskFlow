import React from 'react';
import HeroSection from '../components/HeroSection';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const PricingPage: React.FC = () => {
    const navigate = useNavigate();

    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "forever",
            features: [
                "Basic Task Management",
                "5 Automations",
                "Daily Reminders",
                "Simple Calendar View"
            ],
            cta: "Get Started",
            highlight: false
        },
        {
            name: "Pro",
            price: "$9",
            period: "per month",
            features: [
                "Unlimited Automations",
                "Advanced Insights & Reports",
                "Multi-platform Notifications",
                "Priority Support",
                "Custom Routines"
            ],
            cta: "Start Free Trial",
            highlight: true
        },
        {
            name: "Team",
            price: "$29",
            period: "per month",
            features: [
                "Everything in Pro",
                "Team Collaboration",
                "Shared Workspaces",
                "Admin Controls",
                "API Access"
            ],
            cta: "Contact Sales",
            highlight: false
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--gradient-main)'
        }}>
            <HeroSection />

            <section className="section-padding" style={{ paddingTop: '80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 className="section-title" style={{ marginBottom: '24px' }}>Simple, Transparent Pricing</h2>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'rgba(255,255,255,0.7)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Choose the plan that's right for you. No hidden fees.
                    </p>
                </div>

                <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
                    {plans.map((plan, i) => (
                        <div key={i} className="feature-card animate-fade-in" style={{
                            animationDelay: `${i * 0.1}s`,
                            transform: plan.highlight ? 'scale(1.05)' : 'scale(1)',
                            border: plan.highlight ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                            background: plan.highlight ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                            position: 'relative'
                        }}>
                            {plan.highlight && (
                                <div style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    background: '#f59e0b',
                                    color: 'white',
                                    padding: '6px 16px',
                                    borderBottomLeftRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '0.8rem',
                                    letterSpacing: '0.05em'
                                }}>MOST POPULAR</div>
                            )}
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>{plan.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '32px' }}>
                                <span style={{ fontSize: '3.5rem', fontWeight: '800', color: 'white' }}>{plan.price}</span>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>/ {plan.period}</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px' }}>
                                {plan.features.map((feat, idx) => (
                                    <li key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        marginBottom: '16px',
                                        color: '#cbd5e1',
                                        fontSize: '1rem'
                                    }}>
                                        <div style={{
                                            padding: '4px',
                                            borderRadius: '50%',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Check size={14} color="#10b981" />
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => navigate('/login')} style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: 'none',
                                background: plan.highlight ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                color: plan.highlight ? 'black' : 'white',
                                fontWeight: '600',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: plan.highlight ? '0 10px 30px -10px var(--primary)' : 'none'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    if (plan.highlight) e.currentTarget.style.boxShadow = '0 20px 40px -10px var(--primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    if (plan.highlight) e.currentTarget.style.boxShadow = '0 10px 30px -10px var(--primary)';
                                }}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PricingPage;
