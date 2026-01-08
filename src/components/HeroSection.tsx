import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HeroSection.css';
import { ArrowRight, Menu, X } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <section className="hero-wrapper">
            <div className="hero-container">
                {/* Floating Navbar */}
                <div className="hero-navbar-wrapper">
                    <nav className={`hero-navbar ${isMenuOpen ? 'menu-open' : ''}`}>
                        <ul className="hero-nav-links">
                            <li><Link to="/features">Features</Link></li>

                            <li><Link to="/pricing">Pricing</Link></li>
                            <li><Link to="/about">About</Link></li>
                        </ul>
                        <div className="hero-navbar-actions">
                            {user ? (
                                <div
                                    className="user-avatar"
                                    onClick={() => navigate('/dashboard')}
                                    title="Go to Dashboard"
                                    style={{
                                        ...(user?.photoURL ? { backgroundImage: `url(${user.photoURL})` } : {}),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {!user?.photoURL && (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U')}
                                </div>
                            ) : (
                                <button className="hero-contact-btn" onClick={() => navigate('/login')}>
                                    Sign In
                                    <div className="hero-contact-arrow">
                                        <ArrowRight size={18} />
                                    </div>
                                </button>
                            )}
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

                {/* Background Text */}
                <h1 className="hero-background-text">TASKFLOW</h1>

                <div className="hero-mobile-actions">
                    {user ? (
                        <button className="hero-contact-btn mobile-only" onClick={() => navigate('/dashboard')}>
                            Dashboard
                            <div className="hero-contact-arrow">
                                <ArrowRight size={18} />
                            </div>
                        </button>
                    ) : (
                        <button className="hero-contact-btn mobile-only" onClick={() => navigate('/login')}>
                            Sign In
                            <div className="hero-contact-arrow">
                                <ArrowRight size={18} />
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
