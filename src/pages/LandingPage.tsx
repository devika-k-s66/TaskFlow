import { useNavigate } from 'react-router-dom';
import { Zap, CheckCircle, BarChart3, Clock, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            {/* Navigation */}
            <nav style={{
                padding: '20px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
            }}>
                <div className="flex items-center gap-md">
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#667eea'
                    }}>
                        <Zap size={24} />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>TaskFlow</span>
                </div>
                <button
                    className="btn btn-lg"
                    style={{ background: 'white', color: '#667eea', fontWeight: '600' }}
                    onClick={() => navigate('/login')}
                >
                    Get Started
                </button>
            </nav>

            {/* Hero Section */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '100px 40px',
                textAlign: 'center'
            }}>
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: '800',
                    color: 'white',
                    marginBottom: '24px',
                    lineHeight: '1.2'
                }}>
                    Automate Your Workload,<br />
                    <span style={{ background: 'linear-gradient(90deg, #ffd89b, #19547b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Amplify Your Productivity
                    </span>
                </h1>
                <p style={{
                    fontSize: '1.5rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '48px',
                    maxWidth: '800px',
                    margin: '0 auto 48px'
                }}>
                    AI-powered task management with smart automations, intelligent reminders,
                    and beautiful analytics. Your personal productivity assistant.
                </p>
                <button
                    className="btn btn-lg"
                    style={{
                        background: 'white',
                        color: '#667eea',
                        padding: '16px 48px',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}
                    onClick={() => navigate('/login')}
                >
                    Start Free Today
                    <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                </button>

                {/* Features Grid */}
                <div className="grid grid-4" style={{ gap: '24px', marginTop: '100px' }}>
                    {[
                        {
                            icon: <Zap size={32} />,
                            title: 'Smart Automations',
                            description: 'Create intelligent workflows that run automatically based on triggers and conditions'
                        },
                        {
                            icon: <CheckCircle size={32} />,
                            title: 'Task Management',
                            description: 'Organize, prioritize, and track all your tasks in one beautiful interface'
                        },
                        {
                            icon: <Clock size={32} />,
                            title: 'Smart Reminders',
                            description: 'Never miss a deadline with intelligent notifications across all devices'
                        },
                        {
                            icon: <BarChart3 size={32} />,
                            title: 'Analytics & Reports',
                            description: 'Track productivity with beautiful charts and actionable insights'
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                padding: '40px 32px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                transition: 'all 0.3s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                            }}
                        >
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#667eea',
                                marginBottom: '24px'
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
                                {feature.title}
                            </h3>
                            <p style={{ fontSize: '0.9375rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '60px 40px',
                    marginTop: '100px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', marginBottom: '16px' }}>
                        Ready to transform your productivity?
                    </h2>
                    <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '32px' }}>
                        Join thousands of users automating their workflow
                    </p>
                    <button
                        className="btn btn-lg"
                        style={{
                            background: 'white',
                            color: '#667eea',
                            padding: '16px 48px',
                            fontSize: '1.125rem',
                            fontWeight: '600'
                        }}
                        onClick={() => navigate('/login')}
                    >
                        Get Started - It's Free
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                padding: '40px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.875rem'
            }}>
                © 2025 TaskFlow. All rights reserved.
            </div>
        </div>
    );
}
