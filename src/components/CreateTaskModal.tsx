import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format, isSameDay, startOfDay, addMinutes, setHours, setMinutes } from 'date-fns';
import { useTasks } from '../hooks/useFirestore';
import type { Priority, RepeatFrequency } from '../types';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'details' | 'time';

export default function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
    const { addTask, tasks } = useTasks();
    const [step, setStep] = useState<Step>('details');
    const [loading, setLoading] = useState(false);

    // Task State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('Medium');
    const [repeat, setRepeat] = useState<RepeatFrequency>('None');
    const [tags, setTags] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [duration, setDuration] = useState(60); // minutes

    useEffect(() => {
        const handleExternalOpen = (e: any) => {
            if (e.detail?.date) {
                setSelectedDate(e.detail.date);
                setStep('details');
            }
        };
        window.addEventListener('openCreateTask', handleExternalOpen);
        return () => window.removeEventListener('openCreateTask', handleExternalOpen);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setStep('details');
            setTitle('');
            setDescription('');
            setPriority('Medium');
            setRepeat('None');
            setTags([]);
            setStartTime(null);
            setDuration(60);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!title.trim() || !startTime) return;

        setLoading(true);
        try {
            const deadline = startTime;
            const endTime = addMinutes(startTime, duration);

            await addTask({
                title,
                description,
                priority,
                repeat,
                tags,
                deadline,
                endTime,
                completed: false
            });
            onClose();
        } catch (error) {
            console.error('Error adding task:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000,
            padding: '20px'
        }}>
            <div className="glass-clear" style={{
                width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', position: 'relative'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>
                        {step === 'details' ? 'Task Details' : 'Select Time'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 0, marginBottom: '20px', fontSize: '0.9rem' }}>
                        Creating task for <strong>{format(selectedDate, 'MMMM d, yyyy')}</strong>
                    </p>

                    {step === 'details' && (
                        <div className="fade-in">
                            <div className="form-group">
                                <label className="form-label" style={{ color: 'white' }}>Task Title</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter task name"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ color: 'white' }}>Description</label>
                                <textarea
                                    className="form-input"
                                    placeholder="Enter details..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', minHeight: '80px' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ color: 'white' }}>Priority</label>
                                <select
                                    className="form-select"
                                    value={priority}
                                    onChange={e => setPriority(e.target.value as Priority)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                >
                                    <option value="High" style={{ color: 'black' }}>High</option>
                                    <option value="Medium" style={{ color: 'black' }}>Medium</option>
                                    <option value="Low" style={{ color: 'black' }}>Low</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 'time' && (
                        <div className="fade-in">
                            <div className="form-group">
                                <label className="form-label" style={{ color: 'white' }}>Duration (minutes)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={duration}
                                    onChange={e => setDuration(parseInt(e.target.value) || 0)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ color: 'white' }}>Manual Time Selection</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="time"
                                        className="form-input"
                                        value={startTime ? format(startTime, 'HH:mm') : ''}
                                        onChange={e => {
                                            if (!e.target.value) return;
                                            const [h, m] = e.target.value.split(':').map(Number);
                                            setStartTime(setHours(setMinutes(startOfDay(selectedDate), m), h));
                                        }}
                                        style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                    />
                                </div>
                            </div>

                            <label className="form-label" style={{ color: 'white', marginTop: '10px' }}>Suggested Gaps & Schedule</label>
                            <div style={{
                                display: 'flex', flexDirection: 'column', gap: '8px',
                                maxHeight: '300px', overflowY: 'auto', paddingRight: '10px'
                            }}>
                                {(() => {
                                    const dayTasks = tasks
                                        .filter(t => !t.completed && isSameDay(t.deadline, selectedDate))
                                        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

                                    const dayTimeline: any[] = [];
                                    let lastTime = startOfDay(selectedDate);

                                    dayTasks.forEach(task => {
                                        const tStart = new Date(task.deadline);
                                        const tEnd = task.endTime ? new Date(task.endTime) : addMinutes(tStart, 30);

                                        if (tStart > lastTime) {
                                            dayTimeline.push({
                                                type: 'free',
                                                start: lastTime,
                                                end: tStart,
                                                duration: (tStart.getTime() - lastTime.getTime()) / (1000 * 60)
                                            });
                                        }

                                        dayTimeline.push({
                                            type: 'task',
                                            title: task.title,
                                            start: tStart,
                                            end: tEnd
                                        });

                                        lastTime = tEnd;
                                    });

                                    const endOfDay = setHours(setMinutes(startOfDay(selectedDate), 59), 23);
                                    if (lastTime < endOfDay) {
                                        dayTimeline.push({
                                            type: 'free',
                                            start: lastTime,
                                            end: endOfDay,
                                            duration: (endOfDay.getTime() - lastTime.getTime()) / (1000 * 60)
                                        });
                                    }

                                    return dayTimeline.map((item, i) => {
                                        const isSelected = item.type === 'free' && startTime && item.start.getTime() === startTime.getTime();
                                        const canFit = item.type === 'free' && item.duration >= duration;

                                        return (
                                            <div
                                                key={i}
                                                onClick={() => item.type === 'free' && setStartTime(item.start)}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    background: isSelected ? 'rgba(102, 126, 234, 0.4)' : item.type === 'task' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                                                    border: '1px solid',
                                                    borderColor: isSelected ? '#667eea' : item.type === 'task' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)',
                                                    cursor: item.type === 'task' ? 'default' : 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    opacity: item.type === 'free' && !canFit ? 0.6 : 1
                                                }}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                        {format(item.start, 'h:mm a')} - {format(item.end, 'h:mm a')}
                                                    </span>
                                                    {item.type === 'free' && (
                                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{Math.floor(item.duration)} min available</span>
                                                    )}
                                                </div>

                                                {item.type === 'task' ? (
                                                    <span style={{ color: '#fca5a5', fontSize: '0.8rem', textAlign: 'right' }}>{item.title}</span>
                                                ) : isSelected ? (
                                                    <span style={{ color: '#667eea', fontSize: '0.8rem', fontWeight: 'bold' }}>Selected</span>
                                                ) : canFit ? (
                                                    <span style={{ color: 'rgba(102, 126, 234, 0.6)', fontSize: '0.75rem' }}>Plan here</span>
                                                ) : (
                                                    <span style={{ color: 'rgba(239, 68, 68, 0.6)', fontSize: '0.75rem' }}>Too short</span>
                                                )}
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
                    {step === 'time' && (
                        <button
                            onClick={() => setStep('details')}
                            className="btn secondary"
                            style={{ flex: 1 }}
                        >
                            Back
                        </button>
                    )}

                    {step === 'details' ? (
                        <button
                            onClick={() => title.trim() && setStep('time')}
                            disabled={!title.trim()}
                            className="btn primary"
                            style={{ flex: 2 }}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleCreate}
                            disabled={!startTime || loading}
                            className="btn primary"
                            style={{ flex: 2 }}
                        >
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
