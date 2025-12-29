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
            className="glass-clear"
            style={{
                padding: '24px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                marginBottom: '16px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.01) translateY(-2px)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)';
            }}
        >
            <div className="flex items-center gap-md">
                <div style={{
                    width: '24px', height: '24px', borderRadius: '6px',
                    border: '2px solid rgba(255,255,255,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                }}>
                    {task.completed && <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '2px' }} />}
                </div>
                <div style={{ flex: 1 }}>
                    <h4 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        marginBottom: '6px',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'rgba(255,255,255,0.5)' : 'white'
                    }}>
                        {task.title}
                    </h4>
                    {task.description && (
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
                            {task.description}
                        </p>
                    )}
                    <div className="flex items-center gap-md" style={{ flexWrap: 'wrap' }}>
                        <span className="flex items-center gap-sm" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>
                            <Clock size={14} />
                            {format(task.deadline, 'MMM d, h:mm a')}
                        </span>
                        {task.tags.map(tag => (
                            <span key={tag} className="badge" style={{
                                background: 'rgba(102, 126, 234, 0.2)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <span className="badge" style={{
                    background: task.priority === 'High' ? 'rgba(255, 59, 48, 0.2)' : task.priority === 'Medium' ? 'rgba(255, 149, 0, 0.2)' : 'rgba(52, 199, 89, 0.2)',
                    color: task.priority === 'High' ? '#f87171' : task.priority === 'Medium' ? '#fbbf24' : '#4ade80',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {task.priority}
                </span>
                <div className="flex items-center gap-sm">
                    {[Edit2, Copy, Trash2, MoreVertical].map((Icon, i) => (
                        <button key={i} className="btn btn-sm btn-ghost" style={{
                            background: 'transparent',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#667eea';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'white';
                            }}
                        >
                            <Icon size={16} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div className="page-title flex justify-between items-center">
                <div>
                    <h1 style={{
                        fontSize: '3rem', fontWeight: '600', letterSpacing: '-1px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>Tasks</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem' }}>Manage your tasks and to-dos</p>
                </div>
                <button className="btn btn-lg" style={{
                    background: 'white', color: '#667eea', fontWeight: '600', border: 'none',
                    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <Plus size={20} />
                    Create New Task
                </button>
            </div>

            <div className="grid grid-3" style={{ gap: '24px', alignItems: 'start' }}>
                {/* Filters Sidebar */}
                <div className="glass-clear" style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: 'white' }}>Filters</h3>
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
                                        background: selectedFilter === filter.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    <span style={{
                                        fontSize: '0.9375rem',
                                        fontWeight: selectedFilter === filter.id ? '600' : '400',
                                        color: 'white'
                                    }}>
                                        {filter.label}
                                    </span>
                                    <span style={{
                                        fontSize: '0.8125rem',
                                        color: 'rgba(255,255,255,0.7)',
                                        fontWeight: '500'
                                    }}>
                                        {filter.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

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
                            {tags.map(tag => (
                                <label key={tag} className="flex items-center gap-sm" style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.9)' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.5)', marginRight: '8px' }}></div>
                                    <span style={{ fontSize: '0.9375rem', textTransform: 'capitalize' }}>{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tasks List */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="glass-clear" style={{ padding: '20px 24px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white' }}>All Tasks</h3>
                        <div className="flex items-center gap-md">
                            <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <Filter size={16} /> Sort
                            </button>
                            <div className="flex items-center gap-sm" style={{ background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '8px' }}>
                                <button
                                    className="btn btn-sm"
                                    onClick={() => setViewMode('list')}
                                    style={{ background: viewMode === 'list' ? 'rgba(255,255,255,0.2)' : 'transparent', color: 'white', border: 'none' }}
                                >
                                    <List size={16} />
                                </button>
                                <button
                                    className="btn btn-sm"
                                    onClick={() => setViewMode('grid')}
                                    style={{ background: viewMode === 'grid' ? 'rgba(255,255,255,0.2)' : 'transparent', color: 'white', border: 'none' }}
                                >
                                    <Grid size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {mockTasks.map(renderTaskCard)}
                    </div>
                </div>
            </div>
        </div>
    );
}
