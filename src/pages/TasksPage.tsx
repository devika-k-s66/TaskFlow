import { useState, useEffect } from 'react';
import { Plus, Clock, MoreVertical, Filter, Grid, List, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { useTasks } from '../hooks/useFirestore';
import { format, isToday, isPast, isSameDay, isWithinInterval, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth } from 'date-fns';
import type { Task } from '../types';

export default function TasksPage() {
    const { tasks, loading, updateTask, deleteTask } = useTasks();
    const location = useLocation();
    const { onCreateTask } = useOutletContext<{ onCreateTask: () => void }>();
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedFilter, setSelectedFilter] = useState(location.state?.filter || 'all');
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
    const isTablet = width >= 768 && width < 1200;
    const isSmallPhone = width < 480;

    // Derived State for Filters
    const getFilteredTasks = () => {
        let filtered = tasks;
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 1. First apply the explicit status/type filter
        if (selectedFilter === 'active') filtered = tasks.filter(t => !t.completed);
        else if (selectedFilter === 'today') filtered = tasks.filter(t => isToday(t.deadline));
        else if (selectedFilter === 'week') filtered = tasks.filter(t => {
            const diff = Math.floor((t.deadline.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
            return diff >= 0 && diff <= 7;
        });
        else if (selectedFilter === 'month') filtered = tasks.filter(t => {
            const diff = Math.floor((t.deadline.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
            return diff >= 0 && diff <= 30;
        });
        else if (selectedFilter === 'completed') filtered = tasks.filter(t => t.completed);
        else if (selectedFilter === 'high') filtered = tasks.filter(t => t.priority === 'High');
        else if (selectedFilter === 'overdue') filtered = tasks.filter(t => !t.completed && isPast(t.deadline));

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

    const tags = Array.from(new Set(tasks.flatMap(t => t.tags)));

    const renderTaskCard = (task: Task) => (
        <div
            key={task.id}
            className="glass-clear"
            style={{
                padding: isSmallPhone ? '12px' : isMobile ? '16px' : '20px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                marginBottom: viewMode === 'list' ? '12px' : '0',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: viewMode === 'grid' ? '100%' : 'auto'
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
            <div style={{ display: 'flex', gap: isSmallPhone ? '8px' : '12px', alignItems: 'flex-start' }}>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        updateTask(task.id, { completed: !task.completed });
                    }}
                    style={{
                        width: isSmallPhone ? '20px' : '24px',
                        height: isSmallPhone ? '20px' : '24px',
                        borderRadius: '6px',
                        border: '2px solid rgba(255,255,255,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        background: task.completed ? 'rgba(255,255,255,0.5)' : 'transparent',
                        flexShrink: 0,
                        marginTop: '4px'
                    }}
                >
                    {task.completed && <div style={{ width: isSmallPhone ? '10px' : '14px', height: isSmallPhone ? '10px' : '14px', background: 'white', borderRadius: '2px' }} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <h4 style={{
                            fontSize: isSmallPhone ? '0.95rem' : '1.05rem',
                            fontWeight: '600',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'rgba(255,255,255,0.5)' : 'white',
                            margin: 0,
                            lineHeight: '1.3',
                            wordBreak: 'break-word'
                        }}>
                            {task.title}
                        </h4>
                        <span className="badge" style={{
                            background: task.priority === 'High' ? 'rgba(255, 59, 48, 0.2)' : task.priority === 'Medium' ? 'rgba(255, 149, 0, 0.2)' : 'rgba(52, 199, 89, 0.2)',
                            color: task.priority === 'High' ? '#f87171' : task.priority === 'Medium' ? '#fbbf24' : '#4ade80',
                            border: '1px solid rgba(255,255,255,0.1)',
                            fontSize: '0.65rem',
                            padding: '2px 8px',
                            flexShrink: 0,
                            height: 'max-content'
                        }}>
                            {task.priority}
                        </span>
                    </div>

                    {task.description && (
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255,255,255,0.6)',
                            margin: '8px 0',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: isMobile && viewMode === 'grid' ? 2 : 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {task.description}
                        </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                        <span className="flex items-center gap-xs" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                            <Clock size={12} />
                            {format(task.deadline, 'MMM d, h:mm a')}
                            {task.endTime && ` - ${format(task.endTime, 'h:mm a')}`}
                        </span>
                        {task.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="badge" style={{
                                background: 'rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.7)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                fontSize: '0.65rem',
                                padding: '1px 6px'
                            }}>
                                {tag}
                            </span>
                        ))}
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
                <button className="btn btn-sm btn-ghost" onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.6)',
                    width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, borderRadius: '8px', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.05)'
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f87171'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >
                    <Trash2 size={14} />
                </button>
                <button className="btn btn-sm btn-ghost" style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.6)',
                    width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <MoreVertical size={14} />
                </button>
            </div>
        </div>
    );

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

                                        // Overdue check for dots
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

                            {/* Filters List */}
                            <div className="glass-clear" style={{ padding: '24px', borderRadius: '24px' }}>
                                <h3 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '16px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Quick Filters
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {filters.map(filter => (
                                        <div
                                            key={filter.id}
                                            onClick={() => { setSelectedFilter(filter.id); setActiveRangeStart(null); setActiveRangeEnd(null); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '10px 14px', borderRadius: '12px', cursor: 'pointer',
                                                background: selectedFilter === filter.id && !activeRangeStart ? 'rgba(255,255,255,0.15)' : 'transparent',
                                                border: selectedFilter === filter.id && !activeRangeStart ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <span style={{ fontSize: '0.9rem', color: selectedFilter === filter.id && !activeRangeStart ? 'white' : 'rgba(255,255,255,0.7)' }}>{filter.label}</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>{filter.count}</span>
                                        </div>
                                    ))}
                                </div>
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
                                    fontSize: isMobile ? '2rem' : '3rem',
                                    fontWeight: '700',
                                    color: 'white',
                                    marginBottom: '8px',
                                    letterSpacing: '-1px',
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
                                            <button onClick={() => { setActiveRangeStart(null); setActiveRangeEnd(null); setSelectedFilter('all'); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}><Trash2 size={10} /></button>
                                        </span>
                                    ) : 'Coordinate operational objectives and execute tasks.'}
                                </p>
                            </div>

                            <button
                                onClick={onCreateTask}
                                className="btn-shine"
                                style={{
                                    padding: '14px 28px', borderRadius: '100px',
                                    background: 'white', color: 'black',
                                    border: 'none', fontSize: '1rem', fontWeight: '600',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                    boxShadow: '0 4px 24px rgba(255, 255, 255, 0.15)',
                                    transition: 'transform 0.2s',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <Plus size={20} strokeWidth={2.5} /> Create Mission
                            </button>
                        </div>

                        {/* Mobile Filters Horizontal Scroll */}
                        {(width <= 1200) && (
                            <div style={{ marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px', display: 'flex', gap: '8px' }}>
                                {filters.map(filter => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setSelectedFilter(filter.id)}
                                        style={{
                                            padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', whiteSpace: 'nowrap',
                                            background: selectedFilter === filter.id ? 'white' : 'rgba(255,255,255,0.05)',
                                            color: selectedFilter === filter.id ? 'black' : 'rgba(255,255,255,0.7)',
                                            border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', gap: '8px'
                                        }}
                                    >
                                        {filter.label} <span style={{ opacity: 0.6, fontSize: '0.8em' }}>{filter.count}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Task List Header + View Toggles */}
                        <div className="glass-clear" style={{
                            padding: isMobile ? '12px' : '16px 24px', marginBottom: '24px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            borderRadius: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '4px', height: '16px', background: '#4ade80', borderRadius: '2px' }} />
                                <h3 style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: '600', color: 'white', margin: 0 }}>
                                    {activeRangeStart ? 'Date Filtered' : selectedFilter === 'all' ? 'Active Missions' : selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} ({filteredTasks.length})
                                </h3>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {!isSmallPhone && (
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px' }}>
                                        <button onClick={() => setViewMode('list')} style={{ background: viewMode === 'list' ? 'rgba(255,255,255,0.15)' : 'transparent', color: viewMode === 'list' ? 'white' : 'rgba(255,255,255,0.4)', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}><List size={18} /></button>
                                        <button onClick={() => setViewMode('grid')} style={{ background: viewMode === 'grid' ? 'rgba(255,255,255,0.15)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'rgba(255,255,255,0.4)', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}><Grid size={18} /></button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Grid/List Content */}
                        <div style={{
                            display: viewMode === 'grid' ? 'grid' : 'flex',
                            flexDirection: 'column',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '16px'
                        }}>
                            {filteredTasks.length === 0 ? (
                                <div style={{ gridColumn: '1/-1', padding: '80px 0', textAlign: 'center', color: 'rgba(255,255,255,0.4)', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                                    <Filter size={32} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                    <p>No missions found matching current criteria.</p>
                                </div>
                            ) : (
                                filteredTasks.map(renderTaskCard)
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
