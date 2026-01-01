import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckSquare, Bell, Clock, LayoutGrid, List, TrendingUp, Activity, Zap, Save, Library, Eye, X, Trash2, Edit2 } from 'lucide-react';
import { useTasks, useReminders, useTemplates } from '../hooks/useFirestore';
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
    isToday as isTodayFn,
    startOfDay,
    setHours,
    setMinutes,
    addMinutes as addMinutesFn
} from 'date-fns';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import type { Priority, Task, TimeTemplate, TimeSlot } from '../types';

type ViewMode = 'month' | 'week';

export default function CalendarPage() {
    const { tasks, loading: loadingTasks, addTask, updateTask, deleteTask } = useTasks();
    const { reminders, loading: loadingReminders } = useReminders();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

    const [selectedDateForCreation, setSelectedDateForCreation] = useState<Date | null>(null);


    // Creation States
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskPriority, setTaskPriority] = useState<Priority>('Medium');
    const [taskDuration, setTaskDuration] = useState(60);
    const [taskStartTime, setTaskStartTime] = useState<Date | null>(null);

    const location = useLocation();
    const calendarRef = useRef<HTMLDivElement>(null);

    const [showDateSelectionPrompt, setShowDateSelectionPrompt] = useState(false);

    useEffect(() => {
        if (location.state?.scrollToCalendar && calendarRef.current) {
            calendarRef.current.scrollIntoView({ behavior: 'smooth' });
            setShowDateSelectionPrompt(true);
            // Clear state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleDateClick = (dayNum: number) => {
        const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
        setSelectedDateForCreation(selected);
        setShowDateSelectionPrompt(false);
    };


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

        const dayTasks = tasks.filter(t => isSameDay(t.deadline, date));
        const dayReminders = reminders.filter(r => r.status === 'pending' && isSameDay(r.time, date));

        return [
            ...dayTasks.map(t => ({ id: t.id, title: t.title, type: 'task' as const, priority: t.priority, start: t.deadline, end: t.endTime, completed: t.completed })),
            ...dayReminders.map(r => ({ id: r.id, title: r.title, type: 'reminder' as const, completed: r.status === 'sent' }))
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
            <div ref={calendarRef} id="calendar-view" className="glass-clear" style={{ padding: isMobile ? '16px' : '24px 32px', marginBottom: isMobile ? '16px' : '24px' }}>
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

                    {showDateSelectionPrompt && (
                        <div style={{
                            background: 'rgba(56, 189, 248, 0.15)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            color: '#38bdf8',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            animation: 'pulse 2s infinite'
                        }}>
                            <Zap size={16} />
                            Please select a date on the calendar to start planning
                        </div>
                    )}

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
                                    onClick={() => day && handleDateClick(day as number)}
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

            {selectedDateForCreation && (
                <PlanningPageView
                    selectedDate={selectedDateForCreation}
                    onClose={() => setSelectedDateForCreation(null)}
                    title={taskTitle} setTitle={setTaskTitle}
                    desc={taskDesc} setDesc={setTaskDesc}
                    priority={taskPriority} setPriority={setTaskPriority}
                    duration={taskDuration} setDuration={setTaskDuration}
                    startTime={taskStartTime} setStartTime={setTaskStartTime}
                    isMobile={isMobile}
                    getEventsForDay={getEventsForDay}
                    addTask={addTask}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                />
            )}
        </div>
    );
}

function PlanningPageView({
    selectedDate,
    onClose,
    title, setTitle,
    desc, setDesc,
    priority, setPriority,
    duration, setDuration,
    startTime, setStartTime,
    isMobile,
    getEventsForDay,
    addTask,
    updateTask,
    deleteTask
}: {
    selectedDate: Date;
    onClose: () => void;
    title: string;
    setTitle: (v: string) => void;
    desc: string;
    setDesc: (v: string) => void;
    priority: Priority;
    setPriority: (v: Priority) => void;
    duration: number;
    setDuration: (v: number) => void;
    startTime: Date | null;
    setStartTime: (v: Date | null) => void;
    isMobile: boolean;
    getEventsForDay: (day: number | Date) => { id: string; title: string; type: 'task' | 'reminder'; priority?: Priority; start?: Date; end?: Date; }[];
    addTask: (t: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
}) {
    const { templates, addTemplate, updateTemplate } = useTemplates();
    const [templateName, setTemplateName] = useState('');
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);

    // Mobile accordion state
    const [isTemplatesExpanded, setIsTemplatesExpanded] = useState(false);
    const [isScheduleExpanded, setIsScheduleExpanded] = useState(true); // Open by default
    const [isSaveTemplateExpanded, setIsSaveTemplateExpanded] = useState(false);
    const [previewingTemplate, setPreviewingTemplate] = useState<TimeTemplate | null>(null);
    const [sessionTasks, setSessionTasks] = useState<any[]>([]);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [finalizeLoading, setFinalizeLoading] = useState(false);

    const isOverlapping = (start: Date, duration_min: number, ignoreId?: string) => {
        const end = addMinutesFn(start, duration_min);

        // Check existing DB tasks
        const dbTasks = getEventsForDay(selectedDate).filter((e): e is { id: string; title: string; type: 'task'; priority: Priority; start: Date; end: Date; } => e.type === 'task');
        for (const t of dbTasks) {
            if (ignoreId === `db_${t.id}`) continue;
            const s = new Date(t.start);
            const e = t.end ? new Date(t.end) : addMinutesFn(s, 30);
            if (start < e && end > s) return true;
        }

        // Check session tasks
        for (const st of sessionTasks) {
            if (ignoreId && st.id === ignoreId) continue;
            const stEnd = addMinutesFn(st.start, st.duration);
            if (start < stEnd && end > st.start) return true;
        }

        return false;
    };

    const handleSaveAsTemplate = async () => {
        if (!templateName.trim()) return;
        setIsSavingTemplate(true);
        try {
            const dayEvents = getEventsForDay(selectedDate).filter((e: { type: string }) => e.type === 'task');
            const slots = dayEvents.map((e: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                title: e.title,
                startTime: format(e.start, 'HH:mm'),
                duration: e.end ? (new Date(e.end).getTime() - new Date(e.start).getTime()) / (1000 * 60) : 30,
                priority: (e.priority as Priority) || 'Medium'
            }));

            await addTemplate({
                name: templateName,
                slots
            });
            setTemplateName('');
        } catch (e) {
            console.error(e);
        } finally {
            setIsSavingTemplate(false);
        }
    };

    const handleApplyTemplate = async (template: TimeTemplate) => {
        let addedCount = 0;
        let overlapCount = 0;
        const newTasks = [...sessionTasks];

        template.slots.forEach((slot: TimeSlot) => {
            const [h, m] = slot.startTime.split(':').map(Number);
            const start = setHours(setMinutes(startOfDay(selectedDate), m), h);

            if (isOverlapping(start, slot.duration)) {
                overlapCount++;
            } else {
                newTasks.push({
                    id: 'session_' + Math.random().toString(36).slice(2, 11),
                    title: slot.title,
                    description: 'From template: ' + template.name,
                    priority: slot.priority,
                    start,
                    duration: slot.duration,
                    source: 'template'
                });
                addedCount++;
            }
        });

        setSessionTasks(newTasks);
        if (overlapCount > 0) {
            alert(`${addedCount} tasks added. ${overlapCount} tasks skipped due to time overlap.`);
        }
    };

    const handleAddToPlan = async () => {
        if (!title.trim() || !startTime) return;

        if (isOverlapping(startTime, duration, editingTaskId || undefined)) {
            alert('This time slot overlaps with an existing task. Please adjust the time or duration.');
            return;
        }

        if (editingTaskId) {
            if (editingTaskId.toString().startsWith('db_')) {
                const dbId = editingTaskId.toString().replace('db_', '');
                await updateTask(dbId, {
                    title,
                    description: desc,
                    priority,
                    deadline: startTime,
                    endTime: addMinutesFn(startTime, duration)
                });
                alert('Task updated in database.');
            } else {
                setSessionTasks(sessionTasks.map(t => t.id === editingTaskId ? {
                    ...t, title, description: desc, priority, start: startTime, duration
                } : t));
            }
            setEditingTaskId(null);
        } else {
            setSessionTasks([...sessionTasks, {
                id: 'session_' + Date.now(),
                title, description: desc, priority, start: startTime, duration,
                source: 'manual'
            }]);
        }

        // Reset form
        setTitle('');
        setDesc('');
        setPriority('Medium');
        setDuration(60);
        setStartTime(null);
    };

    const handleFinalizeSchedule = async () => {
        if (sessionTasks.length === 0) return;

        setFinalizeLoading(true);
        try {
            for (const t of sessionTasks) {
                await addTask({
                    title: t.title,
                    description: t.description || '',
                    priority: t.priority,
                    deadline: t.start,
                    endTime: addMinutesFn(t.start, t.duration),
                    completed: false,
                    repeat: 'None',
                    tags: t.source === 'template' ? ['template'] : []
                });
            }
            alert(`Schedule finalized! ${sessionTasks.length} tasks added.`);
            onClose();
        } catch (e) {
            console.error(e);
            alert('Error saving some tasks. Please try again.');
        } finally {
            setFinalizeLoading(false);
        }
    };
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            zIndex: 4000,
            overflowY: 'auto',
            animation: 'fadeIn 0.3s ease-out',
            color: 'white',
            fontFamily: "'Inter', sans-serif",
            backgroundAttachment: 'fixed'
        }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulseGlow { 0% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.2); } 50% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.4); } 100% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.2); } }
                
                .planning-input { transition: all 0.3s ease; }
                .planning-input:hover { border-color: rgba(255,255,255,0.5) !important; background: rgba(255,255,255,0.25) !important; }
                .planning-input:focus { border-color: #fff !important; box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2); outline: none; background: rgba(255,255,255,0.3) !important; }
                .planning-input::placeholder { color: rgba(255,255,255,0.5) !important; }
                
                .glass-card { 
                    background: rgba(15, 23, 42, 0.4); 
                    border: 1px solid rgba(255,255,255,0.15); 
                    border-radius: 16px; 
                    padding: 20px; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(20px);
                }
                .glass-card:hover { 
                    background: rgba(15, 23, 42, 0.5); 
                    border-color: rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.3);
                }

                .template-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 12px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .template-item:hover {
                    background: rgba(255,255,255,0.15);
                    border-color: rgba(255,255,255,0.3);
                    transform: translateX(4px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .timeline-item { transition: all 0.2s ease; }
                .timeline-item:hover { 
                    background: rgba(255,255,255,0.12) !important; 
                    border-color: rgba(255, 255, 255, 0.3) !important;
                    transform: translateX(4px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                
                .primary-btn {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                .primary-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 40px rgba(255, 255, 255, 0.3);
                    filter: brightness(1.2);
                }
                .primary-btn:active:not(:disabled) { transform: translateY(0px) scale(0.98); }
                
                .exit-btn { transition: all 0.2s ease; }
                .exit-btn:hover {
                    background: rgba(255, 255, 255, 0.15) !important;
                    border-color: rgba(255, 255, 255, 0.4) !important;
                    color: white !important;
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
                }

                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background-color: rgba(255,255,255,0.3); }

                /* Mobile Responsive Styles */
                @media (max-width: 768px) {
                    .glass-card {
                        padding: 16px;
                        border-radius: 16px;
                    }
                    .template-item {
                        padding: 10px 12px;
                        border-radius: 10px;
                    }
                    .timeline-item {
                        padding: 12px 14px !important;
                        border-radius: 12px !important;
                    }
                    .planning-input {
                        font-size: 0.95rem !important;
                        padding: 12px 14px !important;
                    }
                }

                @media (max-width: 480px) {
                    .glass-card {
                        padding: 12px;
                        border-radius: 12px;
                    }
                    .template-item {
                        padding: 8px 10px;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }
                    .timeline-item {
                        padding: 10px 12px !important;
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 8px;
                    }
                    .planning-input {
                        font-size: 0.9rem !important;
                        padding: 10px 12px !important;
                    }
                }
            `}</style>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '12px' : '40px 30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: isMobile ? '16px' : '24px', flexWrap: 'wrap', gap: isMobile ? '12px' : '16px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: '700', textTransform: 'uppercase', fontSize: isMobile ? '0.7rem' : '0.85rem', letterSpacing: isMobile ? '1px' : '2px', marginBottom: isMobile ? '8px' : '12px', opacity: 0.9 }}>
                            <Zap size={isMobile ? 14 : 18} />
                            TASK PLANNING
                        </div>
                        <h1 style={{ fontSize: isMobile ? '1.35rem' : '2.2rem', fontWeight: '800', margin: 0, letterSpacing: '-1.5px', color: 'white', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                            {format(selectedDate, isMobile ? 'MMM do' : 'EEEE, MMM do')}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
                        <button
                            onClick={onClose}
                            className="exit-btn"
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: isMobile ? '12px 20px' : '14px 28px', borderRadius: isMobile ? '12px' : '14px', cursor: 'pointer', fontWeight: '700', fontSize: isMobile ? '0.85rem' : '0.95rem', flex: isMobile ? 1 : 'initial' }}
                        >
                            {isMobile ? 'Exit' : 'Exit Planner'}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.8fr 1.2fr', gap: isMobile ? '16px' : '24px' }}>
                    {/* Left Column (Top on Mobile): Templates & Timeline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>

                        {/* Quick Templates Section */}
                        <div className="glass-card" style={{ padding: isMobile ? '16px' : '20px' }}>
                            <div
                                onClick={() => isMobile && setIsTemplatesExpanded(!isTemplatesExpanded)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: (isMobile && !isTemplatesExpanded) ? '0' : (isMobile ? '12px' : '16px'),
                                    cursor: isMobile ? 'pointer' : 'default',
                                    userSelect: 'none'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '10px' }}>
                                    <Library size={isMobile ? 14 : 18} color="#fbbf24" />
                                    <h4 style={{ margin: 0, fontSize: isMobile ? '0.85rem' : '0.95rem', fontWeight: '800', color: 'white' }}>Quick Templates</h4>
                                </div>
                                {isMobile ? (
                                    <div style={{ fontSize: '1.2rem', color: 'white', transform: isTemplatesExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                                        ▼
                                    </div>
                                ) : (
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>Apply instantly</span>
                                )}
                            </div>

                            {(!isMobile || isTemplatesExpanded) && (
                                templates.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: isMobile ? '16px' : '24px', border: isMobile ? '1px dashed rgba(255,255,255,0.2)' : '2px dashed rgba(255,255,255,0.2)', borderRadius: isMobile ? '10px' : '12px', background: 'rgba(255,255,255,0.05)' }}>
                                        <p style={{ margin: 0, fontSize: isMobile ? '0.75rem' : '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>No templates found.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '10px', maxHeight: isMobile ? '150px' : '200px', overflowY: 'auto', paddingRight: '4px' }}>
                                        {templates.map((t: TimeTemplate) => (
                                            <div key={t.id} className="template-item">
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '800', fontSize: isMobile ? '0.8rem' : '0.9rem', color: 'white' }}>{t.name}</div>
                                                    <div style={{ fontSize: isMobile ? '0.6rem' : '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>{t.slots.length} tasks</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: isMobile ? '4px' : '6px', alignItems: 'center' }}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setPreviewingTemplate(t); }}
                                                        style={{
                                                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white',
                                                            padding: isMobile ? '6px 10px' : '8px 14px', borderRadius: isMobile ? '6px' : '8px', fontSize: isMobile ? '0.65rem' : '0.75rem', fontWeight: '700', cursor: 'pointer',
                                                            transition: 'all 0.2s', flexShrink: 0,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                                            height: isMobile ? '28px' : '32px'
                                                        }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                                    >
                                                        <Eye size={isMobile ? 14 : 16} />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleApplyTemplate(t); }}
                                                        style={{
                                                            background: 'linear-gradient(135deg, #ffffff, #f0f0f0)', border: 'none', color: '#667eea',
                                                            padding: isMobile ? '6px 12px' : '8px 14px', borderRadius: isMobile ? '6px' : '8px', fontSize: isMobile ? '0.65rem' : '0.75rem', fontWeight: '800', cursor: 'pointer',
                                                            boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)', transition: 'all 0.2s', flexShrink: 0,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            height: isMobile ? '28px' : '32px'
                                                        }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 255, 255, 0.4)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.3)'; }}
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>

                        <div
                            onClick={() => isMobile && setIsScheduleExpanded(!isScheduleExpanded)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: isMobile ? '8px' : '10px',
                                cursor: isMobile ? 'pointer' : 'default',
                                userSelect: 'none',
                                padding: isMobile ? '12px 16px' : '0',
                                background: isMobile ? 'rgba(255,255,255,0.08)' : 'transparent',
                                borderRadius: isMobile ? '12px' : '0',
                                border: isMobile ? '1px solid rgba(255,255,255,0.15)' : 'none'
                            }}
                        >
                            <h3 style={{ margin: 0, fontSize: isMobile ? '0.85rem' : '0.95rem', fontWeight: '800', color: 'white' }}>Slots</h3>
                            {isMobile ? (
                                <div style={{ fontSize: '1.2rem', color: 'white', transform: isScheduleExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                                    ▼
                                </div>
                            ) : (
                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>Click to select</span>
                            )}
                        </div>

                        {(!isMobile || isScheduleExpanded) && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '10px', maxHeight: isMobile ? '400px' : '500px', overflowY: 'auto', paddingRight: isMobile ? '4px' : '8px', marginTop: isMobile ? '12px' : '0' }}>
                                {(() => {
                                    const dbTasks = getEventsForDay(selectedDate)
                                        .filter((e): e is { id: string; title: string; type: 'task'; priority: Priority; start: Date; end: Date; } => e.type === 'task')
                                        .map(t => {
                                            const s = new Date(t.start!);
                                            const e = t.end ? new Date(t.end) : addMinutesFn(s, 30);
                                            return {
                                                ...t,
                                                source: 'db',
                                                start: s,
                                                end: e,
                                                duration: (e.getTime() - s.getTime()) / (1000 * 60),
                                                id: 'db_' + t.id
                                            };
                                        });

                                    const allPlannedTasks = [
                                        ...dbTasks,
                                        ...sessionTasks.map(t => ({
                                            title: t.title,
                                            start: t.start,
                                            end: addMinutesFn(t.start, t.duration),
                                            source: 'session',
                                            id: t.id,
                                            priority: t.priority,
                                            description: t.description,
                                            duration: t.duration
                                        }))
                                    ].sort((a: any, b: any) => (a.start as Date).getTime() - (b.start as Date).getTime());

                                    const dayTimeline: any[] = [];
                                    let lastTime = startOfDay(selectedDate);

                                    allPlannedTasks.forEach((event: any) => {
                                        if (event.start > lastTime) {
                                            dayTimeline.push({
                                                type: 'free',
                                                start: lastTime,
                                                end: event.start,
                                                duration: ((event.start as Date).getTime() - lastTime.getTime()) / (1000 * 60)
                                            });
                                        }

                                        dayTimeline.push({
                                            type: 'task',
                                            ...event
                                        });

                                        lastTime = event.end;
                                    });

                                    const eod = setHours(setMinutes(startOfDay(selectedDate), 59), 23);
                                    if (lastTime < eod) {
                                        dayTimeline.push({
                                            type: 'free',
                                            start: lastTime,
                                            end: eod,
                                            duration: (eod.getTime() - lastTime.getTime()) / (1000 * 60)
                                        });
                                    }

                                    return dayTimeline.map((item, i) => {
                                        const isSelected = item.type === 'free' && startTime && item.start.getTime() === startTime.getTime();
                                        const canFit = item.type === 'free' && item.duration >= duration;
                                        const isDraft = item.source === 'session';

                                        return (
                                            <div
                                                key={i}
                                                className="timeline-item"
                                                onClick={() => item.type === 'free' && setStartTime(item.start)}
                                                style={{
                                                    padding: isMobile ? '10px 12px' : '12px 16px',
                                                    borderRadius: isMobile ? '10px' : '12px',
                                                    background: isSelected ? 'rgba(255, 255, 255, 0.25)' : isDraft ? 'rgba(102, 126, 234, 0.15)' : item.type === 'task' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.08)',
                                                    border: isMobile ? '1px solid' : '2px solid',
                                                    borderColor: isSelected ? 'white' : isDraft ? '#667eea' : item.type === 'task' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.15)',
                                                    cursor: item.type === 'task' && !isDraft ? 'default' : 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    opacity: item.type === 'free' && !canFit ? 0.6 : 1
                                                }}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', fontWeight: '800', color: 'white' }}>
                                                        {format(item.start, 'h:mm a')} - {format(item.end, 'h:mm a')}
                                                    </div>
                                                    {item.type === 'free' ? (
                                                        <div style={{ fontSize: isMobile ? '0.6rem' : '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px', fontWeight: '600' }}>
                                                            {Math.floor(item.duration)} min free
                                                        </div>
                                                    ) : (
                                                        <div style={{ fontSize: isMobile ? '0.6rem' : '0.65rem', color: 'rgba(255,255,255,0.6)', maxWidth: isMobile ? '140px' : '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '600', marginTop: '1px' }}>
                                                            {item.title}
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    {item.type === 'task' ? (
                                                        <>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setTitle(item.title);
                                                                    setDesc(item.description || '');
                                                                    setPriority(item.priority);
                                                                    setDuration(item.duration);
                                                                    setStartTime(item.start);
                                                                    setEditingTaskId(item.id);
                                                                }}
                                                                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    if (isDraft) {
                                                                        setSessionTasks(sessionTasks.filter(t => t.id !== item.id));
                                                                    } else {
                                                                        if (window.confirm('Delete this task from database?')) {
                                                                            await deleteTask(item.id.replace('db_', ''));
                                                                        }
                                                                    }
                                                                    if (editingTaskId === item.id) {
                                                                        setEditingTaskId(null);
                                                                        setTitle('');
                                                                        setDesc('');
                                                                        setStartTime(null);
                                                                    }
                                                                }}
                                                                style={{ background: 'rgba(239, 68, 68, 0.2)', border: 'none', color: '#f87171', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                            {isDraft ? (
                                                                <div style={{ fontSize: '0.6rem', background: '#667eea', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: '900' }}>PLAN</div>
                                                            ) : (
                                                                <div style={{ fontSize: '0.6rem', background: 'rgba(239, 68, 68, 0.4)', color: 'white', padding: '2px 4px', borderRadius: '4px', fontWeight: '800' }}>LIVE</div>
                                                            )}
                                                        </>
                                                    ) : isSelected ? (
                                                        <div style={{ background: 'white', color: '#667eea', fontSize: isMobile ? '0.65rem' : '0.75rem', fontWeight: '900', padding: isMobile ? '4px 10px' : '6px 12px', borderRadius: isMobile ? '6px' : '8px', boxShadow: '0 4px 12px rgba(255,255,255,0.3)' }}>SELECTED</div>
                                                    ) : canFit ? (
                                                        <div style={{ color: 'white', fontSize: isMobile ? '0.7rem' : '0.8rem', fontWeight: '700' }}>Select</div>
                                                    ) : (
                                                        <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: isMobile ? '0.65rem' : '0.75rem', fontWeight: '600' }}>Full</div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        )}

                        {/* Save as Template Section - Desktop Only, in Left Column */}
                        {!isMobile && (
                            <div className="glass-card" style={{ padding: '20px', marginTop: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                    <Save size={20} color="white" />
                                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'white' }}>Save as Template</h4>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        placeholder="Template name..."
                                        value={templateName}
                                        onChange={e => setTemplateName(e.target.value)}
                                        className="planning-input"
                                        style={{ flex: 1, background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)', color: 'white', padding: '12px 16px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600' }}
                                    />
                                    <button
                                        disabled={!templateName.trim() || isSavingTemplate}
                                        onClick={handleSaveAsTemplate}
                                        style={{
                                            background: templateName.trim() ? 'linear-gradient(135deg, #ffffff, #f0f0f0)' : 'rgba(255,255,255,0.1)',
                                            border: 'none',
                                            color: templateName.trim() ? '#667eea' : 'rgba(255,255,255,0.4)',
                                            padding: '0 20px',
                                            borderRadius: '10px',
                                            fontWeight: '800',
                                            cursor: templateName.trim() ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.2s',
                                            fontSize: '0.9rem',
                                            boxShadow: templateName.trim() ? '0 4px 12px rgba(255, 255, 255, 0.3)' : 'none'
                                        }}
                                    >
                                        {isSavingTemplate ? '...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Bottom on Mobile): Task Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
                        <div className="glass-card" style={{ padding: isMobile ? '12px' : '16px' }}>
                            <label style={{ display: 'block', marginBottom: isMobile ? '6px' : '8px', color: 'white', fontWeight: '700', fontSize: isMobile ? '0.7rem' : '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Task Title</label>
                            <input
                                autoFocus
                                className="planning-input"
                                placeholder="What needs to be done?"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: isMobile ? '1px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.3)',
                                    color: 'white',
                                    padding: isMobile ? '12px 14px' : '14px 18px',
                                    borderRadius: isMobile ? '10px' : '12px',
                                    fontSize: isMobile ? '0.95rem' : '1.1rem',
                                    fontWeight: '700'
                                }}
                            />
                        </div>

                        <div className="glass-card" style={{ padding: isMobile ? '12px' : '16px' }}>
                            <label style={{ display: 'block', marginBottom: isMobile ? '6px' : '8px', color: 'white', fontWeight: '700', fontSize: isMobile ? '0.7rem' : '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Description (Optional)</label>
                            <textarea
                                placeholder="Add notes, links, or expectations..."
                                value={desc}
                                onChange={e => setDesc(e.target.value)}
                                className="planning-input"
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.15)',
                                    border: isMobile ? '1px solid rgba(255,255,255,0.25)' : '2px solid rgba(255,255,255,0.25)',
                                    color: 'white',
                                    padding: isMobile ? '12px 14px' : '14px 18px',
                                    borderRadius: isMobile ? '10px' : '12px',
                                    fontSize: isMobile ? '0.85rem' : '0.95rem',
                                    minHeight: isMobile ? '80px' : '100px',
                                    resize: 'vertical',
                                    fontWeight: '500'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '12px' : '16px' }}>
                            <div className="glass-card" style={{ padding: isMobile ? '12px' : '16px' }}>
                                <label style={{ display: 'block', marginBottom: isMobile ? '6px' : '8px', color: 'white', fontWeight: '700', fontSize: isMobile ? '0.7rem' : '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Priority</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={priority}
                                        onChange={e => setPriority(e.target.value as Priority)}
                                        className="planning-input"
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.2)',
                                            border: isMobile ? '1px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.3)',
                                            color: 'white',
                                            padding: isMobile ? '10px 14px' : '12px 18px',
                                            borderRadius: isMobile ? '10px' : '12px',
                                            fontSize: isMobile ? '0.85rem' : '0.95rem',
                                            appearance: 'none',
                                            cursor: 'pointer',
                                            fontWeight: '700'
                                        }}
                                    >
                                        <option value="High" style={{ background: '#1e293b', color: 'white' }}>🔴 High</option>
                                        <option value="Medium" style={{ background: '#1e293b', color: 'white' }}>🟡 Medium</option>
                                        <option value="Low" style={{ background: '#1e293b', color: 'white' }}>🟢 Low</option>
                                    </select>
                                    <div style={{ position: 'absolute', right: isMobile ? '12px' : '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'white', opacity: 0.5, fontSize: '0.7rem' }}>
                                        ▼
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card" style={{ padding: isMobile ? '12px' : '16px' }}>
                                <label style={{ display: 'block', marginBottom: isMobile ? '6px' : '8px', color: 'white', fontWeight: '700', fontSize: isMobile ? '0.7rem' : '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Duration (min)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={e => setDuration(parseInt(e.target.value) || 0)}
                                    className="planning-input"
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: isMobile ? '1px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.3)',
                                        color: 'white',
                                        padding: isMobile ? '10px 14px' : '12px 18px',
                                        borderRadius: isMobile ? '10px' : '12px',
                                        fontSize: isMobile ? '0.95rem' : '1.1rem',
                                        fontWeight: '700'
                                    }}
                                />
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: isMobile ? '8px 12px' : '10px 14px', border: isMobile ? '1px solid rgba(255, 255, 255, 0.4)' : '2px solid rgba(255, 255, 255, 0.4)', background: 'rgba(255, 255, 255, 0.15)' }}>
                            <label style={{ display: 'block', marginBottom: isMobile ? '4px' : '6px', color: 'white', fontWeight: '800', fontSize: isMobile ? '0.65rem' : '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>⏰ {isMobile ? 'Start' : 'Start Time'}</label>
                            <div style={{ display: 'flex', gap: isMobile ? '6px' : '10px', alignItems: 'center' }}>
                                <input
                                    type="time"
                                    className="planning-input"
                                    value={startTime ? format(startTime, 'HH:mm') : ''}
                                    onChange={e => {
                                        if (!e.target.value) return;
                                        const [h, m] = e.target.value.split(':').map(Number);
                                        setStartTime(setHours(setMinutes(startOfDay(selectedDate), m), h));
                                    }}
                                    style={{
                                        flex: 2,
                                        minWidth: '100px',
                                        background: 'rgba(255,255,255,0.25)',
                                        border: isMobile ? '1px solid rgba(255,255,255,0.4)' : '2px solid rgba(255,255,255,0.4)',
                                        color: 'white',
                                        padding: isMobile ? '6px 10px' : '8px 12px',
                                        borderRadius: isMobile ? '8px' : '10px',
                                        fontSize: isMobile ? '0.9rem' : '1.05rem',
                                        fontWeight: '800'
                                    }}
                                />
                                <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: isMobile ? '4px 6px' : '6px 10px', borderRadius: isMobile ? '8px' : '10px' }}>
                                    <span style={{ display: 'block', fontSize: '0.55rem', color: 'white', textTransform: 'uppercase', marginBottom: '1px', fontWeight: '700', opacity: 0.7 }}>Ends</span>
                                    <span style={{ fontSize: isMobile ? '0.8rem' : '0.95rem', fontWeight: '900', color: 'white' }}>
                                        {startTime ? format(addMinutesFn(startTime, duration), 'h:mm a') : '--:--'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToPlan}
                            disabled={!title.trim() || !startTime || finalizeLoading}
                            className="primary-btn"
                            style={{
                                marginTop: isMobile ? '6px' : '8px',
                                background: (!title.trim() || !startTime) ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #ffffff, #f0f0f0)',
                                border: 'none',
                                color: (!title.trim() || !startTime) ? 'rgba(255,255,255,0.5)' : '#667eea',
                                padding: isMobile ? '14px 18px' : '18px 24px',
                                borderRadius: isMobile ? '10px' : '12px',
                                fontWeight: '900',
                                fontSize: isMobile ? '0.95rem' : '1.15rem',
                                cursor: (!title.trim() || !startTime) ? 'not-allowed' : 'pointer',
                                boxShadow: (!title.trim() || !startTime) ? 'none' : '0 10px 30px rgba(255, 255, 255, 0.3)',
                                textTransform: 'uppercase',
                                letterSpacing: isMobile ? '0.5px' : '1px',
                                width: '100%'
                            }}
                        >
                            {editingTaskId ? '✓ Update Plan' : '✓ Add to Plan'}
                        </button>

                        {sessionTasks.length > 0 && (
                            <button
                                onClick={handleFinalizeSchedule}
                                disabled={finalizeLoading}
                                style={{
                                    marginTop: '8px',
                                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                    border: 'none',
                                    color: '#0f172a',
                                    padding: isMobile ? '14px 18px' : '16px 20px',
                                    borderRadius: isMobile ? '10px' : '12px',
                                    fontWeight: '900',
                                    fontSize: isMobile ? '0.9rem' : '1rem',
                                    cursor: 'pointer',
                                    width: '100%',
                                    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.3)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                            >
                                {finalizeLoading ? 'Saving...' : 'SAVE'}
                            </button>
                        )}

                        {/* Save as Template Section - Only on Mobile, After Schedule Button */}
                        {isMobile && (
                            <div className="glass-card" style={{ marginTop: '16px' }}>
                                <div
                                    onClick={() => setIsSaveTemplateExpanded(!isSaveTemplateExpanded)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: !isSaveTemplateExpanded ? '0' : '12px',
                                        cursor: 'pointer',
                                        userSelect: 'none'
                                    }}
                                >
                                    <Save size={16} color="white" />
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: 'white', flex: 1 }}>Save as Template</h4>
                                    <div style={{ fontSize: '1.2rem', color: 'white', transform: isSaveTemplateExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                                        ▼
                                    </div>
                                </div>
                                {isSaveTemplateExpanded && (
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <input
                                            placeholder="Template name..."
                                            value={templateName}
                                            onChange={e => setTemplateName(e.target.value)}
                                            className="planning-input"
                                            style={{ flex: 1, minWidth: '100%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}
                                        />
                                        <button
                                            disabled={!templateName.trim() || isSavingTemplate}
                                            onClick={handleSaveAsTemplate}
                                            style={{
                                                background: templateName.trim() ? 'linear-gradient(135deg, #ffffff, #f0f0f0)' : 'rgba(255,255,255,0.1)',
                                                border: 'none',
                                                color: templateName.trim() ? '#667eea' : 'rgba(255,255,255,0.4)',
                                                padding: '10px 18px',
                                                borderRadius: '8px',
                                                fontWeight: '800',
                                                cursor: templateName.trim() ? 'pointer' : 'not-allowed',
                                                transition: 'all 0.2s',
                                                fontSize: '0.8rem',
                                                boxShadow: templateName.trim() ? '0 4px 12px rgba(255, 255, 255, 0.3)' : 'none',
                                                minWidth: '100%'
                                            }}
                                        >
                                            {isSavingTemplate ? '...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Template Preview Modal */}
            {previewingTemplate && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 5000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px', backdropFilter: 'blur(8px)',
                    animation: 'fadeIn 0.2s ease-out'
                }} onClick={() => setPreviewingTemplate(null)}>
                    <div className="glass-card" style={{
                        maxWidth: '500px', width: '100%', maxHeight: '80vh',
                        display: 'flex', flexDirection: 'column',
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: isMobile ? '20px' : '30px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Library size={24} color="#fbbf24" />
                                <h3 style={{ margin: 0, fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: '900', color: 'white' }}>{previewingTemplate.name}</h3>
                            </div>
                            <button onClick={() => setPreviewingTemplate(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px', marginBottom: '24px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {previewingTemplate.slots.length} Tasks in this template
                            </div>
                            {previewingTemplate.slots.map((slot: TimeSlot, idx: number) => {
                                const isEditingSlot = editingTaskId === `template_slot_${idx}`;
                                return (
                                    <div key={idx} style={{
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        position: 'relative'
                                    }}>
                                        {isEditingSlot ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <input
                                                    value={title}
                                                    onChange={e => setTitle(e.target.value)}
                                                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                                                />
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <input
                                                        type="time"
                                                        value={startTime ? format(startTime, 'HH:mm') : slot.startTime}
                                                        onChange={e => {
                                                            const [h, m] = e.target.value.split(':').map(Number);
                                                            setStartTime(setHours(setMinutes(startOfDay(new Date()), m), h));
                                                        }}
                                                        style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}
                                                    />
                                                    <input
                                                        type="number"
                                                        value={duration}
                                                        onChange={e => setDuration(parseInt(e.target.value) || 0)}
                                                        style={{ width: '80px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                    <button
                                                        onClick={async () => {
                                                            const newSlots = [...previewingTemplate.slots];
                                                            newSlots[idx] = {
                                                                ...slot,
                                                                title,
                                                                startTime: startTime ? format(startTime, 'HH:mm') : slot.startTime,
                                                                duration,
                                                                priority
                                                            };
                                                            await updateTemplate(previewingTemplate.id, { slots: newSlots });
                                                            setPreviewingTemplate({ ...previewingTemplate, slots: newSlots });
                                                            setEditingTaskId(null);
                                                            setTitle('');
                                                            setStartTime(null);
                                                        }}
                                                        style={{ flex: 1, background: '#10b981', border: 'none', color: 'white', padding: '6px', borderRadius: '6px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                                                    >
                                                        Save Slot
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditingTaskId(null); setTitle(''); }}
                                                        style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px', borderRadius: '6px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div style={{ fontWeight: '800', color: 'white', fontSize: '1rem' }}>{slot.title}</div>
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <button
                                                            onClick={() => {
                                                                setEditingTaskId(`template_slot_${idx}`);
                                                                setTitle(slot.title);
                                                                setDuration(slot.duration);
                                                                setPriority(slot.priority);
                                                                const [h, m] = slot.startTime.split(':').map(Number);
                                                                setStartTime(setHours(setMinutes(startOfDay(new Date()), m), h));
                                                            }}
                                                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            <Edit2 size={12} />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (window.confirm('Remove this task from template?')) {
                                                                    const newSlots = previewingTemplate.slots.filter((_slot: TimeSlot, i: number) => i !== idx);
                                                                    await updateTemplate(previewingTemplate.id, { slots: newSlots });
                                                                    setPreviewingTemplate({ ...previewingTemplate, slots: newSlots });
                                                                }
                                                            }}
                                                            style={{ background: 'rgba(239, 68, 68, 0.2)', border: 'none', color: '#f87171', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: '600', marginTop: '4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock size={14} /> {slot.startTime}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <TrendingUp size={14} /> {slot.priority}
                                                    </div>
                                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                                        {slot.duration} min
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setPreviewingTemplate(null)}
                                style={{
                                    flex: 1, padding: '14px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '14px',
                                    fontWeight: '800', cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                            <button
                                onClick={() => { handleApplyTemplate(previewingTemplate); setPreviewingTemplate(null); }}
                                style={{
                                    flex: 2, padding: '14px',
                                    background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
                                    border: 'none', color: '#667eea', borderRadius: '14px',
                                    fontWeight: '900', cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
