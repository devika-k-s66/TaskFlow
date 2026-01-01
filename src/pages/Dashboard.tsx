import { useState, useEffect } from 'react';
import { format, isToday, isPast, isAfter, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isWithinInterval, startOfDay, endOfDay, addMonths, subMonths, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { CheckSquare, Zap, Bell, AlertCircle, Clock, Calendar, ChevronLeft, ChevronRight, Edit, Trash2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks, useAutomations, useReminders } from '../hooks/useFirestore';

export default function Dashboard() {
    const { user } = useAuth();
    const { tasks, updateTask, deleteTask } = useTasks();
    const { automations } = useAutomations();
    const { reminders } = useReminders();

    // Responsive State
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1200;
    const isSmallPhone = width < 480;

    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'custom'>('today');
    const [rangeStart, setRangeStart] = useState<Date>(startOfDay(new Date()));
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

    // Calendar UI State
    const [viewDate, setViewDate] = useState(new Date());
    const [tempStart, setTempStart] = useState<Date>(startOfDay(new Date()));
    const [tempEnd, setTempEnd] = useState<Date | null>(null);
    const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, boolean>>({});

    // Generate grid logic
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarGrid = eachDayOfInterval({
        start: gridStart,
        end: gridEnd
    });

    const handlePrevMonth = () => setViewDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setViewDate(prev => addMonths(prev, 1));

    const handleTempDateClick = (day: Date) => {
        const clickedDay = startOfDay(day);
        if (!tempEnd && !isSameDay(clickedDay, tempStart)) {
            const start = tempStart < clickedDay ? tempStart : clickedDay;
            const end = tempStart < clickedDay ? clickedDay : tempStart;
            setTempStart(start);
            setTempEnd(end);
        } else {
            setTempStart(clickedDay);
            setTempEnd(null);
        }
    };

    const applySelection = () => {
        setRangeStart(tempStart);
        setRangeEnd(tempEnd);
        setTimeRange((tempEnd || !isToday(tempStart)) ? 'custom' : 'today');
    };

    const getRangeFilter = (date: Date) => {
        const checkDate = startOfDay(date);
        if (!rangeEnd) return isSameDay(checkDate, rangeStart);
        return isWithinInterval(checkDate, {
            start: startOfToday(rangeStart),
            end: startOfToday(rangeEnd)
        });
    };

    const startOfToday = (d: Date) => startOfDay(d);

    // Calculate dynamic stats based on range
    const tasksInRange = tasks.filter(t => getRangeFilter(t.deadline));
    const tasksPending = tasksInRange.filter(t => !t.completed).length;
    const tasksCompleted = tasksInRange.filter(t => t.completed).length;
    const tasksProgress = tasksInRange.length > 0 ? (tasksCompleted / tasksInRange.length) * 100 : 0;

    const automationsActive = automations.filter(a => a.enabled).length;
    const automationsProgress = automations.length > 0 ? (automationsActive / automations.length) * 100 : 0;

    const remindersInRange = reminders.filter(r => getRangeFilter(r.time));
    const pendingReminders = remindersInRange.filter(r => r.status === 'pending').length;
    const completedRemindersCount = remindersInRange.filter(r => r.status === 'sent' || r.status === 'snoozed').length;
    const remindersProgress = remindersInRange.length > 0 ? (completedRemindersCount / remindersInRange.length) * 100 : 0;

    const overdueTasks = tasks.filter(t => {
        if (t.completed || !isPast(t.deadline)) return false;
        return getRangeFilter(t.deadline);
    }).length;
    const overdueProgress = tasks.length > 0 ? (overdueTasks / tasks.length) * 100 : 0;

    const stats = {
        tasksPending,
        tasksProgress,
        automationsRunning: automationsActive,
        automationsProgress,
        upcomingReminders: pendingReminders,
        remindersProgress,
        overdueItems: overdueTasks,
        overdueProgress
    };

    // Show both pending and completed tasks for the range
    const filteredMissions = tasks
        .filter(t => getRangeFilter(t.deadline))
        .sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return a.deadline.getTime() - b.deadline.getTime();
        })
        .slice(0, 6);

    const upcomingTasksInRange = tasks.filter(t => !t.completed && isAfter(t.deadline, new Date()) && getRangeFilter(t.deadline));
    const upcomingRemindersInRange = reminders.filter(r => r.status === 'pending' && isAfter(r.time, new Date()) && getRangeFilter(r.time));

    const upNextItems = [
        ...upcomingTasksInRange.map(t => ({ id: t.id, title: t.title, time: t.deadline, type: 'task' as const })),
        ...upcomingRemindersInRange.map(r => ({ id: r.id, title: r.title, time: r.time, type: 'reminder' as const }))
    ].sort((a, b) => a.time.getTime() - b.time.getTime()).slice(0, 4);

    const activeAutomationsList = automations
        .sort((a, b) => (b.enabled ? 1 : 0) - (a.enabled ? 1 : 0))
        .slice(0, 4);

    const handleToggleTask = async (task: any) => {
        const newStatus = !task.completed;
        setOptimisticUpdates(prev => ({ ...prev, [task.id]: newStatus }));
        try {
            await updateTask(task.id, { completed: newStatus });
            setOptimisticUpdates(prev => {
                const next = { ...prev };
                delete next[task.id];
                return next;
            });
        } catch (error) {
            console.error("Failed to toggle task:", error);
            setOptimisticUpdates(prev => {
                const next = { ...prev };
                delete next[task.id];
                return next;
            });
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm("Are you sure you want to delete this mission?")) {
            try {
                await deleteTask(taskId);
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
        }
    };

    const handleEditTask = (task: any) => {
        navigate('/dashboard/calendar', { state: { scrollToCalendar: true, editTask: task } });
    };

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
                padding: isSmallPhone ? '16px 12px' : isMobile ? '24px 16px' : '40px 48px',
                width: '100%',
                boxSizing: 'border-box'
            }}>

                {/* 1. HERO GREETING */}
                <div className="page-title" style={{
                    marginBottom: isMobile ? '24px' : '48px',
                    display: 'flex',
                    flexDirection: width < 1000 ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: width < 1000 ? 'flex-start' : 'center',
                    gap: '24px'
                }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h1 style={{
                            fontSize: isSmallPhone ? '1.75rem' : isMobile ? '2rem' : '3rem',
                            fontWeight: '300',
                            letterSpacing: '-1px',
                            marginBottom: '8px',
                            color: 'white',
                            lineHeight: '1.1',
                            wordBreak: 'break-word'
                        }}>
                            {getGreeting()}, <span style={{ fontWeight: '600' }}>{getUserName()}.</span>
                        </h1>
                        <p style={{
                            fontSize: isSmallPhone ? '0.9rem' : '1.1rem',
                            color: 'rgba(255,255,255,0.7)',
                            fontWeight: '400',
                            maxWidth: '600px',
                            lineHeight: '1.5'
                        }}>
                            {format(new Date(), 'EEEE, MMMM do')}. Your scheduled operations overview.
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: width < 1000 ? '100%' : 'auto',
                        minWidth: width < 1000 ? 0 : '300px'
                    }}>
                        {/* Ultra-Compact Premium Mini Calendar */}
                        <div className="glass-clear" style={{
                            padding: '16px',
                            borderRadius: '20px',
                            background: 'rgba(15, 23, 42, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                            width: '100%',
                            backdropFilter: 'blur(16px)'
                        }}>
                            {/* Calendar Header - Slim */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
                                <button onClick={handlePrevMonth} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', display: 'flex' }}><ChevronLeft size={16} /></button>
                                <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', margin: 0, letterSpacing: '0.5px' }}>{format(viewDate, 'MMMM yyyy')}</h3>
                                <button onClick={handleNextMonth} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', display: 'flex' }}><ChevronRight size={16} /></button>
                            </div>

                            {/* Weekday Labels - Muted */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '12px' }}>
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                    <span key={i} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: '700', textAlign: 'center' }}>{day}</span>
                                ))}
                            </div>

                            {/* Date Grid - Refined circular highlights */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '16px' }}>
                                {calendarGrid.map((day, i) => {
                                    const isCurrentMonth = isSameMonth(day, viewDate);
                                    const isStart = isSameDay(day, tempStart);
                                    const isEnd = tempEnd && isSameDay(day, tempEnd);
                                    const isInRange = tempEnd && isWithinInterval(day, {
                                        start: tempStart < tempEnd ? tempStart : tempEnd,
                                        end: tempStart < tempEnd ? tempEnd : tempStart
                                    });

                                    // Calculate tasks for this day
                                    const dayTasks = tasks.filter(t => isSameDay(t.deadline, day));
                                    const dotCount = Math.min(dayTasks.length, 3);
                                    const hasOverdue = dayTasks.some(t => !t.completed && isPast(t.deadline));

                                    return (
                                        <div
                                            key={i}
                                            onClick={() => handleTempDateClick(day)}
                                            style={{
                                                aspectRatio: '1',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                borderRadius: '50%',
                                                fontSize: '0.75rem',
                                                fontWeight: (isStart || isEnd) ? '700' : '500',
                                                color: (isStart || isEnd) ? '#1e293b' : isInRange ? 'white' : isCurrentMonth ? 'white' : 'rgba(255,255,255,0.2)',
                                                background: (isStart || isEnd) ? 'white' : isInRange ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                            }}
                                        >
                                            <span style={{ position: 'relative', zIndex: 1 }}>{format(day, 'd')}</span>
                                            {dayTasks.length > 0 && !isStart && !isEnd && (
                                                <div style={{
                                                    width: '4px', height: '4px',
                                                    borderRadius: '50%',
                                                    background: hasOverdue ? '#f87171' : '#818cf8',
                                                    marginTop: '2px',
                                                    opacity: isInRange ? 1 : 0.6
                                                }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Apply Button - Minimalist Signature */}
                            <button
                                onClick={applySelection}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'white',
                                    color: '#1e293b',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.2s',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. STATS GRID */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: width < 600 ? '1fr' : width < 1100 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: isMobile ? '16px' : '24px',
                    marginBottom: isMobile ? '32px' : '48px'
                }}>
                    {/* Stats Item 1 - Tasks Pending */}
                    <div
                        className="glass-clear"
                        onClick={() => navigate('/dashboard/tasks', { state: { filter: 'active', rangeStart: rangeStart.toISOString(), rangeEnd: rangeEnd ? rangeEnd.toISOString() : null } })}
                        style={{
                            padding: isMobile ? '20px' : '24px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            borderRadius: '20px'
                        }}
                        onMouseEnter={e => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            }
                        }}
                    >
                        <div className="flex items-center justify-between mb-md">
                            <div style={{
                                width: '44px', height: '44px',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                            }}>
                                <CheckSquare size={22} />
                            </div>
                            <span style={{ fontSize: '2.25rem', fontWeight: '700', color: 'white' }}>{stats.tasksPending}</span>
                        </div>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '12px' }}>
                                {timeRange === 'today' ? "Today's" : (rangeEnd ? "Scheduled" : format(rangeStart, 'MMM do'))} Tasks
                            </p>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.tasksProgress}%`, height: '100%', background: 'white', borderRadius: '99px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Item 2 - Overdue */}
                    <div
                        className="glass-clear"
                        onClick={() => navigate('/dashboard/tasks', { state: { filter: 'overdue', rangeStart: rangeStart.toISOString(), rangeEnd: rangeEnd ? rangeEnd.toISOString() : null } })}
                        style={{
                            padding: isMobile ? '20px' : '24px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            borderRadius: '20px'
                        }}
                        onMouseEnter={e => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.background = 'rgba(255, 59, 48, 0.15)';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            }
                        }}
                    >
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
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '12px' }}>
                                Needs Attention
                            </p>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.overdueProgress}%`, height: '100%', background: '#f87171', borderRadius: '99px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Item 3 - Reminders */}
                    <div
                        className="glass-clear"
                        onClick={() => navigate('/dashboard/reminders')}
                        style={{
                            padding: isMobile ? '20px' : '24px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            borderRadius: '20px'
                        }}
                        onMouseEnter={e => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.background = 'rgba(255, 149, 0, 0.15)';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            }
                        }}
                    >
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
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '12px' }}>Reminders</p>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.remindersProgress}%`, height: '100%', background: '#fbbf24', borderRadius: '99px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Item 4 - Active Automations */}
                    <div
                        className="glass-clear"
                        onClick={() => navigate('/dashboard/automations')}
                        style={{
                            padding: isMobile ? '20px' : '24px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            borderRadius: '20px'
                        }}
                        onMouseEnter={e => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.background = 'rgba(52, 199, 89, 0.15)';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            }
                        }}
                    >
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
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '12px' }}>Active Automations</p>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.automationsProgress}%`, height: '100%', background: '#4ade80', borderRadius: '99px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MAIN CONTENT */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: width < 1200 ? '1fr' : '2fr 1fr',
                    gap: isMobile ? '24px' : '32px',
                    alignItems: 'start'
                }}>

                    {/* TASK LIST */}
                    <div style={{ minWidth: 0 }}>
                        <div className="glass-clear" style={{ height: '100%', padding: isMobile ? '20px' : '32px', borderRadius: '24px' }}>
                            <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ color: 'white', fontWeight: '500', fontSize: isMobile ? '1.1rem' : '1.4rem' }}>
                                    {timeRange === 'today' ? "Today's" : (rangeEnd ? "Priority" : format(rangeStart, 'MMM do'))} Missions
                                </h3>

                                <button className="btn btn-sm" style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    borderRadius: '100px',
                                    padding: '8px 20px',
                                    transition: 'all 0.2s',
                                    fontWeight: '500',
                                    fontSize: '0.85rem'
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                    onClick={() => navigate('/dashboard/tasks', { state: { filter: timeRange, rangeStart: rangeStart.toISOString(), rangeEnd: rangeEnd ? rangeEnd.toISOString() : null } })}
                                >View All</button>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                {filteredMissions.length === 0 ? (
                                    <div style={{ padding: '48px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                        <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No missions found.</p>
                                        <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Enjoy your free time or schedule new tasks.</p>
                                    </div>
                                ) : (
                                    filteredMissions.map(task => {
                                        const isCompleted = optimisticUpdates[task.id] !== undefined ? optimisticUpdates[task.id] : task.completed;
                                        const isOverdue = !isCompleted && isPast(task.deadline);
                                        return (
                                            <div key={task.id} style={{
                                                display: 'flex', alignItems: 'center', padding: isMobile ? '12px' : '16px 20px',
                                                borderRadius: '16px',
                                                marginBottom: '10px',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                background: isCompleted ? 'rgba(74, 222, 128, 0.05)' : isOverdue ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.02)',
                                                border: isCompleted ? '1px solid rgba(74, 222, 128, 0.2)' : isOverdue ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                                                position: 'relative'
                                            }}
                                                onMouseEnter={(e) => {
                                                    if (!isMobile) {
                                                        e.currentTarget.style.background = isCompleted ? 'rgba(74, 222, 128, 0.1)' : isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)';
                                                        e.currentTarget.style.transform = 'scale(1.01) translateX(4px)';
                                                        e.currentTarget.style.borderColor = isCompleted ? 'rgba(74, 222, 128, 0.3)' : isOverdue ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255,255,255,0.1)';
                                                        const actions = e.currentTarget.querySelector('.task-actions') as HTMLElement;
                                                        if (actions) actions.style.opacity = '1';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isMobile) {
                                                        e.currentTarget.style.background = isCompleted ? 'rgba(74, 222, 128, 0.05)' : isOverdue ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.02)';
                                                        e.currentTarget.style.transform = 'scale(1) translateX(0)';
                                                        e.currentTarget.style.borderColor = isCompleted ? 'rgba(74, 222, 128, 0.2)' : isOverdue ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)';
                                                        const actions = e.currentTarget.querySelector('.task-actions') as HTMLElement;
                                                        if (actions) actions.style.opacity = '0';
                                                    }
                                                }}
                                            >
                                                <div
                                                    onClick={() => handleToggleTask(task)}
                                                    style={{
                                                        width: '26px', height: '26px',
                                                        borderRadius: '8px',
                                                        border: `2px solid ${isCompleted ? '#4ade80' : isOverdue ? '#f87171' : 'rgba(255,255,255,0.3)'}`,
                                                        background: isCompleted ? '#4ade80' : 'transparent',
                                                        marginRight: '16px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        flexShrink: 0, cursor: 'pointer',
                                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        boxShadow: isCompleted ? '0 4px 12px rgba(74, 222, 128, 0.3)' : 'none'
                                                    }}
                                                >
                                                    {isCompleted && <Check size={16} color="#0f172a" strokeWidth={3.5} />}
                                                </div>

                                                <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                                                    <h4 style={{
                                                        fontSize: isMobile ? '0.95rem' : '1.05rem',
                                                        fontWeight: '500',
                                                        marginBottom: '4px',
                                                        color: isCompleted ? '#4ade80' : 'white',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        textDecoration: isCompleted ? 'line-through' : 'none',
                                                        opacity: isCompleted ? 0.8 : 1
                                                    }}>
                                                        {task.title}
                                                    </h4>
                                                    <div className="flex items-center gap-sm">
                                                        <span style={{
                                                            fontSize: '0.8rem',
                                                            color: isCompleted ? 'rgba(74, 222, 128, 0.8)' : isOverdue ? '#fca5a5' : 'rgba(255,255,255,0.5)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            fontWeight: isOverdue ? '600' : '400'
                                                        }}>
                                                            {isOverdue && !isCompleted ? <AlertCircle size={14} /> : <Clock size={14} />}
                                                            {isOverdue && !isCompleted && <span style={{ color: '#f87171', fontWeight: '700' }}>OVERDUE:</span>}
                                                            {format(task.deadline, 'MMM d, h:mm a')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {!isMobile && (
                                                    <div className="task-actions" style={{
                                                        display: 'flex',
                                                        gap: '8px',
                                                        opacity: 0,
                                                        transition: 'opacity 0.2s',
                                                        marginRight: '16px'
                                                    }}>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}
                                                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: 'white', display: 'flex' }}
                                                            title="Edit Mission"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                                                            style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: '#f87171', display: 'flex' }}
                                                            title="Delete Mission"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}

                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600',
                                                    background: task.priority === 'High' ? 'rgba(255, 59, 48, 0.1)' : 'rgba(255, 149, 0, 0.1)',
                                                    color: task.priority === 'High' ? '#f87171' : '#fbbf24', border: task.priority === 'High' ? '1px solid rgba(255, 59, 48, 0.2)' : '1px solid rgba(255, 149, 0, 0.2)',
                                                    flexShrink: 0,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {task.priority === 'High' ? 'High' : 'Med'}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SIDE COLUMN */}
                    <div style={{ display: 'flex', flexDirection: width < 1200 && width > 768 ? 'row' : 'column', gap: isMobile ? '24px' : '32px' }}>

                        {/* Reminders */}
                        <div className="glass-clear" style={{ padding: isMobile ? '20px' : '24px', flex: 1, borderRadius: '24px' }}>
                            <div className="card-header" style={{ paddingBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ color: 'white', fontWeight: '500', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>Up Next</h3>
                                <button
                                    onClick={() => navigate('/dashboard/reminders')}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '6px 14px',
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                                >
                                    View All
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                                {upNextItems.length === 0 ? (
                                    <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>No events scheduled.</p>
                                    </div>
                                ) : (
                                    upNextItems.map(item => (
                                        <div key={item.id} style={{
                                            padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s', cursor: 'default'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                        >
                                            {item.type === 'task' ? (
                                                <div style={{ padding: '8px', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '10px' }}>
                                                    <CheckSquare size={16} color="#818cf8" strokeWidth={2.5} />
                                                </div>
                                            ) : (
                                                <div style={{ padding: '8px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '10px' }}>
                                                    <Bell size={16} color="#fbbf24" strokeWidth={2.5} />
                                                </div>
                                            )}
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <p style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: 0 }}>{format(item.time, 'h:mm a')} &bull; {isToday(item.time) ? 'Today' : format(item.time, 'MMM d')}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Automations */}
                        <div className="glass-clear" style={{ padding: isMobile ? '20px' : '24px', flex: 1, borderRadius: '24px' }}>
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ color: 'white', fontWeight: '500', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>Active Systems</h3>
                                <button
                                    onClick={() => navigate('/dashboard/automations')}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '6px 14px',
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                                >
                                    View All
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
                                {activeAutomationsList.length === 0 ? (
                                    <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>No systems active.</p>
                                    </div>
                                ) : (
                                    activeAutomationsList.map(auto => (
                                        <div key={auto.id} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '4px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: auto.enabled ? '#4ade80' : 'rgba(255,255,255,0.2)', boxShadow: auto.enabled ? '0 0 10px rgba(74, 222, 128, 0.4)' : 'none' }}></div>
                                                <span style={{ color: auto.enabled ? 'white' : 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{auto.name}</span>
                                            </div>
                                            <Zap size={14} color={auto.enabled ? "#4ade80" : "rgba(255,255,255,0.3)"} style={{ flexShrink: 0 }} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
