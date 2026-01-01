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

    // ... existing responsiveness logic ...
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

    // ... Generate grid logic ...
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
        setTimeRange(tempEnd ? 'custom' : 'today');
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
        if (timeRange === 'today') return isToday(t.deadline);
        return true;
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
        try {
            await updateTask(task.id, { completed: !task.completed });
        } catch (error) {
            console.error("Failed to toggle task:", error);
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
        navigate('/dashboard/tasks', { state: { editTask: task } });
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
                padding: isSmallPhone ? '24px 16px' : isMobile ? '32px 24px' : '48px 40px',
                width: '100%',
                boxSizing: 'border-box'
            }}>

                {/* 1. HERO GREETING */}
                <div className="page-title" style={{
                    marginBottom: isMobile ? '32px' : '56px',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: '24px'
                }}>
                    <div>
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
                            {format(new Date(), 'EEEE, MMMM do')}. Here's a breakdown of your digital productivity.
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMobile ? 'flex-start' : 'flex-end',
                        gap: '12px',
                        width: isMobile ? '100%' : 'auto'
                    }}>
                        {/* Ultra-Compact Premium Mini Calendar */}
                        <div className="glass-clear" style={{
                            padding: '12px',
                            borderRadius: '16px',
                            background: 'rgba(15, 23, 42, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                            width: isMobile ? '100%' : '280px',
                            backdropFilter: 'blur(16px)'
                        }}>
                            {/* Calendar Header - Slim */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                                <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}><ChevronLeft size={16} /></button>
                                <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', margin: 0, letterSpacing: '0.3px' }}>{format(viewDate, 'MMMM yyyy')}</h3>
                                <button onClick={handleNextMonth} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}><ChevronRight size={16} /></button>
                            </div>

                            {/* Weekday Labels - Muted */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' }}>
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                    <span key={i} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', fontWeight: '700', textAlign: 'center' }}>{day}</span>
                                ))}
                            </div>

                            {/* Date Grid - Refined circular highlights */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '12px' }}>
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
                                                color: (isStart || isEnd) ? '#1e293b' : isInRange ? 'white' : isCurrentMonth ? 'white' : 'rgba(255,255,255,0.1)',
                                                background: (isStart || isEnd) ? 'white' : isInRange ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                            }}
                                        >
                                            <span style={{ position: 'relative', zIndex: 1, marginBottom: dotCount > 0 ? '2px' : '0' }}>{format(day, 'd')}</span>

                                            {/* Task Indicators */}
                                            {dotCount > 0 && !isStart && !isEnd && (
                                                <div style={{ display: 'flex', gap: '2px', position: 'absolute', bottom: '4px' }}>
                                                    {[...Array(dotCount)].map((_, idx) => (
                                                        <div
                                                            key={idx}
                                                            style={{
                                                                width: '3px',
                                                                height: '3px',
                                                                background: '#818cf8',
                                                                borderRadius: '50%',
                                                                opacity: isInRange ? 1 : 0.6
                                                            }}
                                                        />
                                                    ))}
                                                </div>
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
                                    padding: '8px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: 'white',
                                    color: '#1e293b',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.2s',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. STATS GRID */}
                <div className="grid" style={{
                    display: 'grid',
                    gridTemplateColumns: isSmallPhone ? '1fr' : isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: isSmallPhone ? '16px' : isMobile ? '20px' : '24px',
                    marginBottom: isMobile ? '32px' : '48px'
                }}>
                    {/* Stats Item 1 - Tasks Pending */}
                    <div
                        className="glass-clear"
                        onClick={() => navigate('/dashboard/tasks', { state: { filter: 'active' } })}
                        style={{
                            padding: '24px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
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
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '8px' }}>
                                {timeRange === 'today' ? "Today's" : "Scheduled"} Tasks
                            </p>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.tasksProgress}%`, height: '100%', background: 'white', borderRadius: '99px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Item 2 - Active Automations */}
                    <div
                        className="glass-clear"
                        onClick={() => navigate('/dashboard/automations')}
                        style={{
                            padding: '24px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.background = 'rgba(52, 199, 89, 0.15)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
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
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '8px' }}>Active Automations</p>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.automationsProgress}%`, height: '100%', background: '#4ade80', borderRadius: '99px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Item 3 - Reminders */}
                    <div
                        className="glass-clear"
                        onClick={() => navigate('/dashboard/reminders')}
                        style={{
                            padding: '24px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.background = 'rgba(255, 149, 0, 0.15)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
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
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '8px' }}>Reminders</p>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.remindersProgress}%`, height: '100%', background: '#fbbf24', borderRadius: '99px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Item 4 - Overdue */}
                    <div
                        className="glass-clear"
                        onClick={() => navigate('/dashboard/tasks', { state: { filter: 'overdue' } })}
                        style={{
                            padding: '24px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.background = 'rgba(255, 59, 48, 0.15)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
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
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '8px' }}>
                                {timeRange === 'today' ? "Overdue Today" : "Total Overdue"}
                            </p>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.overdueProgress}%`, height: '100%', background: '#f87171', borderRadius: '99px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
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
                                <h3 style={{ color: 'white', fontWeight: '500', fontSize: isMobile ? '1.1rem' : '1.4rem' }}>
                                    {timeRange === 'today' ? "Today's" : "Priority"} Missions
                                </h3>

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
                                    onClick={() => navigate('/dashboard/tasks', { state: { filter: timeRange } })}
                                >View All</button>
                            </div>

                            <div style={{ marginTop: '16px' }}>
                                {filteredMissions.length === 0 ? (
                                    <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                        No missions found for this period.
                                    </div>
                                ) : (
                                    filteredMissions.map(task => (
                                        <div key={task.id} style={{
                                            display: 'flex', alignItems: 'center', padding: '16px 12px',
                                            borderRadius: '12px',
                                            marginBottom: '8px',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            background: task.completed ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
                                            border: task.completed ? '1px solid rgba(74, 222, 128, 0.2)' : '1px solid transparent',
                                            position: 'relative'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = task.completed ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255,255,255,0.15)';
                                                e.currentTarget.style.transform = 'scale(1.01) translateX(4px)';
                                                e.currentTarget.style.borderColor = task.completed ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255,255,255,0.2)';
                                                const actions = e.currentTarget.querySelector('.task-actions') as HTMLElement;
                                                if (actions) actions.style.opacity = '1';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = task.completed ? 'rgba(74, 222, 128, 0.1)' : 'transparent';
                                                e.currentTarget.style.transform = 'scale(1) translateX(0)';
                                                e.currentTarget.style.borderColor = task.completed ? 'rgba(74, 222, 128, 0.2)' : 'transparent';
                                                const actions = e.currentTarget.querySelector('.task-actions') as HTMLElement;
                                                if (actions) actions.style.opacity = '0';
                                            }}
                                        >
                                            <div
                                                onClick={() => handleToggleTask(task)}
                                                style={{
                                                    width: '24px', height: '24px',
                                                    borderRadius: '8px',
                                                    border: `2px solid ${task.completed ? '#4ade80' : 'rgba(255,255,255,0.5)'}`,
                                                    background: task.completed ? '#4ade80' : 'transparent',
                                                    marginRight: '16px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0, cursor: 'pointer',
                                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    boxShadow: task.completed ? '0 4px 12px rgba(74, 222, 128, 0.3)' : 'none'
                                                }}
                                            >
                                                {task.completed && <Check size={14} color="#1e293b" strokeWidth={3} />}
                                            </div>

                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h4 style={{
                                                    fontSize: '1rem',
                                                    fontWeight: '500',
                                                    marginBottom: '4px',
                                                    color: task.completed ? '#4ade80' : 'white',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {task.title}
                                                </h4>
                                                <div className="flex items-center gap-sm">
                                                    <span style={{
                                                        fontSize: '0.8rem',
                                                        color: task.completed ? 'rgba(74, 222, 128, 0.8)' : 'rgba(255,255,255,0.6)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <Clock size={12} /> {format(task.deadline, 'MMM d, h:mm a')}
                                                        {task.endTime && ` - ${format(task.endTime, 'h:mm a')}`}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="task-actions" style={{
                                                display: 'flex',
                                                gap: '8px',
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                                marginRight: '12px'
                                            }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}
                                                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: 'white' }}
                                                    title="Edit Mission"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                                                    style={{ background: 'rgba(239, 68, 68, 0.2)', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#f87171' }}
                                                    title="Delete Mission"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <span style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                                                background: task.priority === 'High' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 149, 0, 0.2)',
                                                color: task.priority === 'High' ? '#f87171' : '#fbbf24', border: '1px solid rgba(255,255,255,0.1)',
                                                flexShrink: 0
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
                            <div className="card-header" style={{ paddingBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ color: 'white', fontWeight: '500', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>Up Next</h3>
                                <button
                                    onClick={() => navigate('/dashboard/reminders')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(255,255,255,0.6)',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                                >
                                    View All
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                                {upNextItems.length === 0 ? (
                                    <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '10px' }}>No events scheduled.</p>
                                ) : (
                                    upNextItems.map(item => (
                                        <div key={item.id} style={{
                                            padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex', alignItems: 'center', gap: '15px'
                                        }}>
                                            {item.type === 'task' ? (
                                                <CheckSquare size={18} color="white" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                                            ) : (
                                                <Bell size={18} color="#fbbf24" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                                            )}
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: 0 }}>{format(item.time, 'MMM d, h:mm a')}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Automations */}
                        <div className="glass-clear" style={{ padding: '24px', flex: 1 }}>
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ color: 'white', fontWeight: '500', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>Active Systems</h3>
                                <button
                                    onClick={() => navigate('/dashboard/automations')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(255,255,255,0.6)',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                                >
                                    View All
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                                {activeAutomationsList.length === 0 ? (
                                    <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '10px' }}>No systems created.</p>
                                ) : (
                                    activeAutomationsList.map(auto => (
                                        <div key={auto.id} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '12px 6px', borderBottom: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                                <Zap size={16} color={auto.enabled ? "#4ade80" : "rgba(255,255,255,0.3)"} style={{ flexShrink: 0 }} />
                                                <span style={{ color: auto.enabled ? 'white' : 'rgba(255,255,255,0.5)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{auto.name}</span>
                                            </div>
                                            <div style={{
                                                width: '6px', height: '6px', borderRadius: '50%',
                                                background: auto.enabled ? '#4ade80' : 'rgba(255,255,255,0.2)',
                                                boxShadow: auto.enabled ? '0 0 8px #4ade80' : 'none',
                                                flexShrink: 0
                                            }}></div>
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
