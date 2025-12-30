import { useState } from 'react';
import { Plus, Edit2, Repeat, Clock, Trash2, X } from 'lucide-react';
import { useRoutines } from '../hooks/useFirestore';
import type { Routine, RepeatFrequency, Task } from '../types';

export default function RoutinesPage() {
    const { routines, loading, addRoutine, updateRoutine, deleteRoutine } = useRoutines();

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [repeat, setRepeat] = useState<RepeatFrequency>('Daily');
    const [taskTitles, setTaskTitles] = useState<string[]>(['']);

    const handleAddTitleInput = () => setTaskTitles([...taskTitles, '']);

    const handleTitleChange = (index: number, value: string) => {
        const newTitles = [...taskTitles];
        newTitles[index] = value;
        setTaskTitles(newTitles);
    };

    const handleRemoveTitleInput = (index: number) => {
        const newTitles = taskTitles.filter((_, i) => i !== index);
        setTaskTitles(newTitles);
    };

    const handleSave = async () => {
        if (!name) return;

        // Create simplistic task objects
        const newTasks = taskTitles.filter(t => t.trim()).map(title => ({
            id: Math.random().toString(36).substr(2, 9),
            title,
            description: '',
            completed: false,
            priority: 'Medium',
            deadline: new Date(),
            repeat: 'None',
            tags: [],
            createdAt: new Date()
        } as Task));

        try {
            await addRoutine({
                name,
                repeat,
                tasks: newTasks,
                enabled: true,
                reminderEnabled: true
            });
            setShowModal(false);
            setName('');
            setRepeat('Daily');
            setTaskTitles(['']);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleRoutine = (routine: Routine) => {
        updateRoutine(routine.id, { enabled: !routine.enabled });
    };

    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div className="page-title flex justify-between items-center">
                <div>
                    <h1 style={{
                        fontSize: '3rem', fontWeight: '600', letterSpacing: '-1px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>Smart Routines</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem' }}>Manage your daily, weekly, and monthly routines</p>
                </div>
                <button className="btn btn-lg" onClick={() => setShowModal(true)} style={{
                    background: 'white', color: '#667eea', fontWeight: '600', border: 'none',
                    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <Plus size={20} />
                    Create Routine
                </button>
            </div>

            <div className="grid grid-3" style={{ gap: '24px' }}>
                {loading ? (
                    <div style={{ color: 'white' }}>Loading routines...</div>
                ) : routines.length === 0 ? (
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>No routines created yet.</div>
                ) : (
                    routines.map(routine => (
                        <div key={routine.id} className="glass-clear" style={{ padding: '24px' }}>
                            <div className="flex justify-between items-start mb-md">
                                <div className="flex items-center gap-md">
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #FF9500, #FFB340)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <Repeat size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white' }}>
                                            {routine.name}
                                        </h3>
                                        <p className="flex items-center gap-sm" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>
                                            <Clock size={12} />
                                            {routine.repeat}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`toggle ${routine.enabled ? 'active' : ''}`}
                                    style={{ background: routine.enabled ? '#4ade80' : 'rgba(255,255,255,0.2)', cursor: 'pointer' }}
                                    onClick={() => toggleRoutine(routine)}
                                ></div>
                            </div>

                            <div style={{
                                background: 'rgba(255, 149, 0, 0.05)',
                                borderRadius: '10px',
                                padding: '16px',
                                marginBottom: '16px',
                                border: '1px solid rgba(255,149,0,0.1)'
                            }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '12px', color: 'white' }}>
                                    Tasks in routine:
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {routine.tasks.slice(0, 3).map((task, i) => (
                                        <div key={i} className="flex items-center gap-sm">
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: '#fbbf24'
                                            }}></div>
                                            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>{task.title}</span>
                                        </div>
                                    ))}
                                    {routine.tasks.length > 3 && (
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', paddingLeft: '14px' }}>
                                            + {routine.tasks.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button className="btn btn-sm w-full"
                                onClick={() => deleteRoutine(routine.id)}
                                style={{ background: 'transparent', color: '#fca5a5', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                <Trash2 size={16} /> Delete Routine
                            </button>
                        </div>
                    ))
                )}

                {/* Add New Routine Card */}
                <div
                    className="glass-clear"
                    style={{
                        padding: '24px',
                        border: '2px dashed rgba(255,255,255,0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '280px',
                        transition: 'all 0.2s',
                        background: 'rgba(255,255,255,0.05)'
                    }}
                    onClick={() => setShowModal(true)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'white';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                >
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px'
                    }}>
                        <Plus size={32} style={{ color: 'white' }} />
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
                        Create New Routine
                    </h3>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                        Build repeating task sequences
                    </p>
                </div>
            </div>

            {/* Create Routine Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }} onClick={() => setShowModal(false)}>
                    <div className="glass-clear" style={{
                        width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', padding: '32px',
                        background: 'rgba(255,255,255,0.95)', border: '1px solid white'
                    }} onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-lg">
                            <h2 style={{ color: '#1e293b' }}>New Routine</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X color="#64748b" /></button>
                        </div>

                        <div className="flex flex-col gap-md">
                            <div>
                                <label style={{ display: 'block', color: '#64748b', marginBottom: '8px' }}>Routine Name</label>
                                <input
                                    value={name} onChange={e => setName(e.target.value)}
                                    placeholder="Morning Drill"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#1e293b' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#64748b', marginBottom: '8px' }}>Repeat Frequency</label>
                                <select
                                    value={repeat} onChange={e => setRepeat(e.target.value as RepeatFrequency)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#1e293b' }}
                                >
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', color: '#64748b', marginBottom: '8px' }}>Tasks Included</label>
                                {taskTitles.map((title, idx) => (
                                    <div key={idx} className="flex gap-sm mb-sm">
                                        <input
                                            value={title} onChange={e => handleTitleChange(idx, e.target.value)}
                                            placeholder={`Task ${idx + 1}`}
                                            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', color: '#1e293b' }}
                                        />
                                        {taskTitles.length > 1 && (
                                            <button onClick={() => handleRemoveTitleInput(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button className="btn btn-sm" onClick={handleAddTitleInput} style={{ background: '#e2e8f0', color: '#475569', marginTop: '8px' }}>
                                    <Plus size={14} style={{ marginRight: '4px' }} /> Add Task
                                </button>
                            </div>

                            <button className="btn btn-primary" onClick={handleSave} style={{ background: '#667eea', color: 'white', marginTop: '16px' }}>
                                Create Routine
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
