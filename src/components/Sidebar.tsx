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

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <div className="logo">
                    <div className="logo-icon">
                        <Zap size={20} />
                    </div>
                    <span>TaskFlow</span>
                </div>
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
                        >
                            <Icon />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="nav-item">
                    <HelpCircle />
                    <span>Help</span>
                </div>
                <div className="nav-item">
                    <LogOut />
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
}
