import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckSquare, Bell, Clock, LayoutGrid, List, TrendingUp, Activity, Zap } from 'lucide-react';
import { useTasks, useReminders } from '../hooks/useFirestore';
import {
    format,
    isSameDay,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    getDay,
    addWeeks,
    subWeeks,
    startOfWeek,
    endOfWeek,
    addDays,
    isToday as isTodayFn
} from 'date-fns';

type ViewMode = 'month' | 'week';

export default function CalendarPage() {
    const { tasks, loading: loadingTasks } = useTasks();
    const { reminders, loading: loadingReminders } = useReminders();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const monthName = format(currentDate, 'MMMM yyyy');
    const weekRange = `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`;

    const nextPeriod = () => {
        if (viewMode === 'month') {
            setCurrentDate(addMonths(currentDate, 1));
        } else {
            setCurrentDate(addWeeks(currentDate, 1));
        }
    };

    const prevPeriod = () => {
        if (viewMode === 'month') {
            setCurrentDate(subMonths(currentDate, 1));
        } else {
            setCurrentDate(subWeeks(currentDate, 1));
        }
    };

    const goToToday = () => setCurrentDate(new Date());

    // Generate calendar days for month view
    const getDaysInMonth = () => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const daysInMonth = end.getDate();
        const firstDayOfWeek = getDay(start);

        const days = [];
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    // Generate days for week view
    const getDaysInWeek = () => {
        const start = startOfWeek(currentDate);
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(addDays(start, i));
        }
        return days;
    };

    const days = viewMode === 'month' ? getDaysInMonth() : getDaysInWeek();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysOfWeekShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getEventsForDay = (day: number | Date) => {
        if (!day) return [];
        const date = typeof day === 'number'
            ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            : day;

        const dayTasks = tasks.filter(t => !t.completed && isSameDay(t.deadline, date));
        const dayReminders = reminders.filter(r => r.status === 'pending' && isSameDay(r.time, date));

        return [
            ...dayTasks.map(t => ({ id: t.id, title: t.title, type: 'task' as const, priority: t.priority })),
            ...dayReminders.map(r => ({ id: r.id, title: r.title, type: 'reminder' as const }))
        ];
    };

    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div className="page-title" style={{
                marginBottom: isMobile ? '20px' : '32px',
                textAlign: isMobile ? 'center' : 'left'
            }}>
                <h1 style={{
                    fontSize: isMobile ? '2rem' : '3rem',
                    fontWeight: '600',
                    letterSpacing: '-1px',
                    color: 'white',
                    textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    marginBottom: '8px'
                }}>Calendar</h1>
                <p style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: isMobile ? '1rem' : '1.2rem'
                }}>
                    Visualize your workload schedule
                </p>
            </div>

            {/* Statistics Dashboard */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                    ? '1fr'
                    : isTablet
                        ? 'repeat(2, 1fr)'
                        : 'repeat(4, 1fr)',
                gap: isMobile ? '12px' : '16px',
                marginBottom: isMobile ? '16px' : '24px'
            }}>
                {/* Total Events */}
                <div className="glass-clear" style={{
                    padding: isMobile ? '16px' : '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '12px' : '16px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                    }}>
                    <div style={{
                        width: isMobile ? '40px' : '48px',
                        height: isMobile ? '40px' : '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                        flexShrink: 0
                    }}>
                        <CalendarIcon size={isMobile ? 20 : 24} color="white" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                            Total Events
                        </div>
                        <div style={{ fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: '700', color: 'white' }}>
                            {tasks.filter(t => !t.completed).length + reminders.filter(r => r.status === 'pending').length}
                        </div>
                    </div>
                </div>

                {/* Tasks */}
                <div className="glass-clear" style={{
                    padding: isMobile ? '16px' : '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '12px' : '16px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                    }}>
                    <div style={{
                        width: isMobile ? '40px' : '48px',
                        height: isMobile ? '40px' : '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #34d399, #10b981)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(52, 211, 153, 0.4)',
                        flexShrink: 0
                    }}>
                        <CheckSquare size={isMobile ? 20 : 24} color="white" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                            Active Tasks
                        </div>
                        <div style={{ fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: '700', color: 'white' }}>
                            {tasks.filter(t => !t.completed).length}
                        </div>
                    </div>
                </div>

                {/* Reminders */}
                <div className="glass-clear" style={{
                    padding: isMobile ? '16px' : '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '12px' : '16px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                    }}>
                    <div style={{
                        width: isMobile ? '40px' : '48px',
                        height: isMobile ? '40px' : '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
                        flexShrink: 0
                    }}>
                        <Bell size={isMobile ? 20 : 24} color="white" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                            Pending Reminders
                        </div>
                        <div style={{ fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: '700', color: 'white' }}>
                            {reminders.filter(r => r.status === 'pending').length}
                        </div>
                    </div>
                </div>

                {/* Completion Rate */}
                <div className="glass-clear" style={{
                    padding: isMobile ? '16px' : '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '12px' : '16px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                    }}>
                    <div style={{
                        width: isMobile ? '40px' : '48px',
                        height: isMobile ? '40px' : '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                        flexShrink: 0
                    }}>
                        <TrendingUp size={isMobile ? 20 : 24} color="white" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                            This Month
                        </div>
                        <div style={{ fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: '700', color: 'white' }}>
                            {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Color Legend */}
            <div className="glass-clear" style={{ padding: isMobile ? '12px 16px' : '16px 24px', marginBottom: isMobile ? '16px' : '24px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '12px' : '24px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.8125rem' : '0.875rem', color: 'rgba(255,255,255,0.9)' }}>
                        <Activity size={isMobile ? 14 : 16} />
                        <span style={{ fontWeight: '600' }}>Event Types:</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                            width: isMobile ? '10px' : '12px',
                            height: isMobile ? '10px' : '12px',
                            borderRadius: '3px',
                            background: 'rgba(239, 68, 68, 0.6)',
                            border: '1px solid rgba(239, 68, 68, 0.8)'
                        }} />
                        <span style={{ fontSize: isMobile ? '0.8125rem' : '0.875rem', color: 'rgba(255,255,255,0.8)' }}>High {!isMobile && 'Priority'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                            width: isMobile ? '10px' : '12px',
                            height: isMobile ? '10px' : '12px',
                            borderRadius: '3px',
                            background: 'rgba(251, 191, 36, 0.6)',
                            border: '1px solid rgba(251, 191, 36, 0.8)'
                        }} />
                        <span style={{ fontSize: isMobile ? '0.8125rem' : '0.875rem', color: 'rgba(255,255,255,0.8)' }}>Medium {!isMobile && 'Priority'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                            width: isMobile ? '10px' : '12px',
                            height: isMobile ? '10px' : '12px',
                            borderRadius: '3px',
                            background: 'rgba(34, 197, 94, 0.6)',
                            border: '1px solid rgba(34, 197, 94, 0.8)'
                        }} />
                        <span style={{ fontSize: isMobile ? '0.8125rem' : '0.875rem', color: 'rgba(255,255,255,0.8)' }}>Low {!isMobile && 'Priority'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                            width: isMobile ? '10px' : '12px',
                            height: isMobile ? '10px' : '12px',
                            borderRadius: '3px',
                            background: 'rgba(168, 85, 247, 0.6)',
                            border: '1px solid rgba(168, 85, 247, 0.8)'
                        }} />
                        <span style={{ fontSize: isMobile ? '0.8125rem' : '0.875rem', color: 'rgba(255,255,255,0.8)' }}>Reminders</span>
                    </div>
                    {!isMobile && (
                        <div style={{
                            marginLeft: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            color: 'rgba(255,255,255,0.9)'
                        }}>
                            <Zap size={14} />
                            <span>Live Updates</span>
                        </div>
                    )}
                </div>
            </div>


            {/* Calendar Controls */}
            <div className="glass-clear" style={{ padding: isMobile ? '16px' : '24px 32px', marginBottom: isMobile ? '16px' : '24px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '12px' : '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
                        <h2 style={{
                            fontSize: isMobile ? '1.25rem' : isTablet ? '1.5rem' : '1.75rem',
                            fontWeight: '600',
                            color: 'white',
                            margin: 0
                        }}>
                            {viewMode === 'month' ? monthName : weekRange}
                        </h2>

                        <button
                            onClick={goToToday}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white',
                                padding: isMobile ? '6px 12px' : '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: isMobile ? '0.8125rem' : '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <CalendarIcon size={isMobile ? 14 : 16} />
                            Today
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', width: isMobile ? '100%' : 'auto' }}>
                        {/* View Mode Toggle */}
                        <div style={{
                            background: 'rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            padding: '4px',
                            display: 'flex',
                            gap: '4px',
                            flex: isMobile ? 1 : 'none'
                        }}>
                            <button
                                onClick={() => setViewMode('month')}
                                style={{
                                    background: viewMode === 'month' ? 'rgba(102, 126, 234, 0.5)' : 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    padding: isMobile ? '6px 12px' : '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '0.8125rem' : '0.875rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    flex: isMobile ? 1 : 'none'
                                }}
                            >
                                <LayoutGrid size={isMobile ? 14 : 16} />
                                {!isMobile && 'Month'}
                            </button>
                            <button
                                onClick={() => setViewMode('week')}
                                style={{
                                    background: viewMode === 'week' ? 'rgba(102, 126, 234, 0.5)' : 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    padding: isMobile ? '6px 12px' : '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '0.8125rem' : '0.875rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    flex: isMobile ? 1 : 'none'
                                }}
                            >
                                <List size={isMobile ? 14 : 16} />
                                {!isMobile && 'Week'}
                            </button>
                        </div>

                        {/* Navigation Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            background: 'rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            padding: '4px'
                        }}>
                            <button
                                onClick={prevPeriod}
                                style={{
                                    background: 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    padding: isMobile ? '6px 10px' : '8px 12px',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <ChevronLeft size={isMobile ? 18 : 20} />
                            </button>
                            <button
                                onClick={nextPeriod}
                                style={{
                                    background: 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    padding: isMobile ? '6px 10px' : '8px 12px',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <ChevronRight size={isMobile ? 18 : 20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loadingTasks || loadingReminders ? (
                <div className="glass-clear" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px'
                    }}>
                        <Clock size={24} />
                        Loading calendar events...
                    </div>
                </div>
            ) : viewMode === 'month' ? (
                /* Month View */
                <div className="glass-clear" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '0',
                        background: 'rgba(255,255,255,0.05)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {/* Day headers */}
                        {daysOfWeekShort.map(day => (
                            <div
                                key={day}
                                style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    padding: isMobile ? '8px 4px' : '16px 12px',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    fontSize: isMobile ? '0.65rem' : '0.875rem',
                                    color: 'rgba(255,255,255,0.9)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {isMobile ? day.charAt(0) : day}
                            </div>
                        ))}

                        {/* Calendar days */}
                        {days.map((day, index) => {
                            const events = day ? getEventsForDay(day as number) : [];
                            const isToday = day && isSameDay(new Date(), new Date(currentDate.getFullYear(), currentDate.getMonth(), day as number));

                            return (
                                <div
                                    key={index}
                                    style={{
                                        background: day
                                            ? (isToday ? 'rgba(102, 126, 234, 0.15)' : 'rgba(255,255,255,0.03)')
                                            : 'rgba(0,0,0,0.1)',
                                        padding: isMobile ? '4px' : '12px',
                                        minHeight: isMobile ? '80px' : '140px',
                                        cursor: day ? 'pointer' : 'default',
                                        transition: 'all 0.2s',
                                        position: 'relative',
                                        borderRight: '1px solid rgba(255,255,255,0.05)',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        opacity: day ? 1 : 0.5,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (day) {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                            e.currentTarget.style.zIndex = '10';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (day) {
                                            e.currentTarget.style.background = isToday
                                                ? 'rgba(102, 126, 234, 0.15)'
                                                : 'rgba(255,255,255,0.03)';
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.zIndex = '1';
                                        }
                                    }}
                                >
                                    {day && (
                                        <>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: isMobile ? '4px' : '10px'
                                            }}>
                                                <span style={{
                                                    fontWeight: isToday ? '700' : '600',
                                                    fontSize: isMobile ? '0.8125rem' : '1rem',
                                                    color: isToday ? 'white' : 'rgba(255,255,255,0.8)',
                                                    background: isToday ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                                                    width: isToday ? (isMobile ? '24px' : '32px') : 'auto',
                                                    height: isToday ? (isMobile ? '24px' : '32px') : 'auto',
                                                    borderRadius: isToday ? '50%' : '0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: isToday ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
                                                }}>
                                                    {day}
                                                </span>
                                                {events.length > 0 && (
                                                    <span style={{
                                                        background: events.length >= 3
                                                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.5), rgba(251, 191, 36, 0.5))'
                                                            : 'rgba(102, 126, 234, 0.3)',
                                                        color: 'white',
                                                        fontSize: isMobile ? '0.65rem' : '0.75rem',
                                                        fontWeight: '600',
                                                        padding: isMobile ? '2px 6px' : '3px 9px',
                                                        borderRadius: '12px',
                                                        border: events.length >= 3
                                                            ? '1px solid rgba(239, 68, 68, 0.6)'
                                                            : '1px solid rgba(102, 126, 234, 0.5)',
                                                        animation: events.length >= 3 ? 'pulse 2s ease-in-out infinite' : 'none',
                                                        boxShadow: events.length >= 3 ? '0 2px 8px rgba(239, 68, 68, 0.3)' : 'none'
                                                    }}>
                                                        {events.length}
                                                    </span>
                                                )}
                                            </div>

                                            {!isMobile && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    {events.slice(0, 3).map((event, i) => {
                                                        const eventColor = event.type === 'task' && event.priority
                                                            ? (event.priority === 'High' ? 'rgba(239, 68, 68, 0.4)' :
                                                                event.priority === 'Medium' ? 'rgba(251, 191, 36, 0.4)' :
                                                                    'rgba(34, 197, 94, 0.4)')
                                                            : 'rgba(168, 85, 247, 0.4)';

                                                        const borderColor = event.type === 'task' && event.priority
                                                            ? (event.priority === 'High' ? 'rgba(239, 68, 68, 0.6)' :
                                                                event.priority === 'Medium' ? 'rgba(251, 191, 36, 0.6)' :
                                                                    'rgba(34, 197, 94, 0.6)')
                                                            : 'rgba(168, 85, 247, 0.6)';

                                                        return (
                                                            <div
                                                                key={i}
                                                                style={{
                                                                    background: eventColor,
                                                                    color: 'white',
                                                                    padding: '6px 10px',
                                                                    borderRadius: '6px',
                                                                    fontSize: '0.8125rem',
                                                                    fontWeight: '500',
                                                                    border: `1px solid ${borderColor}`,
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '6px',
                                                                    transition: 'all 0.2s',
                                                                    backdropFilter: 'blur(10px)'
                                                                }}
                                                                title={event.title}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.transform = 'translateX(4px)';
                                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.transform = 'translateX(0)';
                                                                    e.currentTarget.style.boxShadow = 'none';
                                                                }}
                                                            >
                                                                {event.type === 'task' ? <CheckSquare size={12} /> : <Bell size={12} />}
                                                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                    {event.title}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                    {events.length > 3 && (
                                                        <div style={{
                                                            fontSize: '0.75rem',
                                                            color: 'rgba(255,255,255,0.6)',
                                                            paddingLeft: '6px',
                                                            fontWeight: '500'
                                                        }}>
                                                            +{events.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Week View */
                <div className="glass-clear" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(3, 1fr)' : 'repeat(7, 1fr)',
                        gap: '0',
                        background: 'rgba(255,255,255,0.05)'
                    }}>
                        {/* Week day headers */}
                        {(days as Date[]).map((day, index) => {
                            const isToday = isTodayFn(day);
                            return (
                                <div
                                    key={index}
                                    style={{
                                        background: isToday ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255,255,255,0.08)',
                                        padding: '20px 16px',
                                        textAlign: 'center',
                                        borderBottom: '2px solid rgba(255,255,255,0.1)',
                                        borderRight: index < 6 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                                    }}
                                >
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: 'rgba(255,255,255,0.7)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '6px'
                                    }}>
                                        {daysOfWeek[index]}
                                    </div>
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: isToday ? 'white' : 'rgba(255,255,255,0.9)',
                                        background: isToday ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                                        width: isToday ? '48px' : 'auto',
                                        height: isToday ? '48px' : 'auto',
                                        borderRadius: isToday ? '50%' : '0',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: isToday ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
                                    }}>
                                        {format(day, 'd')}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Week day content */}
                        {(days as Date[]).map((day, index) => {
                            const events = getEventsForDay(day);
                            const isToday = isTodayFn(day);

                            return (
                                <div
                                    key={index}
                                    style={{
                                        background: isToday ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255,255,255,0.03)',
                                        padding: '20px 16px',
                                        minHeight: '400px',
                                        borderRight: index < 6 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {events.length === 0 ? (
                                            <div style={{
                                                color: 'rgba(255,255,255,0.4)',
                                                fontSize: '0.875rem',
                                                textAlign: 'center',
                                                padding: '20px',
                                                fontStyle: 'italic'
                                            }}>
                                                No events
                                            </div>
                                        ) : (
                                            events.map((event, i) => {
                                                const eventColor = event.type === 'task' && event.priority
                                                    ? (event.priority === 'High' ? 'rgba(239, 68, 68, 0.4)' :
                                                        event.priority === 'Medium' ? 'rgba(251, 191, 36, 0.4)' :
                                                            'rgba(34, 197, 94, 0.4)')
                                                    : 'rgba(168, 85, 247, 0.4)';

                                                const borderColor = event.type === 'task' && event.priority
                                                    ? (event.priority === 'High' ? 'rgba(239, 68, 68, 0.6)' :
                                                        event.priority === 'Medium' ? 'rgba(251, 191, 36, 0.6)' :
                                                            'rgba(34, 197, 94, 0.6)')
                                                    : 'rgba(168, 85, 247, 0.6)';

                                                return (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            background: eventColor,
                                                            color: 'white',
                                                            padding: '12px 14px',
                                                            borderRadius: '8px',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '500',
                                                            border: `1px solid ${borderColor}`,
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            gap: '10px',
                                                            transition: 'all 0.2s',
                                                            backdropFilter: 'blur(10px)',
                                                            cursor: 'pointer'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        <div style={{ marginTop: '2px' }}>
                                                            {event.type === 'task' ? <CheckSquare size={16} /> : <Bell size={16} />}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                                {event.title}
                                                            </div>
                                                            <div style={{
                                                                fontSize: '0.75rem',
                                                                opacity: 0.8,
                                                                textTransform: 'capitalize'
                                                            }}>
                                                                {event.type} • {event.type === 'task' && event.priority ? event.priority.toLowerCase() : 'normal'} priority
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
