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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <HeroSection />

            <section className="section-padding">
                <div className="section-title">
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>Simple, Transparent Pricing</h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>Choose the plan that's right for you</p>
                </div>

                <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
                    {plans.map((plan, i) => (
                        <div key={i} className="feature-card" style={{
                            transform: plan.highlight ? 'scale(1.05)' : 'scale(1)',
                            border: plan.highlight ? '2px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.2)',
                            background: plan.highlight ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)'
                        }}>
                            {plan.highlight && (
                                <div style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    background: '#f59e0b',
                                    color: 'white',
                                    padding: '5px 15px',
                                    borderBottomLeftRadius: '10px',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem'
                                }}>POPULAR</div>
                            )}
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{plan.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '20px' }}>
                                <span style={{ fontSize: '3rem', fontWeight: '800', color: 'white' }}>{plan.price}</span>
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>/ {plan.period}</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                                {plan.features.map((feat, idx) => (
                                    <li key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '12px',
                                        color: 'rgba(255,255,255,0.9)',
                                        fontSize: '1rem'
                                    }}>
                                        <Check size={18} color="#10b981" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => navigate('/login')} style={{
                                width: '100%',
                                padding: '15px',
                                borderRadius: '100px',
                                border: 'none',
                                background: plan.highlight ? 'white' : 'rgba(255,255,255,0.1)',
                                color: plan.highlight ? '#667eea' : 'white',
                                fontWeight: '700',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}>
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
