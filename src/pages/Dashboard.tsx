import { useState, useEffect } from 'react';
import { CheckSquare, Zap, Bell, AlertCircle, Clock } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useTasks, useAutomations, useReminders } from '../hooks/useFirestore';

export default function Dashboard() {
    const { user } = useAuth();
    const { tasks } = useTasks();
    const { automations } = useAutomations();
    const { reminders } = useReminders();

    // Better responsiveness with more breakpoints
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1200; // Updated breakpoint
    const isSmallPhone = width < 480;

    // Calculate dynamic stats
    const stats = {
        tasksToday: tasks.filter(t => !t.completed && isToday(t.deadline)).length,
        automationsRunning: automations.filter(a => a.enabled).length,
        upcomingReminders: reminders.filter(r => r.status === 'pending').length,
        overdueItems: tasks.filter(t => !t.completed && isPast(t.deadline) && !isToday(t.deadline)).length
    };

    const todayTasks = tasks.filter(t => !t.completed && (isToday(t.deadline) || t.priority === 'High')).slice(0, 4);
    const upcomingReminders = reminders.filter(r => r.status === 'pending').slice(0, 3);
    const activeAutomations = automations.filter(a => a.enabled);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const getUserName = () => {
        if (user?.displayName) {
            return user.displayName.split(' ')[0];
        }
        return 'User';
    };

    return (
        <div className="page-content fade-in" style={{ padding: 0 }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: isSmallPhone ? '24px 16px' : isMobile ? '32px 24px' : '48px 40px',
                width: '100%',
                boxSizing: 'border-box'
            }}>

                {/* 1. HERO GREETING */}
                <div className="page-title" style={{ marginBottom: isMobile ? '32px' : '56px' }}>
                    <h1 style={{
                        fontSize: isSmallPhone ? '1.75rem' : isMobile ? '2.25rem' : isTablet ? '2.75rem' : '3.5rem',
                        fontWeight: '300',
                        letterSpacing: isMobile ? '-1px' : '-2px',
                        marginBottom: '12px',
                        color: 'white',
                        lineHeight: '1.1',
                        wordBreak: 'break-word',
                        maxWidth: '100%'
                    }}>
                        {getGreeting()}, <span style={{ fontWeight: '600' }}>{getUserName()}.</span>
                    </h1>
                    <p style={{
                        fontSize: isMobile ? '0.90rem' : '1.1rem',
                        color: 'rgba(255,255,255,0.85)',
                        fontWeight: '400',
                        maxWidth: '600px'
                    }}>
                        Here's a breakdown of your digital productivity today.
                    </p>
                </div>

                {/* 2. STATS GRID */}
                <div className="grid" style={{
                    display: 'grid',
                    gridTemplateColumns: isSmallPhone ? '1fr' : isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: isSmallPhone ? '16px' : isMobile ? '20px' : '24px',
                    marginBottom: isMobile ? '32px' : '48px'
                }}>
                    {/* Stats Item 1 */}
                    <div className="glass-clear" style={{ padding: '24px', transition: 'transform 0.3s' }}>
                        <div className="flex items-center justify-between mb-md">
                            <div style={{
                                width: '44px', height: '44px',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                            }}>
                                <CheckSquare size={22} />
                            </div>
                            <span style={{ fontSize: '2.25rem', fontWeight: '700', color: 'white' }}>{stats.tasksToday}</span>
                        </div>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '8px' }}>Tasks Pending</p>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }}>
                                <div style={{ width: '60%', height: '100%', background: 'white', borderRadius: '99px' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Item 2 */}
                    <div className="glass-clear" style={{ padding: '24px' }}>
                        <div className="flex items-center justify-between mb-md">
                            <div style={{
                                width: '44px', height: '44px',
                                borderRadius: '12px',
                                background: 'rgba(52, 199, 89, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80'
                            }}>
                                <Zap size={22} />
                            </div>
                            <span style={{ fontSize: '2.25rem', fontWeight: '700', color: 'white' }}>{stats.automationsRunning}</span>
                        </div>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '8px' }}>Active Automations</p>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }}>
                                <div style={{ width: '80%', height: '100%', background: '#4ade80', borderRadius: '99px' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Item 3 */}
                    <div className="glass-clear" style={{ padding: '24px' }}>
                        <div className="flex items-center justify-between mb-md">
                            <div style={{
                                width: '44px', height: '44px',
                                borderRadius: '12px',
                                background: 'rgba(255, 149, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24'
                            }}>
                                <Bell size={22} />
                            </div>
                            <span style={{ fontSize: '2.25rem', fontWeight: '700', color: 'white' }}>{stats.upcomingReminders}</span>
                        </div>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '8px' }}>Reminders</p>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }}>
                                <div style={{ width: '40%', height: '100%', background: '#fbbf24', borderRadius: '99px' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Item 4 */}
                    <div className="glass-clear" style={{ padding: '24px' }}>
                        <div className="flex items-center justify-between mb-md">
                            <div style={{
                                width: '44px', height: '44px',
                                borderRadius: '12px',
                                background: 'rgba(255, 59, 48, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171'
                            }}>
                                <AlertCircle size={22} />
                            </div>
                            <span style={{ fontSize: '2.25rem', fontWeight: '700', color: 'white' }}>{stats.overdueItems}</span>
                        </div>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '8px' }}>Overdue</p>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }}>
                                <div style={{ width: '20%', height: '100%', background: '#f87171', borderRadius: '99px' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MAIN CONTENT */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: width < 1200 ? '1fr' : 'repeat(3, 1fr)',
                    gap: isMobile ? '24px' : '32px'
                }}>

                    {/* TASK LIST */}
                    <div style={{ gridColumn: width < 1200 ? 'span 1' : 'span 2' }}>
                        <div className="glass-clear" style={{ height: '100%', padding: isMobile ? '20px' : '30px' }}>
                            <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ color: 'white', fontWeight: '500', fontSize: isMobile ? '1.1rem' : '1.4rem' }}>Priority Missions</h3>

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

                            <div style={{ marginTop: '16px' }}>
                                {todayTasks.length === 0 ? (
                                    <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                        No priority tasks for today.
                                    </div>
                                ) : (
                                    todayTasks.map(task => (
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
                                                e.currentTarget.style.transform = 'scale(1.01) translateX(4px)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.transform = 'scale(1) translateX(0)';
                                                e.currentTarget.style.borderColor = 'transparent';
                                            }}
                                        >
                                            <div style={{
                                                width: '22px', height: '22px',
                                                borderRadius: '6px', border: '2px solid rgba(255,255,255,0.5)', marginRight: '16px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                            }}></div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '4px', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {task.title}
                                                </h4>
                                                <div className="flex items-center gap-sm">
                                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock size={12} /> {format(task.deadline, 'h:mm a')}
                                                    </span>
                                                </div>
                                            </div>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                                                background: task.priority === 'High' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 149, 0, 0.2)',
                                                color: task.priority === 'High' ? '#f87171' : '#fbbf24', border: '1px solid rgba(255,255,255,0.1)',
                                                flexShrink: 0, marginLeft: '8px'
                                            }}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SIDE COLUMN */}
                    <div style={{ display: 'grid', gridTemplateColumns: width > 768 && width < 1200 ? 'repeat(2, 1fr)' : '1fr', gap: isMobile ? '24px' : '32px' }}>

                        {/* Reminders */}
                        <div className="glass-clear" style={{ padding: '24px' }}>
                            <div className="card-header" style={{ paddingBottom: '0' }}>
                                <h3 style={{ color: 'white', fontWeight: '500', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>Up Next</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                                {upcomingReminders.length === 0 ? (
                                    <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '10px' }}>No reminders.</p>
                                ) : (
                                    upcomingReminders.map(reminder => (
                                        <div key={reminder.id} style={{
                                            padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex', alignItems: 'center', gap: '15px'
                                        }}>
                                            <Bell size={18} color="#fbbf24" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{reminder.title}</p>
                                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: 0 }}>{format(reminder.time, 'h:mm a')}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Automations */}
                        <div className="glass-clear" style={{ padding: '24px', flex: 1 }}>
                            <div className="card-header">
                                <h3 style={{ color: 'white', fontWeight: '500', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>Active Systems</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                                {activeAutomations.length === 0 ? (
                                    <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '10px' }}>No active systems.</p>
                                ) : (
                                    activeAutomations.slice(0, 3).map(auto => (
                                        <div key={auto.id} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '12px 6px', borderBottom: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                                <Zap size={16} color="#4ade80" style={{ flexShrink: 0 }} />
                                                <span style={{ color: 'white', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{auto.name}</span>
                                            </div>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', flexShrink: 0 }}></div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
