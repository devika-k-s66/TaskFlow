import { CheckSquare, Zap, Bell, AlertCircle, Clock, MoreVertical, AlarmClock, Edit2 } from 'lucide-react';
import { mockDashboardStats, mockTasks, mockReminders, mockAutomations } from '../data/mockData';
import { format } from 'date-fns';

export default function Dashboard() {
    const stats = mockDashboardStats;
    const todayTasks = mockTasks.slice(0, 4);
    const upcomingReminders = mockReminders.slice(0, 3);
    const activeAutomations = mockAutomations.filter(a => a.enabled);

    return (
        <div className="page-content fade-in">
            <div className="page-title">
                <h1>Welcome back, John! 👋</h1>
                <p className="text-secondary">Here's what's happening with your workload today</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-4 mb-lg">
                <div className="glass-card">
                    <div className="flex items-center justify-between mb-md">
                        <div className="flex items-center gap-sm">
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #0A84FF, #4DA3FF)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <CheckSquare size={20} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Tasks Today</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>{stats.tasksToday}</h2>
                        <div style={{
                            height: '3px',
                            background: 'linear-gradient(90deg, #0A84FF 60%, #E5E5E5 60%)',
                            borderRadius: '9999px'
                        }}></div>
                    </div>
                </div>

                <div className="glass-card">
                    <div className="flex items-center justify-between mb-md">
                        <div className="flex items-center gap-sm">
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #34C759, #66D97A)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <Zap size={20} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Automations Running</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>{stats.automationsRunning}</h2>
                        <div style={{
                            height: '3px',
                            background: 'linear-gradient(90deg, #34C759 80%, #E5E5E5 80%)',
                            borderRadius: '9999px'
                        }}></div>
                    </div>
                </div>

                <div className="glass-card">
                    <div className="flex items-center justify-between mb-md">
                        <div className="flex items-center gap-sm">
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #FF9500, #FFB340)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <Bell size={20} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Upcoming Reminders</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>{stats.upcomingReminders}</h2>
                        <div style={{
                            height: '3px',
                            background: 'linear-gradient(90deg, #FF9500 45%, #E5E5E5 45%)',
                            borderRadius: '9999px'
                        }}></div>
                    </div>
                </div>

                <div className="glass-card">
                    <div className="flex items-center justify-between mb-md">
                        <div className="flex items-center gap-sm">
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #FF3B30, #FF5E54)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <AlertCircle size={20} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Overdue Items</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>{stats.overdueItems}</h2>
                        <div style={{
                            height: '3px',
                            background: 'linear-gradient(90deg, #FF3B30 20%, #E5E5E5 20%)',
                            borderRadius: '9999px'
                        }}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-3" style={{ gap: '24px' }}>
                {/* Today's Priority Tasks */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Today's Priority Tasks</h3>
                            <button className="btn btn-sm btn-ghost">View All</button>
                        </div>
                        <div>
                            {todayTasks.map(task => (
                                <div
                                    key={task.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '16px',
                                        borderBottom: '1px solid var(--border-light)',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--bg-main)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <input type="checkbox" className="checkbox" style={{ marginRight: '12px' }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '0.9375rem', fontWeight: '500', marginBottom: '4px' }}>
                                            {task.title}
                                        </h4>
                                        <div className="flex items-center gap-sm">
                                            <span className="flex items-center gap-sm text-muted" style={{ fontSize: '0.8125rem' }}>
                                                <Clock size={14} />
                                                {format(task.deadline, 'h:mm a')}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`badge badge-${task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success'}`}>
                                        {task.priority}
                                    </span>
                                    <div className="flex items-center gap-sm" style={{ marginLeft: '12px' }}>
                                        <button className="btn btn-sm btn-ghost">
                                            <AlarmClock size={16} />
                                        </button>
                                        <button className="btn btn-sm btn-ghost">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="btn btn-sm btn-ghost">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Reminders */}
                <div>
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Upcoming Reminders</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {upcomingReminders.map(reminder => (
                                <div
                                    key={reminder.id}
                                    style={{
                                        padding: '12px 14px',
                                        background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.05), rgba(10, 132, 255, 0.02))',
                                        border: '1px solid rgba(10, 132, 255, 0.1)',
                                        borderRadius: '10px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.borderColor = 'rgba(10, 132, 255, 0.1)';
                                    }}
                                >
                                    <div className="flex items-center gap-sm mb-sm">
                                        <Bell size={14} style={{ color: 'var(--primary)' }} />
                                        <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--primary)' }}>
                                            {format(reminder.time, 'h:mm a')}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.9375rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                                        {reminder.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Automations Panel */}
                    <div className="card mt-lg">
                        <div className="card-header">
                            <h3 className="card-title">Active Automations</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {activeAutomations.map(automation => (
                                <div
                                    key={automation.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px',
                                        background: 'var(--bg-main)',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                                            {automation.name}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            Last run: {automation.lastRun ? format(automation.lastRun, 'MMM d, h:mm a') : 'Never'}
                                        </p>
                                    </div>
                                    <div
                                        className={`toggle ${automation.enabled ? 'active' : ''}`}
                                        style={{ flexShrink: 0 }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
