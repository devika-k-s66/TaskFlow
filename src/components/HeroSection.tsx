import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HeroSection.css';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="hero-wrapper">
            <div className="hero-container">
                {/* Background Text */}
                <h1 className="hero-background-text">TASKFLOW</h1>

                {/* Floating Navbar */}
                <div className="hero-navbar-wrapper">
                    <nav className="hero-navbar">
                        <ul className="hero-nav-links">
                            <li><Link to="/features">Features</Link></li>
                            <li><Link to="/solutions">Solutions</Link></li>
                            <li><Link to="/pricing">Pricing</Link></li>
                            <li><Link to="/about">About</Link></li>
                        </ul>
                        <button className="hero-contact-btn" onClick={() => navigate('/login')}>
                            Sign In
                            <div className="hero-contact-arrow">
                                <ArrowRight size={18} />
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Character Image */}
                <div className="hero-character">
                    <img
                        src="/images/taskflow-bot.png"
                        alt="TaskFlow Bot"
                        className="hero-character-img"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
