import { useState, useEffect } from 'react';
import { Plus, Clock, MoreVertical, Filter, Grid, List, Trash2 } from 'lucide-react';
import CreateTaskModal from '../components/CreateTaskModal';
import { useLocation } from 'react-router-dom';
import { useTasks } from '../hooks/useFirestore';
import { format, isToday, isPast } from 'date-fns';
import type { Task } from '../types';

export default function TasksPage() {
    const { tasks, loading, updateTask, deleteTask } = useTasks();
    const location = useLocation();
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedFilter, setSelectedFilter] = useState(location.state?.filter || 'all');
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1200;
    const isSmallPhone = width < 480;

    // Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);


    // Derived State for Filters
    const getFilteredTasks = () => {
        let filtered = tasks;
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const getDiffDays = (date: Date) => Math.floor((date.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));

        if (selectedFilter === 'active') filtered = tasks.filter(t => !t.completed);
        else if (selectedFilter === 'today') filtered = tasks.filter(t => isToday(t.deadline));
        else if (selectedFilter === 'week') filtered = tasks.filter(t => {
            const diff = getDiffDays(t.deadline);
            return diff >= 0 && diff <= 7;
        });
        else if (selectedFilter === '2weeks') filtered = tasks.filter(t => {
            const diff = getDiffDays(t.deadline);
            return diff >= 0 && diff <= 14;
        });
        else if (selectedFilter === '3weeks') filtered = tasks.filter(t => {
            const diff = getDiffDays(t.deadline);
            return diff >= 0 && diff <= 21;
        });
        else if (selectedFilter === 'month') filtered = tasks.filter(t => {
            const diff = getDiffDays(t.deadline);
            return diff >= 0 && diff <= 30;
        });
        else if (selectedFilter === 'completed') filtered = tasks.filter(t => t.completed);
        else if (selectedFilter === 'high') filtered = tasks.filter(t => t.priority === 'High');
        else if (selectedFilter === 'overdue') filtered = tasks.filter(t => !t.completed && isPast(t.deadline));

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
                {/* Header Section */}
                <div style={{
                    display: 'flex',
                    flexDirection: isSmallPhone ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isSmallPhone ? 'flex-start' : 'center',
                    gap: isSmallPhone ? '20px' : '32px',
                    marginBottom: isMobile ? '32px' : '48px'
                }}>
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            fontSize: isSmallPhone ? '1.75rem' : isMobile ? '2.25rem' : isTablet ? '2.75rem' : '3.5rem',
                            fontWeight: '300',
                            letterSpacing: isMobile ? '-1px' : '-2px',
                            color: 'white',
                            lineHeight: '1.1',
                            marginBottom: '8px'
                        }}>
                            Mission <span style={{ fontWeight: '600' }}>Board</span>
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                            maxWidth: '400px'
                        }}>
                            Coordinate your objectives and maintain operational efficiency.
                        </p>
                    </div>
                    <button className="btn btn-lg" onClick={() => setShowCreateModal(true)} style={{
                        background: 'white',
                        color: '#667eea',
                        fontWeight: '600',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        width: isSmallPhone ? '100%' : 'auto',
                        justifyContent: 'center',
                        padding: isMobile ? '12px 20px' : '14px 28px',
                        borderRadius: '14px'
                    }}>
                        <Plus size={isMobile ? 18 : 20} />
                        New Mission
                    </button>
                </div>

                <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

                {/* Main Content Area */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: width < 1200 ? '1fr' : '300px 1fr',
                    gap: isMobile ? '24px' : '32px',
                    alignItems: 'start'
                }}>
                    {/* Filters Sidebar */}
                    <div className="glass-clear" style={{
                        padding: isMobile ? '16px' : '24px',
                        position: width < 1200 ? 'static' : 'sticky',
                        top: '100px',
                        borderRadius: '24px'
                    }}>
                        <div style={{ marginBottom: isMobile ? '0' : '24px' }}>
                            <h3 style={{
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                marginBottom: isMobile ? '12px' : '16px',
                                color: 'rgba(255,255,255,0.6)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Operations
                            </h3>
                            <div style={{
                                display: 'flex',
                                flexDirection: width < 1200 ? 'row' : 'column',
                                gap: '8px',
                                overflowX: width < 1200 ? 'auto' : 'visible',
                                paddingBottom: width < 1200 ? '8px' : '0',
                                scrollbarWidth: 'none'
                            }}>
                                {filters.map(filter => (
                                    <div
                                        key={filter.id}
                                        onClick={() => setSelectedFilter(filter.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '12px 14px',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            background: selectedFilter === filter.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                                            border: selectedFilter === filter.id ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                                            transition: 'all 0.2s',
                                            minWidth: width < 1200 ? 'max-content' : 'auto',
                                            gap: '12px'
                                        }}
                                    >
                                        <span style={{
                                            fontSize: '0.9rem',
                                            fontWeight: selectedFilter === filter.id ? '600' : '400',
                                            color: 'white'
                                        }}>
                                            {filter.label}
                                        </span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: 'white',
                                            fontWeight: '700',
                                            background: 'rgba(255,255,255,0.1)',
                                            padding: '2px 8px',
                                            borderRadius: '99px'
                                        }}>
                                            {filter.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {!isMobile && (
                            <>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />

                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        marginBottom: '16px',
                                        color: 'rgba(255,255,255,0.6)',
                                        textTransform: 'uppercase'
                                    }}>Classification</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {['High', 'Medium', 'Low'].map(priority => (
                                            <div key={priority} style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', padding: '6px 4px'
                                            }}>
                                                <div style={{
                                                    width: '8px', height: '8px', borderRadius: '50%',
                                                    background: priority === 'High' ? '#f87171' : priority === 'Medium' ? '#fbbf24' : '#4ade80'
                                                }} />
                                                <span>{priority} Priority</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />

                                <div>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '16px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Tags</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {tags.length > 0 ? tags.map(tag => (
                                            <span key={tag} style={{
                                                fontSize: '0.75rem',
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                color: 'rgba(255,255,255,0.7)',
                                                textTransform: 'capitalize',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                                    e.currentTarget.style.color = 'white';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                                }}
                                            >
                                                #{tag}
                                            </span>
                                        )) : (
                                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>No tags defined</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Tasks List */}
                    <div style={{ width: '100%', minWidth: 0 }}>
                        <div className="glass-clear" style={{
                            padding: isMobile ? '12px' : '16px 20px',
                            marginBottom: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderRadius: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '4px', height: '16px', background: '#667eea', borderRadius: '2px' }} />
                                <h3 style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: '600', color: 'white' }}>
                                    {selectedFilter === 'all' ? 'Active Objectives' : selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
                                </h3>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {!isSmallPhone && (
                                    <div className="flex items-center gap-xs" style={{ background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            style={{
                                                background: viewMode === 'list' ? 'rgba(255,255,255,0.15)' : 'transparent',
                                                color: 'white', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex'
                                            }}
                                        >
                                            <List size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            style={{
                                                background: viewMode === 'grid' ? 'rgba(255,255,255,0.15)' : 'transparent',
                                                color: 'white', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex'
                                            }}
                                        >
                                            <Grid size={18} />
                                        </button>
                                    </div>
                                )}
                                <button style={{
                                    background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                    <Filter size={14} />
                                    {isMobile ? '' : 'Filter'}
                                </button>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: viewMode === 'grid' && !isMobile
                                ? 'repeat(auto-fill, minmax(280px, 1fr))'
                                : '1fr',
                            gap: '16px'
                        }}>
                            {loading ? (
                                <div style={{ color: 'white', textAlign: 'center', padding: '60px 0', opacity: 0.7 }}>
                                    <Clock size={40} className="rotate-infinite" style={{ marginBottom: '16px' }} />
                                    <p style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Scanning Database...</p>
                                </div>
                            ) : filteredTasks.length === 0 ? (
                                <div className="glass-clear" style={{
                                    color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '80px 40px',
                                    borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)'
                                }}>
                                    <Clock size={32} style={{ marginBottom: '16px', opacity: 0.3 }} />
                                    <p style={{ fontSize: '1rem', fontWeight: '500', color: 'rgba(255,255,255,0.6)' }}>Zero Objectives Located</p>
                                    <p style={{ fontSize: '0.85rem', marginTop: '4px', marginBottom: '24px' }}>Awaiting new mission parameters.</p>
                                    <button className="btn" onClick={() => setShowCreateModal(true)} style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '12px',
                                        padding: '8px 24px'
                                    }}>
                                        Create New Mission
                                    </button>
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
