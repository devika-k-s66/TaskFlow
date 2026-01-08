import { Search, Plus, Zap, Bell, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    onCreateTask?: () => void;
    onCreateAutomation?: () => void;
    toggleSidebar?: () => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
}

export default function Header({ onCreateTask, onCreateAutomation, toggleSidebar, searchQuery = '', setSearchQuery }: HeaderProps) {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth < 1024);
    const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 380);
    const navigate = useNavigate();

    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleCreateTaskClick = () => {
        if (onCreateTask) {
            onCreateTask();
        } else {
            navigate('/dashboard/calendar');
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width < 768;
            setIsMobile(mobile);
            setIsTablet(width < 1024);
            setIsSmallMobile(width < 380);
            if (!mobile) setIsSearchOpen(false);
        };
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

    // Mobile Search Open View
    if (isSearchOpen && isMobile) {
        return (
            <div className="header" style={{ padding: isSmallMobile ? '0 12px' : '0 32px', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search className="search-icon" size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery?.(e.target.value)}
                        autoFocus
                        style={{ width: '100%', paddingLeft: '40px' }}
                    />
                </div>
                <button
                    onClick={() => setIsSearchOpen(false)}
                    style={{
                        background: 'none', border: 'none', color: 'var(--text-muted)',
                        padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <X size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="header" style={{ padding: isSmallMobile ? '0 12px' : '0 var(--spacing-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isSmallMobile ? '8px' : '16px' }}>
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
                    <div className="search-bar" style={{ flex: isTablet ? '0 0 200px' : '0 0 360px' }}>
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder={isTablet ? "Search..." : "Search tasks, automations..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery?.(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="header-actions" style={{ gap: isSmallMobile ? '4px' : (isTablet ? '8px' : 'var(--spacing-md)') }}>
                {isMobile && (
                    <button
                        className="header-btn"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            padding: isSmallMobile ? '4px' : '10px 18px',
                            minWidth: 'auto'
                        }}
                        onClick={() => setIsSearchOpen(true)}
                    >
                        <Search size={20} />
                    </button>
                )}
                <button
                    className="header-btn primary"
                    onClick={handleCreateTaskClick}
                    style={{
                        padding: isSmallMobile ? '6px 10px' : '10px 18px',
                        fontSize: isSmallMobile ? '0.8rem' : '0.9375rem',
                        gap: isSmallMobile ? '4px' : '8px'
                    }}
                >
                    <Plus size={isSmallMobile ? 14 : 18} />
                    <span>{isMobile ? 'Task' : 'Create Task'}</span>
                </button>
                {!isMobile && (
                    <button className="header-btn secondary" onClick={onCreateAutomation}>
                        <Zap size={18} />
                        Quick Automation
                    </button>
                )}
                <button
                    className="notification-btn"
                    style={{
                        width: isSmallMobile ? '32px' : '40px',
                        height: isSmallMobile ? '32px' : '40px'
                    }}
                >
                    <Bell size={isSmallMobile ? 16 : 20} />
                    <span
                        className="notification-badge"
                        style={{
                            top: isSmallMobile ? '6px' : '8px',
                            right: isSmallMobile ? '6px' : '8px',
                            width: isSmallMobile ? '6px' : '8px',
                            height: isSmallMobile ? '6px' : '8px'
                        }}
                    ></span>
                </button>
                <div style={{ position: 'relative' }}>
                    <div
                        className="user-avatar"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{
                            ...(user?.photoURL ? { backgroundImage: `url(${user.photoURL})` } : {}),
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: isSmallMobile ? '32px' : '40px',
                            height: isSmallMobile ? '32px' : '40px'
                        }}
                    >
                        {!user?.photoURL && (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U')}
                    </div>
                    {showUserMenu && (
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '48px',
                            background: 'var(--bg-card)',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-lg)',
                            padding: '12px',
                            minWidth: '200px',
                            zIndex: 1000,
                            border: '1px solid var(--border-color)'
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
