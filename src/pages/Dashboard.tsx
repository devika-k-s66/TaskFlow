import { CheckSquare, Zap, Bell, AlertCircle, Clock } from 'lucide-react';
import { mockDashboardStats, mockTasks, mockReminders, mockAutomations } from '../data/mockData';
import { format } from 'date-fns';

export default function Dashboard() {
    const stats = mockDashboardStats;
    const todayTasks = mockTasks.slice(0, 4);
    const upcomingReminders = mockReminders.slice(0, 3);
    const activeAutomations = mockAutomations.filter(a => a.enabled);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>

            {/* 1. HERO GREETING */}
            <div className="page-title">
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: '300',
                    letterSpacing: '-2px',
                    marginBottom: '10px',
                    color: 'white',
                    lineHeight: '1.2'
                }}>
                    {getGreeting()}, <span style={{ fontWeight: '600' }}>John.</span>
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: 'rgba(255,255,255,0.85)',
                    fontWeight: '400'
                }}>
                    Here's a breakdown of your digital productivity today.
                </p>
            </div>

            {/* 2. STATS GRID */}
            <div className="grid grid-4 mb-lg">
                <div className="glass-clear" style={{ padding: '24px' }}>
                    <div className="flex items-center justify-between mb-md">
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}>
                            <CheckSquare size={24} />
                        </div>
                        <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white' }}>{stats.tasksToday}</span>
                    </div>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>Tasks Pending</p>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }}>
                            <div style={{ width: '60%', height: '100%', background: 'white', borderRadius: '99px' }}></div>
                        </div>
                    </div>
                </div>

                <div className="glass-clear" style={{ padding: '24px' }}>
                    <div className="flex items-center justify-between mb-md">
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'rgba(52, 199, 89, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80'
                        }}>
                            <Zap size={24} />
                        </div>
                        <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white' }}>{stats.automationsRunning}</span>
                    </div>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>Active Automations</p>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }}>
                            <div style={{ width: '80%', height: '100%', background: '#4ade80', borderRadius: '99px' }}></div>
                        </div>
                    </div>
                </div>

                <div className="glass-clear" style={{ padding: '24px' }}>
                    <div className="flex items-center justify-between mb-md">
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'rgba(255, 149, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24'
                        }}>
                            <Bell size={24} />
                        </div>
                        <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white' }}>{stats.upcomingReminders}</span>
                    </div>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>Reminders</p>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }}>
                            <div style={{ width: '40%', height: '100%', background: '#fbbf24', borderRadius: '99px' }}></div>
                        </div>
                    </div>
                </div>

                <div className="glass-clear" style={{ padding: '24px' }}>
                    <div className="flex items-center justify-between mb-md">
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'rgba(255, 59, 48, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171'
                        }}>
                            <AlertCircle size={24} />
                        </div>
                        <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white' }}>{stats.overdueItems}</span>
                    </div>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>Overdue</p>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }}>
                            <div style={{ width: '20%', height: '100%', background: '#f87171', borderRadius: '99px' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. MAIN CONTENT */}
            <div className="grid grid-3" style={{ gap: '30px' }}>

                {/* TASK LIST (Updated with Better Hover & View All) */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="glass-clear" style={{ height: '100%', padding: '24px' }}>
                        <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ color: 'white', fontWeight: '500' }}>Priority Missions</h3>

                            {/* NEW VISIBLE VIEW ALL BUTTON */}
                            <button className="btn btn-sm" style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: 'white',
                                borderRadius: '20px',
                                padding: '6px 16px',
                                transition: 'all 0.2s',
                                fontWeight: '500'
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >View All</button>
                        </div>

                        <div style={{ marginTop: '10px' }}>
                            {todayTasks.map(task => (
                                <div key={task.id} style={{
                                    display: 'flex', alignItems: 'center', padding: '16px 12px',
                                    borderRadius: '12px',
                                    marginBottom: '8px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    border: '1px solid transparent'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                        e.currentTarget.style.transform = 'scale(1.02) translateX(4px)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.transform = 'scale(1) translateX(0)';
                                        e.currentTarget.style.borderColor = 'transparent';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '6px', border: '2px solid rgba(255,255,255,0.5)', marginRight: '16px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}></div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '4px', color: 'white' }}>
                                            {task.title}
                                        </h4>
                                        <div className="flex items-center gap-sm">
                                            <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={14} /> {format(task.deadline, 'h:mm a')}
                                            </span>
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                                        background: task.priority === 'High' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 149, 0, 0.2)',
                                        color: task.priority === 'High' ? '#f87171' : '#fbbf24', border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        {task.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SIDE COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Reminders */}
                    <div className="glass-clear" style={{ padding: '24px' }}>
                        <div className="card-header" style={{ paddingBottom: '0' }}>
                            <h3 style={{ color: 'white', fontWeight: '500' }}>Up Next</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                            {upcomingReminders.map(reminder => (
                                <div key={reminder.id} style={{
                                    padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex', alignItems: 'center', gap: '15px'
                                }}>
                                    <Bell size={18} color="#fbbf24" strokeWidth={2.5} />
                                    <div>
                                        <p style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem', margin: 0 }}>{reminder.title}</p>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: 0 }}>{format(reminder.time, 'h:mm a')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Automations */}
                    <div className="glass-clear" style={{ padding: '24px', flex: 1 }}>
                        <div className="card-header">
                            <h3 style={{ color: 'white', fontWeight: '500' }}>Active Systems</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {activeAutomations.slice(0, 3).map(auto => (
                                <div key={auto.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Zap size={16} color="#4ade80" />
                                        <span style={{ color: 'white', fontSize: '0.9rem' }}>{auto.name}</span>
                                    </div>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
