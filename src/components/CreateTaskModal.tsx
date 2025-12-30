import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useTasks } from '../hooks/useFirestore';
import type { Task } from '../types';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
    const { addTask } = useTasks();

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('Medium');
    const [newTaskDeadline, setNewTaskDeadline] = useState('');
    const [newTaskEndTime, setNewTaskEndTime] = useState('');
    const [newTaskTags, setNewTaskTags] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width < 600;

    const handleCreate = async () => {
        if (!newTaskTitle) {
            return;
        }

        setIsSubmitting(true);
        try {
            const taskDeadline = newTaskDeadline ? new Date(newTaskDeadline) : new Date();

            let taskEndTime = undefined;
            if (newTaskEndTime) {
                const [datePart] = newTaskDeadline.split('T');
                taskEndTime = new Date(`${datePart || new Date().toISOString().split('T')[0]}T${newTaskEndTime}`);
            }

            const taskData: Omit<Task, 'id' | 'createdAt'> = {
                title: newTaskTitle,
                description: newTaskDesc || '',
                completed: false,
                priority: newTaskPriority,
                deadline: taskDeadline,
                endTime: taskEndTime,
                tags: newTaskTags ? newTaskTags.split(',').map(t => t.trim()).filter(Boolean) : [],
                repeat: 'None'
            };

            await addTask(taskData);
            handleClose();
        } catch (error) {
            console.error("Failed to create task", error);
            alert(`Error creating task: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskPriority('Medium');
        setNewTaskDeadline('');
        setNewTaskEndTime('');
        setNewTaskTags('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            fontFamily: "'Montserrat', sans-serif",
            padding: isMobile ? '12px' : '20px'
        }} onClick={handleClose}>
            <div className="glass-clear" style={{
                width: '100%', maxWidth: '480px',
                maxHeight: '94vh',
                overflowY: 'auto',
                padding: isMobile ? '20px' : '28px',
                background: 'rgba(30, 20, 50, 0.4)',
                backdropFilter: 'blur(50px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)',
                borderRadius: isMobile ? '20px' : '24px',
                color: 'white',
                position: 'relative',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }} onClick={e => e.stopPropagation()}>

                {/* Header - Compact */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '16px' : '20px' }}>
                    <h2 style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: '700', color: 'white', letterSpacing: '-0.5px', margin: 0 }}>New Mission</h2>
                    <button onClick={handleClose} style={{
                        background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: 'white',
                        width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <X size={16} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '14px' }}>
                    {/* Title */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Task Title</label>
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                            placeholder="Objective name..."
                            autoFocus
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem',
                                background: 'rgba(255,255,255,0.06)', color: 'white',
                                outline: 'none', fontFamily: "'Montserrat', sans-serif"
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</label>
                        <textarea
                            value={newTaskDesc}
                            onChange={e => setNewTaskDesc(e.target.value)}
                            placeholder="Brief details..."
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem',
                                background: 'rgba(255,255,255,0.06)', color: 'white',
                                minHeight: '35px', maxHeight: '55px', outline: 'none', fontFamily: "'Montserrat', sans-serif", resize: 'none'
                            }}
                        />
                    </div>

                    {/* Priority & Date Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority</label>
                            <select
                                value={newTaskPriority}
                                onChange={e => setNewTaskPriority(e.target.value as any)}
                                style={{
                                    width: '100%', padding: '10px 12px', borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem',
                                    background: 'rgba(255,255,255,0.06)', color: 'white',
                                    outline: 'none', fontFamily: "'Montserrat', sans-serif", cursor: 'pointer'
                                }}
                            >
                                <option value="Low" style={{ background: '#1e1b4b' }}>Low</option>
                                <option value="Medium" style={{ background: '#1e1b4b' }}>Medium</option>
                                <option value="High" style={{ background: '#1e1b4b' }}>High</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</label>
                            <input
                                type="date"
                                value={newTaskDeadline.split('T')[0] || ''}
                                onChange={e => {
                                    const time = newTaskDeadline.split('T')[1] || '12:00';
                                    setNewTaskDeadline(`${e.target.value}T${time}`);
                                }}
                                style={{
                                    width: '100%', padding: '10px 12px', borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem',
                                    background: 'rgba(255,255,255,0.06)', color: 'white',
                                    outline: 'none', fontFamily: "'Montserrat', sans-serif", colorScheme: 'dark'
                                }}
                            />
                        </div>
                    </div>

                    {/* Start & End Time Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Start</label>
                            <input
                                type="time"
                                value={newTaskDeadline.split('T')[1] || ''}
                                onChange={e => {
                                    const date = newTaskDeadline.split('T')[0] || new Date().toISOString().split('T')[0];
                                    setNewTaskDeadline(`${date}T${e.target.value}`);
                                }}
                                style={{
                                    width: '100%', padding: '10px 12px', borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem',
                                    background: 'rgba(255,255,255,0.06)', color: 'white',
                                    outline: 'none', fontFamily: "'Montserrat', sans-serif", colorScheme: 'dark'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>End</label>
                            <input
                                type="time"
                                value={newTaskEndTime}
                                onChange={e => setNewTaskEndTime(e.target.value)}
                                style={{
                                    width: '100%', padding: '10px 12px', borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem',
                                    background: 'rgba(255,255,255,0.06)', color: 'white',
                                    outline: 'none', fontFamily: "'Montserrat', sans-serif", colorScheme: 'dark'
                                }}
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tags</label>
                        <input
                            type="text"
                            value={newTaskTags}
                            onChange={e => setNewTaskTags(e.target.value)}
                            placeholder="e.g. Work, Urgent"
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem',
                                background: 'rgba(255,255,255,0.06)', color: 'white',
                                outline: 'none', fontFamily: "'Montserrat', sans-serif"
                            }}
                        />
                    </div>

                    {/* Submit - Ultra Compact */}
                    <button
                        onClick={handleCreate}
                        disabled={!newTaskTitle || isSubmitting}
                        style={{
                            marginTop: isMobile ? '4px' : '6px',
                            padding: isMobile ? '12px' : '14px',
                            background: newTaskTitle && !isSubmitting ? 'white' : 'rgba(255,255,255,0.1)',
                            color: newTaskTitle && !isSubmitting ? '#667eea' : 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: isMobile ? '0.85rem' : '0.9rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: newTaskTitle && !isSubmitting ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                            fontFamily: "'Montserrat', sans-serif"
                        }}
                    >
                        {isSubmitting ? 'Syncing...' : <><Plus size={18} /> Create Mission</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
