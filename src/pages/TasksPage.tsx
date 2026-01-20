import { useState, useEffect } from 'react';
import { Plus, Clock, MoreVertical, Filter, Trash2, ChevronLeft, ChevronRight, Check, Edit3 } from 'lucide-react';
import { useLocation, useOutletContext, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useFirestore';
import { format, isToday, isPast, isSameDay, isWithinInterval, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth } from 'date-fns';
import type { Task } from '../types';

export default function TasksPage() {
    const { tasks, updateTask, deleteTask } = useTasks();
    const location = useLocation();
    const navigate = useNavigate();
    const { onCreateTask, searchQuery } = useOutletContext<{ onCreateTask: () => void, searchQuery: string }>();
    const [selectedFilter, setSelectedFilter] = useState(location.state?.filter || 'all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [optimisticTasks, setOptimisticTasks] = useState<Record<string, boolean>>({});
    const [width, setWidth] = useState(window.innerWidth);

    // Calendar State
    const [viewDate, setViewDate] = useState(new Date());
    const [tempStart, setTempStart] = useState<Date>(location.state?.rangeStart ? new Date(location.state.rangeStart) : startOfDay(new Date()));
    const [tempEnd, setTempEnd] = useState<Date | null>(location.state?.rangeEnd ? new Date(location.state.rangeEnd) : null);

    // Active Filter State
    const [activeRangeStart, setActiveRangeStart] = useState<Date | null>(location.state?.rangeStart ? new Date(location.state.rangeStart) : null);
    const [activeRangeEnd, setActiveRangeEnd] = useState<Date | null>(location.state?.rangeEnd ? new Date(location.state.rangeEnd) : null);

    // Calendar Handlers
    const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
    const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

    const handleTempDateClick = (day: Date) => {
        if (!tempStart || (tempStart && tempEnd)) {
            setTempStart(day);
            setTempEnd(null);
        } else {
            if (day < tempStart) {
                setTempEnd(tempStart);
                setTempStart(day);
            } else if (day > tempStart) {
                setTempEnd(day);
            } else {
                setTempStart(day);
                setTempEnd(null);
            }
        }
    };

    const applySelection = () => {
        setActiveRangeStart(tempStart);
        setActiveRangeEnd(tempEnd);
        setSelectedFilter('custom');
    };

    const calendarGrid = eachDayOfInterval({
        start: startOfWeek(startOfMonth(viewDate)),
        end: endOfWeek(endOfMonth(viewDate))
    });

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width < 768;
    const isSmallPhone = width < 480;
    const isTinyMobile = width < 340;

    // Derived State for Filters
    const getFilteredTasks = () => {
        let filtered = tasks;
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 0. Search Filter
        // 0. Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const queryNoSpaces = query.replace(/\s+/g, '');

            filtered = filtered.filter(t => {
                const title = t.title.toLowerCase();
                const titleNoSpaces = title.replace(/\s+/g, '');
                const desc = t.description?.toLowerCase() || '';
                const descNoSpaces = desc.replace(/\s+/g, '');

                return title.includes(query) ||
                    titleNoSpaces.includes(queryNoSpaces) ||
                    desc.includes(query) ||
                    descNoSpaces.includes(queryNoSpaces);
            });
        }

        // 1. First apply the explicit status/type filter
        if (selectedFilter === 'active') filtered = filtered.filter(t => !t.completed);
        else if (selectedFilter === 'today') filtered = filtered.filter(t => isToday(t.deadline));
        else if (selectedFilter === 'week') filtered = filtered.filter(t => {
            const diff = Math.floor((t.deadline.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
            return diff >= 0 && diff <= 7;
        });
        else if (selectedFilter === 'month') filtered = filtered.filter(t => {
            const diff = Math.floor((t.deadline.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
            return diff >= 0 && diff <= 30;
        });
        else if (selectedFilter === 'completed') filtered = filtered.filter(t => t.completed);
        else if (selectedFilter === 'high') filtered = filtered.filter(t => t.priority === 'High');
        else if (selectedFilter === 'overdue') filtered = filtered.filter(t => !t.completed && isPast(t.deadline));

        // 2. Then by date range
        if (activeRangeStart) {
            filtered = filtered.filter(t => {
                const d = t.deadline;
                if (!activeRangeEnd) {
                    return isSameDay(d, activeRangeStart);
                } else {
                    return isWithinInterval(d, { start: startOfDay(activeRangeStart), end: endOfDay(activeRangeEnd) });
                }
            });
        }

        return filtered;
    };

    const filteredTasks = getFilteredTasks();

    const filters = [
        { id: 'all', label: 'All Tasks', count: tasks.length },
        { id: 'active', label: 'Pending', count: tasks.filter(t => !t.completed).length },
        { id: 'today', label: 'Today', count: tasks.filter(t => isToday(t.deadline)).length },
        {
            id: 'week', label: 'Week', count: tasks.filter(t => {
                const diff = Math.floor((t.deadline.getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));
                return diff >= 0 && diff <= 7;
            }).length
        },
        {
            id: 'month', label: 'Month', count: tasks.filter(t => {
                const diff = Math.floor((t.deadline.getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));
                return diff >= 0 && diff <= 30;
            }).length
        },
        { id: 'overdue', label: 'Overdue', count: tasks.filter(t => !t.completed && isPast(t.deadline)).length },
        { id: 'completed', label: 'Completed', count: tasks.filter(t => t.completed).length },
        { id: 'high', label: 'High Priority', count: tasks.filter(t => t.priority === 'High').length },
    ];

    const renderTaskCard = (task: Task) => {
        const isCompleted = optimisticTasks[task.id] !== undefined ? optimisticTasks[task.id] : task.completed;
        const isOverdue = !isCompleted && isPast(task.deadline);

        return (
            <div
                key={task.id}
                className="glass-clear"
                style={{
                    padding: 'clamp(8px, 3vw, 20px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    // Premium Gradient Backgrounds
                    background: isCompleted
                        ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.08) 0%, rgba(74, 222, 128, 0.01) 100%)'
                        : isOverdue
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.01) 100%)'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.005) 100%)',
                    // Crisper Borders
                    border: isCompleted
                        ? '1px solid rgba(74, 222, 128, 0.2)'
                        : isOverdue
                            ? '1px solid rgba(239, 68, 68, 0.2)'
                            : '1px solid rgba(255,255,255,0.08)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    borderRadius: '16px',
                    // Depth Shadow
                    boxShadow: isOverdue
                        ? '0 8px 32px rgba(239, 68, 68, 0.1)'
                        : '0 4px 20px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                    if (!isMobile) {
                        e.currentTarget.style.transform = 'scale(1.01) translateY(-2px)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isMobile) {
                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)';
                    }
                }}
            >
                <div style={{ display: 'flex', gap: 'clamp(6px, 2vw, 12px)', alignItems: 'flex-start' }}>
                    <div
                        onClick={async (e) => {
                            e.stopPropagation();
                            const newStatus = !isCompleted;
                            setOptimisticTasks(prev => ({ ...prev, [task.id]: newStatus }));
                            try {
                                await updateTask(task.id, { completed: newStatus });
                            } catch (err) {
                                setOptimisticTasks(prev => {
                                    const next = { ...prev };
                                    delete next[task.id];
                                    return next;
                                });
                            }
                        }}
                        style={{
                            width: isSmallPhone ? '16px' : '24px',
                            height: isSmallPhone ? '16px' : '24px',
                            borderRadius: '50%',
                            border: `2px solid ${isCompleted ? '#4ade80' : 'rgba(255,255,255,0.5)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            background: isCompleted ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
                            flexShrink: 0,
                            marginTop: '4px',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isCompleted && <Check size={isSmallPhone ? 10 : 16} color="#4ade80" strokeWidth={3} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: isSmallPhone ? 'column' : 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: isSmallPhone ? '4px' : 'clamp(2px, 2vw, 8px)',
                            marginBottom: '0'
                        }}>
                            <h4 style={{
                                fontSize: 'clamp(0.75rem, 2.5vw, 1.05rem)',
                                fontWeight: '600',
                                color: isCompleted ? '#4ade80' : 'white',
                                margin: 0,
                                lineHeight: '1.2',
                                width: '100%',
                                wordBreak: 'break-word',
                                hyphens: 'auto'
                            }}>
                                {task.title}
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexDirection: isSmallPhone ? 'row' : 'column',
                                alignItems: isSmallPhone ? 'center' : 'flex-end',
                                gap: '4px',
                                flexShrink: 0,
                                marginBottom: '0',
                                marginTop: isSmallPhone ? '4px' : '0'
                            }}>
                                <span className="badge" style={{
                                    background: task.priority === 'High' ? 'rgba(255, 59, 48, 0.2)' : task.priority === 'Medium' ? 'rgba(255, 149, 0, 0.2)' : 'rgba(52, 199, 89, 0.2)',
                                    color: task.priority === 'High' ? '#f87171' : task.priority === 'Medium' ? '#fbbf24' : '#4ade80',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    fontSize: 'clamp(0.5rem, 1.5vw, 0.7rem)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    flexShrink: 0,
                                    height: 'max-content',
                                    lineHeight: 1
                                }}>
                                    {task.priority}
                                </span>
                                {isOverdue && (
                                    <span style={{ color: '#ef4444', fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase' }}>Overdue</span>
                                )}
                            </div>
                        </div>

                        {task.description && (
                            <p style={{
                                fontSize: 'clamp(0.8rem, 2vw, 0.85rem)',
                                color: 'rgba(255,255,255,0.6)',
                                margin: '8px 0',
                                lineHeight: '1.4',
                                display: '-webkit-box',
                                WebkitLineClamp: isMobile ? 2 : 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {task.description}
                            </p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                            <span className="flex items-center gap-xs" style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', color: isOverdue ? '#ef4444' : 'rgba(255,255,255,0.5)' }}>
                                <Clock size={12} />
                                {format(task.deadline, 'MMM d, h:mm a')}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <button
                        className="btn btn-sm btn-ghost"
                        onClick={(e) => { e.stopPropagation(); navigate('/dashboard/calendar', { state: { editTask: task } }); }}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.6)',
                            width: '32px', height: '32px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: 0, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    >
                        <Edit3 size={14} />
                    </button>

                    <button
                        className="btn btn-sm btn-ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Delete this mission?')) deleteTask(task.id);
                        }}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.6)',
                            width: '32px', height: '32px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: 0, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    >
                        <Trash2 size={14} />
                    </button>

                    <div style={{ position: 'relative' }}>
                        <button
                            className="btn btn-sm btn-ghost"
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === task.id ? null : task.id); }}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                color: 'rgba(255,255,255,0.6)',
                                width: '32px', height: '32px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: 0, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                        >
                            <MoreVertical size={14} />
                        </button>

                        {activeMenu === task.id && (
                            <>
                                <div
                                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
                                    onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    right: 0,
                                    marginBottom: '8px',
                                    background: 'rgba(15, 23, 42, 0.95)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    padding: '6px',
                                    width: '140px',
                                    zIndex: 100,
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            const newStatus = !isCompleted;
                                            setOptimisticTasks(prev => ({ ...prev, [task.id]: newStatus }));
                                            setActiveMenu(null);
                                            try {
                                                await updateTask(task.id, { completed: newStatus });
                                            } catch (err) {
                                                setOptimisticTasks(prev => {
                                                    const next = { ...prev };
                                                    delete next[task.id];
                                                    return next;
                                                });
                                            }
                                        }}
                                        style={{ width: '100%', padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', color: 'white', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '8px' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                    >
                                        {isCompleted ? 'Mark Pending' : 'Mark Complete'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
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
                <div style={{ display: 'grid', gridTemplateColumns: width > 1200 ? '280px 1fr' : '1fr', gap: '32px', alignItems: 'start' }}>

                    {/* SIDEBAR */}
                    {(width > 1200) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'sticky', top: '40px' }}>
                            {/* Calendar */}
                            <div className="glass-clear" style={{
                                padding: '16px',
                                borderRadius: '24px',
                                background: 'rgba(15, 23, 42, 0.4)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                                backdropFilter: 'blur(16px)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
                                    <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', borderRadius: '50%', transition: 'background 0.2s' }}><ChevronLeft size={16} /></button>
                                    <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600', margin: 0, letterSpacing: '0.5px' }}>{format(viewDate, 'MMMM yyyy')}</h3>
                                    <button onClick={handleNextMonth} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', borderRadius: '50%', transition: 'background 0.2s' }}><ChevronRight size={16} /></button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '12px' }}>
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                        <span key={i} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: '700', textAlign: 'center' }}>{day}</span>
                                    ))}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '16px' }}>
                                    {calendarGrid.map((day, i) => {
                                        const isCurrentMonth = isSameMonth(day, viewDate);
                                        const isStart = tempStart && isSameDay(day, tempStart);
                                        const isEnd = tempEnd && isSameDay(day, tempEnd);
                                        const isInRange = tempStart && tempEnd && isWithinInterval(day, {
                                            start: tempStart < tempEnd ? tempStart : tempEnd,
                                            end: tempStart < tempEnd ? tempEnd : tempStart
                                        });
                                        const dayTasks = tasks.filter(t => isSameDay(t.deadline, day));
                                        const hasTasks = dayTasks.length > 0;
                                        const hasOverdue = dayTasks.some(t => !t.completed && isPast(t.deadline));

                                        return (
                                            <div
                                                key={i}
                                                onClick={() => handleTempDateClick(day)}
                                                style={{
                                                    aspectRatio: '1',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', borderRadius: '50%', fontSize: '0.75rem',
                                                    fontWeight: (isStart || isEnd) ? '700' : '500',
                                                    color: (isStart || isEnd) ? '#1e293b' : isInRange ? 'white' : isCurrentMonth ? 'white' : 'rgba(255,255,255,0.2)',
                                                    background: (isStart || isEnd) ? 'white' : isInRange ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                    transition: 'all 0.2s', position: 'relative',
                                                }}
                                            >
                                                <span style={{ position: 'relative', zIndex: 1 }}>{format(day, 'd')}</span>
                                                {hasTasks && !isStart && !isEnd && (
                                                    <div style={{
                                                        width: '4px', height: '4px', borderRadius: '50%',
                                                        background: hasOverdue ? '#f87171' : '#818cf8',
                                                        position: 'absolute', bottom: '6px',
                                                        opacity: isInRange ? 1 : 0.7
                                                    }} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <button onClick={applySelection} style={{
                                    width: '100%', padding: '10px', borderRadius: '12px', border: 'none',
                                    background: 'white', color: '#1e293b', fontSize: '0.8rem', fontWeight: '700',
                                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.5px'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    Apply Filter
                                </button>
                            </div>


                        </div>
                    )}

                    {/* MAIN CONTENT */}
                    <div style={{ width: '100%', minWidth: 0 }}>
                        {/* Header */}
                        <div style={{
                            display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
                            marginBottom: '32px', gap: '24px'
                        }}>
                            <div>
                                <h1 style={{
                                    fontSize: isMobile ? '2.5rem' : '3.5rem',
                                    fontWeight: '800',
                                    color: 'white',
                                    marginBottom: '8px',
                                    letterSpacing: '-1.5px',
                                    lineHeight: 1
                                }}>
                                    Mission Board
                                </h1>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '600px' }}>
                                    {activeRangeStart ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Filtering: <span style={{ color: 'white', fontWeight: '600' }}>
                                                {format(activeRangeStart, 'MMM do')} {activeRangeEnd ? `- ${format(activeRangeEnd, 'MMM do')}` : ''}
                                            </span>
                                            <button onClick={() => { setActiveRangeStart(null); setActiveRangeEnd(null); setSelectedFilter('all'); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}><Trash2 size={12} /></button>
                                        </span>
                                    ) : 'Coordinate operational objectives and execute tasks.'}
                                </p>
                            </div>

                            <button
                                onClick={onCreateTask}
                                className="btn-shine"
                                style={{
                                    padding: '16px 32px', borderRadius: '100px',
                                    background: 'white', color: 'black',
                                    border: 'none', fontSize: '1.05rem', fontWeight: '700',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                                    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
                                    transition: 'transform 0.2s',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <Plus size={20} strokeWidth={3} /> Create Mission
                            </button>
                        </div>

                        <div className="glass-clear" style={{
                            padding: isMobile ? '12px' : '18px 26px', marginBottom: '28px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            borderRadius: '20px', position: 'relative', zIndex: 50,
                            overflow: 'visible'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '4px', height: '20px', background: '#4ade80', borderRadius: '2px' }} />
                                <h3 style={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: '700', color: 'white', margin: 0 }}>
                                    {activeRangeStart ? 'Date Filtered' : selectedFilter === 'all' ? 'Active Missions' : selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} ({filteredTasks.length})
                                </h3>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                        style={{
                                            background: 'rgba(255,255,255,0.06)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '100px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.95rem',
                                            fontWeight: '700',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Filter size={18} />
                                        <span>Filter</span>
                                    </button>

                                    {showFilterDropdown && (
                                        <>
                                            <div
                                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
                                                onClick={() => setShowFilterDropdown(false)}
                                            />
                                            <div
                                                className="dropdown-glass"
                                                style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    right: 0,
                                                    marginTop: '10px',
                                                    borderRadius: '20px',
                                                    padding: '10px',
                                                    width: '220px',
                                                    zIndex: 100,
                                                    animation: 'fadeIn 0.2s ease-out'
                                                }}>
                                                {filters.map(filter => (
                                                    <div
                                                        key={filter.id}
                                                        onClick={() => {
                                                            setSelectedFilter(filter.id);
                                                            setActiveRangeStart(null);
                                                            setActiveRangeEnd(null);
                                                            setShowFilterDropdown(false);
                                                        }}
                                                        style={{
                                                            padding: '12px 16px',
                                                            borderRadius: '12px',
                                                            cursor: 'pointer',
                                                            background: selectedFilter === filter.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                            color: selectedFilter === filter.id ? 'white' : 'rgba(255,255,255,0.9)',
                                                            fontSize: '0.9rem',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            transition: 'all 0.2s',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        <span>{filter.label}</span>
                                                        <span style={{ fontSize: '0.8rem', opacity: 0.5, background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '6px' }}>{filter.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: width < 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: isTinyMobile ? '8px' : isSmallPhone ? '12px' : '20px'
                        }}>
                            {filteredTasks.length === 0 ? (
                                <div style={{ gridColumn: '1/-1', padding: '100px 0', textAlign: 'center', color: 'rgba(255,255,255,0.3)', border: '2px dashed rgba(255,255,255,0.06)', borderRadius: '28px' }}>
                                    <Filter size={40} style={{ marginBottom: '20px', opacity: 0.3 }} />
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', margin: 0 }}>No missions detected</h3>
                                    <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Adjust your filters to scan more sectors.</p>
                                </div>
                            ) : (
                                filteredTasks.map(renderTaskCard)
                            )}
                        </div>
                    </div>
                </div>
                <style>{`
                .dropdown-glass {
                    background: #11120D;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
                    overflow: hidden;
                }
            `}</style>
            </div>
        </div>
    );
}
