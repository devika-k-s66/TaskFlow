import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Zap,
    Repeat,
    Bell,
    Calendar,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
    X
} from 'lucide-react';

const navItems = [
    { path: '/dashboard/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/dashboard/automations', label: 'Automations', icon: Zap },
    { path: '/dashboard/routines', label: 'Smart Routines', icon: Repeat },
    { path: '/dashboard/reminders', label: 'Reminders', icon: Bell },
    { path: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    { path: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();

    return (
        <div className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-logo">
                <div className="logo">
                    <div className="logo-icon">
                        <Zap size={20} />
                    </div>
                    <span>TaskFlow</span>
                </div>
                {isOpen && (
                    <button
                        onClick={onClose}
                        style={{
                            marginLeft: 'auto',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => {
                                if (window.innerWidth < 768) onClose();
                            }}
                        >
                            <Icon />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="nav-item" onClick={() => { if (window.innerWidth < 768) onClose(); }}>
                    <HelpCircle />
                    <span>Help</span>
                </div>
                <div className="nav-item" onClick={() => { if (window.innerWidth < 768) onClose(); }}>
                    <LogOut />
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
}
