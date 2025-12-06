import { useState } from 'react';
import { Plus, Clock, MoreVertical, Filter, Grid, List, Edit2, Copy, Trash2 } from 'lucide-react';
import { mockTasks } from '../data/mockData';
import { format } from 'date-fns';
import type { Task } from '../types';

export default function TasksPage() {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const filters = [
        { id: 'all', label: 'All Tasks', count: mockTasks.length },
        { id: 'today', label: 'Today', count: 5 },
        { id: 'week', label: 'This Week', count: 8 },
        { id: 'scheduled', label: 'Scheduled', count: 12 },
        { id: 'completed', label: 'Completed', count: 23 },
        { id: 'high', label: 'High Priority', count: 3 },
    ];

    const tags = ['work', 'personal', 'health', 'urgent', 'meetings', 'habit'];

    const renderTaskCard = (task: Task) => (
        <div
            key={task.id}
            className="card"
            style={{
                padding: '18px',
                transition: 'all 0.2s',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
        >
            <div className="flex items-center gap-md">
                <input
                    type="checkbox"
                    className="checkbox"
                    checked={task.completed}
                    onChange={() => { }}
                />
                <div style={{ flex: 1 }}>
                    <h4 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '6px',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>
                        {task.title}
                    </h4>
                    {task.description && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                            {task.description}
                        </p>
                    )}
                    <div className="flex items-center gap-md" style={{ flexWrap: 'wrap' }}>
                        <span className="flex items-center gap-sm text-muted" style={{ fontSize: '0.8125rem' }}>
                            <Clock size={14} />
                            {format(task.deadline, 'MMM d, h:mm a')}
                        </span>
                        {task.tags.map(tag => (
                            <span key={tag} className="badge badge-primary">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <span className={`badge badge-${task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success'}`}>
                    {task.priority}
                </span>
                <div className="flex items-center gap-sm">
                    <button className="btn btn-sm btn-ghost" title="Edit">
                        <Edit2 size={16} />
                    </button>
                    <button className="btn btn-sm btn-ghost" title="Duplicate">
                        <Copy size={16} />
                    </button>
                    <button className="btn btn-sm btn-ghost" title="Delete">
                        <Trash2 size={16} />
                    </button>
                    <button className="btn btn-sm btn-ghost">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="page-content fade-in">
            <div className="page-title flex justify-between items-center">
                <div>
                    <h1>Tasks</h1>
                    <p className="text-secondary">Manage your tasks and to-dos</p>
                </div>
                <button className="btn btn-primary btn-lg">
                    <Plus size={20} />
                    Create New Task
                </button>
            </div>

            <div className="grid grid-3" style={{ gap: '24px', alignItems: 'start' }}>
                {/* Filters Sidebar */}
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Filters</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                                        background: selectedFilter === filter.id ? 'var(--bg-main)' : 'transparent',
                                        transition: 'all 0.15s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedFilter !== filter.id) {
                                            e.currentTarget.style.background = 'var(--bg-main)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedFilter !== filter.id) {
                                            e.currentTarget.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={{
                                        fontSize: '0.9375rem',
                                        fontWeight: selectedFilter === filter.id ? '600' : '400',
                                        color: selectedFilter === filter.id ? 'var(--primary)' : 'var(--text-primary)'
                                    }}>
                                        {filter.label}
                                    </span>
                                    <span style={{
                                        fontSize: '0.8125rem',
                                        color: 'var(--text-muted)',
                                        fontWeight: '500'
                                    }}>
                                        {filter.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Priority</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {['High', 'Medium', 'Low'].map(priority => (
                                <label key={priority} className="flex items-center gap-sm" style={{ cursor: 'pointer' }}>
                                    <input type="checkbox" className="checkbox" />
                                    <span style={{ fontSize: '0.9375rem' }}>{priority}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Tags</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {tags.map(tag => (
                                <label key={tag} className="flex items-center gap-sm" style={{ cursor: 'pointer' }}>
                                    <input type="checkbox" className="checkbox" />
                                    <span style={{ fontSize: '0.9375rem', textTransform: 'capitalize' }}>{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tasks List */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="card" style={{ padding: '20px 24px', marginBottom: '20px' }}>
                        <div className="flex justify-between items-center">
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>All Tasks</h3>
                            <div className="flex items-center gap-md">
                                <button className="btn btn-sm btn-ghost">
                                    <Filter size={16} />
                                    Sort
                                </button>
                                <div className="flex items-center gap-sm" style={{
                                    background: 'var(--bg-main)',
                                    padding: '4px',
                                    borderRadius: '8px'
                                }}>
                                    <button
                                        className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List size={16} />
                                    </button>
                                    <button
                                        className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {mockTasks.map(renderTaskCard)}
                    </div>
                </div>
            </div>
        </div>
    );
}
