import { useState, useEffect } from 'react';
import { Plus, Clock, MoreVertical, Filter, Grid, List, Trash2 } from 'lucide-react';
import CreateTaskModal from '../components/CreateTaskModal';
import { useTasks } from '../hooks/useFirestore';
import { format, isToday, isThisWeek } from 'date-fns';
import type { Task } from '../types';

export default function TasksPage() {
    const { tasks, loading, updateTask, deleteTask } = useTasks();
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);


    // Derived State for Filters
    const getFilteredTasks = () => {
        let filtered = tasks;
        if (selectedFilter === 'today') filtered = tasks.filter(t => isToday(t.deadline));
        else if (selectedFilter === 'week') filtered = tasks.filter(t => isThisWeek(t.deadline));
        else if (selectedFilter === 'completed') filtered = tasks.filter(t => t.completed);
        else if (selectedFilter === 'high') filtered = tasks.filter(t => t.priority === 'High');

        return filtered;
    };

    const filteredTasks = getFilteredTasks();

    const filters = [
        { id: 'all', label: 'All Tasks', count: tasks.length },
        { id: 'today', label: 'Today', count: tasks.filter(t => isToday(t.deadline)).length },
        { id: 'week', label: 'This Week', count: tasks.filter(t => isThisWeek(t.deadline)).length },
        { id: 'completed', label: 'Completed', count: tasks.filter(t => t.completed).length },
        { id: 'high', label: 'High Priority', count: tasks.filter(t => t.priority === 'High').length },
    ];

    const tags = Array.from(new Set(tasks.flatMap(t => t.tags)));



    const renderTaskCard = (task: Task) => (
        <div
            key={task.id}
            className="glass-clear"
            style={{
                padding: isMobile ? '16px' : '24px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                marginBottom: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative'
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
            <div style={{ display: 'flex', gap: isMobile ? '12px' : '16px', flexWrap: 'wrap' }}>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        updateTask(task.id, { completed: !task.completed });
                    }}
                    style={{
                        width: '24px', height: '24px', borderRadius: '6px',
                        border: '2px solid rgba(255,255,255,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        background: task.completed ? 'rgba(255,255,255,0.5)' : 'transparent',
                        flexShrink: 0,
                        marginTop: '4px'
                    }}
                >
                    {task.completed && <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '2px' }} />}
                </div>

                <div style={{ flex: 1, minWidth: isMobile ? '200px' : '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', gap: '8px' }}>
                        <h4 style={{
                            fontSize: isMobile ? '1rem' : '1.1rem',
                            fontWeight: '600',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'rgba(255,255,255,0.5)' : 'white',
                            margin: 0
                        }}>
                            {task.title}
                        </h4>
                        <span className="badge" style={{
                            background: task.priority === 'High' ? 'rgba(255, 59, 48, 0.2)' : task.priority === 'Medium' ? 'rgba(255, 149, 0, 0.2)' : 'rgba(52, 199, 89, 0.2)',
                            color: task.priority === 'High' ? '#f87171' : task.priority === 'Medium' ? '#fbbf24' : '#4ade80',
                            border: '1px solid rgba(255,255,255,0.1)',
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            flexShrink: 0
                        }}>
                            {task.priority}
                        </span>
                    </div>

                    {task.description && (
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', lineHeight: '1.4' }}>
                            {task.description}
                        </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span className="flex items-center gap-sm" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                            <Clock size={12} />
                            {format(task.deadline, 'MMM d, h:mm a')}
                            {task.endTime && ` - ${format(task.endTime, 'h:mm a')}`}
                        </span>
                        {task.tags.map(tag => (
                            <span key={tag} className="badge" style={{
                                background: 'rgba(102, 126, 234, 0.15)',
                                color: 'rgba(255,255,255,0.9)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                fontSize: '0.7rem'
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    marginLeft: 'auto',
                    borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    paddingLeft: isMobile ? '0' : '16px',
                    width: isMobile ? '100%' : 'auto',
                    justifyContent: isMobile ? 'flex-end' : 'flex-start',
                    marginTop: isMobile ? '8px' : '0'
                }}>
                    <button className="btn btn-sm btn-ghost" onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 0, borderRadius: '8px', transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    >
                        <Trash2 size={16} />
                    </button>
                    <button className="btn btn-sm btn-ghost" style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 0, borderRadius: '8px', transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    >
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto', padding: isMobile ? '16px' : '20px' }}>
            <div className="page-title" style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: '20px',
                marginBottom: isMobile ? '24px' : '32px'
            }}>
                <div>
                    <h1 style={{
                        fontSize: isMobile ? '2.2rem' : '3rem',
                        fontWeight: '600',
                        letterSpacing: '-1px',
                        color: 'white',
                        textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        lineHeight: '1.1',
                        marginBottom: '8px'
                    }}>Tasks</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? '1rem' : '1.2rem' }}>Manage your tasks and to-dos</p>
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
                    width: isMobile ? '100%' : 'auto',
                    justifyContent: 'center'
                }}>
                    <Plus size={20} />
                    Create New Task
                </button>
            </div>

            <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
                gap: '24px',
                alignItems: 'start'
            }}>
                {/* Filters Sidebar */}
                <div className="glass-clear" style={{
                    padding: '24px',
                    position: isMobile ? 'static' : 'sticky',
                    top: '20px'
                }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: 'white' }}>Filters</h3>
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '8px', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '8px' : '0' }}>
                            {filters.map(filter => (
                                <div
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        background: selectedFilter === filter.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        transition: 'all 0.15s',
                                        minWidth: isMobile ? 'max-content' : 'auto',
                                        gap: '12px'
                                    }}
                                >
                                    <span style={{
                                        fontSize: '0.85rem',
                                        fontWeight: selectedFilter === filter.id ? '600' : '400',
                                        color: 'white'
                                    }}>
                                        {filter.label}
                                    </span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: 'rgba(255,255,255,0.7)',
                                        fontWeight: '500',
                                        background: 'rgba(255,255,255,0.1)',
                                        padding: '2px 6px',
                                        borderRadius: '4px'
                                    }}>
                                        {filter.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {!isMobile && (
                        <>
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: 'white' }}>Priority</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {['High', 'Medium', 'Low'].map(priority => (
                                        <label key={priority} className="flex items-center gap-sm" style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.9)' }}>
                                            <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.5)', marginRight: '8px' }}></div>
                                            <span style={{ fontSize: '0.9375rem' }}>{priority}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: 'white' }}>Tags</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {tags.length > 0 ? tags.map(tag => (
                                        <label key={tag} className="flex items-center gap-sm" style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.9)' }}>
                                            <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.5)', marginRight: '8px' }}></div>
                                            <span style={{ fontSize: '0.9375rem', textTransform: 'capitalize' }}>{tag}</span>
                                        </label>
                                    )) : <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>No tags used yet</span>}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Tasks List */}
                <div>
                    <div className="glass-clear" style={{
                        padding: isMobile ? '12px 16px' : '20px 24px',
                        marginBottom: '20px',
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        gap: '12px'
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>{selectedFilter === 'all' ? 'All Tasks' : selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}</h3>
                        <div className="flex items-center gap-md" style={{ width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
                            <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px' }}>
                                <Filter size={14} /> Sort
                            </button>
                            <div className="flex items-center gap-sm" style={{ background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <button
                                    className="btn btn-sm"
                                    onClick={() => setViewMode('list')}
                                    style={{
                                        background: viewMode === 'list' ? 'rgba(255,255,255,0.15)' : 'transparent',
                                        color: 'white',
                                        border: 'none',
                                        padding: '4px 8px'
                                    }}
                                >
                                    <List size={16} />
                                </button>
                                <button
                                    className="btn btn-sm"
                                    onClick={() => setViewMode('grid')}
                                    style={{
                                        background: viewMode === 'grid' ? 'rgba(255,255,255,0.15)' : 'transparent',
                                        color: 'white',
                                        border: 'none',
                                        padding: '4px 8px'
                                    }}
                                >
                                    <Grid size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: viewMode === 'grid' && !isMobile ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
                        gap: '16px'
                    }}>
                        {loading ? (
                            <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
                                <Clock size={32} className="rotate-infinite" style={{ marginBottom: '12px', opacity: '0.5' }} />
                                <p>Loading missions...</p>
                            </div>
                        ) : filteredTasks.length === 0 ? (
                            <div className="glass-clear" style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '60px 40px', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No objectives found</p>
                                <p style={{ fontSize: '0.9rem' }}>Try changing your filters or create a new mission.</p>
                            </div>
                        ) : (
                            filteredTasks.map(renderTaskCard)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
