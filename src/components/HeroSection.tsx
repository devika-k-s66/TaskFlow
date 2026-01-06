import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HeroSection.css';
import { ArrowRight, Menu, X } from 'lucide-react';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <section className="hero-wrapper">
            <div className="hero-container">
                {/* Background Text */}
                <h1 className="hero-background-text">TASKFLOW</h1>

                {/* Floating Navbar */}
                <div className="hero-navbar-wrapper">
                    <nav className={`hero-navbar ${isMenuOpen ? 'menu-open' : ''}`}>
                        <ul className="hero-nav-links">
                            <li><Link to="/features">Features</Link></li>
                            <li><Link to="/solutions">Solutions</Link></li>
                            <li><Link to="/pricing">Pricing</Link></li>
                            <li><Link to="/about">About</Link></li>
                        </ul>
                        <div className="hero-navbar-actions">
                            <button className="hero-contact-btn" onClick={() => navigate('/login')}>
                                Sign In
                                <div className="hero-contact-arrow">
                                    <ArrowRight size={18} />
                                </div>
                            </button>
                            <button
                                className="hero-mobile-toggle"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle Menu"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
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
