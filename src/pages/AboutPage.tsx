import React from 'react';
import HeroSection from '../components/HeroSection';
import './LandingPage.css';

const AboutPage: React.FC = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--gradient-main)'
        }}>
            <HeroSection />

            <section className="section-padding" style={{ paddingTop: '80px' }}>
                <div className="section-title">
                    <h2 style={{ marginBottom: '24px' }}>About TaskFlow</h2>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'rgba(255,255,255,0.7)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Our mission is to help you master your time
                    </p>
                </div>

                <div className="animate-fade-in" style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    padding: '80px 40px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2rem', color: 'white', marginBottom: '32px' }}>Our Story</h3>
                        <p style={{
                            fontSize: '1.15rem',
                            lineHeight: '1.9',
                            color: '#cbd5e1',
                            marginBottom: '60px'
                        }}>
                            TaskFlow started with a simple idea: productivity shouldn't be complicated. We realized that most people spend more time managing their to-do lists than actually doing the work.
                            We wanted to change that by building an intelligent system that automates the boring stuff, so you can focus on what truly matters.
                        </p>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '40px',
                            marginTop: '60px',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            paddingTop: '60px'
                        }}>
                            <div>
                                <h4 style={{
                                    fontSize: '3.5rem',
                                    fontWeight: '800',
                                    color: 'transparent',
                                    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                                    WebkitBackgroundClip: 'text',
                                    marginBottom: '16px'
                                }}>10k+</h4>
                                <span style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: '500' }}>Active Users</span>
                            </div>
                            <div>
                                <h4 style={{
                                    fontSize: '3.5rem',
                                    fontWeight: '800',
                                    color: 'transparent',
                                    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                                    WebkitBackgroundClip: 'text',
                                    marginBottom: '16px'
                                }}>1M+</h4>
                                <span style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: '500' }}>Tasks Completed</span>
                            </div>
                            <div>
                                <h4 style={{
                                    fontSize: '3.5rem',
                                    fontWeight: '800',
                                    color: 'transparent',
                                    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                                    WebkitBackgroundClip: 'text',
                                    marginBottom: '16px'
                                }}>4.9</h4>
                                <span style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: '500' }}>App Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
