import React from 'react';
import HeroSection from '../components/HeroSection';
import './LandingPage.css';

const AboutPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <HeroSection />

            <section className="section-padding">
                <div className="section-title">
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>About TaskFlow</h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>Our mission is to help you master your time</p>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    padding: '60px',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2rem', color: 'white', marginBottom: '20px' }}>Our Story</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)', marginBottom: '40px' }}>
                            TaskFlow started with a simple idea: productivity shouldn't be complicated. We realized that most people spend more time managing their to-do lists than actually doing the work.
                            We wanted to change that by building an intelligent system that automates the boring stuff, so you can focus on what truly matters.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginTop: '60px' }}>
                            <div>
                                <h4 style={{ fontSize: '3rem', fontWeight: '900', color: 'white', marginBottom: '10px' }}>10k+</h4>
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Active Users</span>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '3rem', fontWeight: '900', color: 'white', marginBottom: '10px' }}>1M+</h4>
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Tasks Completed</span>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '3rem', fontWeight: '900', color: 'white', marginBottom: '10px' }}>4.9</h4>
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>App Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
