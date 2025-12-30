import { Search, Plus, Zap, Bell, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    onCreateAutomation?: () => void;
    toggleSidebar?: () => void;
}

export default function Header({ onCreateAutomation, toggleSidebar }: HeaderProps) {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();

    const handleCreateTaskClick = () => {
        navigate('/dashboard/calendar');
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <div className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {isMobile && (
                    <button
                        onClick={toggleSidebar}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Menu size={24} />
                    </button>
                )}

                {!isMobile && (
                    <div className="search-bar">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search tasks, automations..."
                        />
                    </div>
                )}
            </div>

            <div className="header-actions">
                <button className="header-btn primary" onClick={handleCreateTaskClick}>
                    <Plus size={18} />
                    <span className={isMobile ? 'sr-only' : ''}>{isMobile ? '' : 'Create Task'}</span>
                    {isMobile && <span style={{ fontSize: '0.8rem' }}>Task</span>}
                </button>
                {!isMobile && (
                    <button className="header-btn secondary" onClick={onCreateAutomation}>
                        <Zap size={18} />
                        Quick Automation
                    </button>
                )}
                <button className="notification-btn">
                    <Bell size={20} />
                    <span className="notification-badge"></span>
                </button>
                <div style={{ position: 'relative' }}>
                    <div
                        className="user-avatar"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{
                            backgroundImage: user?.photoURL ? `url(${user.photoURL})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {!user?.photoURL && (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U')}
                    </div>
                    {showUserMenu && (
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '48px',
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-lg)',
                            padding: '12px',
                            minWidth: '200px',
                            zIndex: 1000
                        }}>
                            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                                <p style={{ fontWeight: '600', fontSize: '0.9375rem', marginBottom: '4px', color: 'var(--text-primary)' }}>
                                    {user?.displayName || 'User'}
                                </p>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                    {user?.email}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--error)',
                                    fontSize: '0.9375rem',
                                    transition: 'background 0.15s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-main)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
