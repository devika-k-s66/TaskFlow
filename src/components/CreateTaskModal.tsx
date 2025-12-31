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
        <>
            <style>{`
                .create-task-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(12px);
                    z-index: 3000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    animation: fadeIn 0.2s ease-out;
                }

                .create-task-modal-content {
                    width: 100%;
                    max-width: 550px;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    background: rgba(15, 23, 42, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    border-radius: 20px;
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @media (min-width: 768px) {
                    .create-task-modal-content {
                        border-radius: 24px;
                    }
                }

                .modal-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                    letter-spacing: -0.025em;
                }

                .modal-close-btn {
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.6);
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-close-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .modal-body {
                    padding: 24px;
                    overflow-y: auto;
                    flex: 1;
                }

                .modal-footer {
                    padding: 20px 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.2);
                }

                .planning-input {
                    background: rgba(0, 0, 0, 0.2) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                    padding: 12px 16px !important;
                    border-radius: 12px !important;
                    font-size: 0.95rem !important;
                    width: 100%;
                    transition: all 0.2s;
                    font-family: inherit;
                }

                .planning-input:focus {
                    border-color: #667eea !important;
                    background: rgba(0, 0, 0, 0.4) !important;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2) !important;
                    outline: none;
                }

                .planning-input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }

                .planning-textarea {
                    min-height: 100px;
                    resize: vertical;
                    line-height: 1.5;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-label {
                    display: block;
                    margin-bottom: 8px;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 600;
                    font-size: 0.85rem;
                }

                .btn-modal {
                    padding: 12px 20px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-modal-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(118, 75, 162, 0.3);
                }

                .btn-modal-primary:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(118, 75, 162, 0.4);
                }

                .btn-modal-primary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .btn-modal-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .btn-modal-secondary:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                .time-slot {
                    padding: 12px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s;
                }

                .time-slot:hover {
                    background: rgba(255, 255, 255, 0.06);
                }

                .time-slot.selected {
                    background: rgba(102, 126, 234, 0.15);
                    border-color: rgba(102, 126, 234, 0.5);
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Custom Scrollbar for the modal body */
                .modal-body::-webkit-scrollbar {
                    width: 6px;
                }
                .modal-body::-webkit-scrollbar-track {
                    background: transparent;
                }
                .modal-body::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                .modal-body::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>

            <div className="create-task-modal-overlay">
                <div className="create-task-modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title">
                            {step === 'details' ? 'Task Details' : 'Select Time'}
                        </h2>
                        <button onClick={onClose} className="modal-close-btn">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="modal-body">
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 0, marginBottom: '24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Creating task for <span style={{ color: '#fff', fontWeight: 600 }}>{format(selectedDate, 'MMMM d, yyyy')}</span>
                        </p>

                        {step === 'details' && (
                            <div className="fade-in">
                                <div className="form-group">
                                    <label className="form-label">Task Title</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        className="planning-input"
                                        placeholder="What needs to be done?"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && title.trim()) setStep('time');
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description (Optional)</label>
                                    <textarea
                                        className="planning-input planning-textarea"
                                        placeholder="Add details, context, or subtasks..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Priority</label>
                                    <select
                                        className="planning-input"
                                        value={priority}
                                        onChange={e => setPriority(e.target.value as Priority)}
                                    >
                                        <option value="High" style={{ color: 'black' }}>High Priority</option>
                                        <option value="Medium" style={{ color: 'black' }}>Medium Priority</option>
                                        <option value="Low" style={{ color: 'black' }}>Low Priority</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {step === 'time' && (
                            <div className="fade-in">
                                <div className="form-group">
                                    <label className="form-label">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        className="planning-input"
                                        value={duration}
                                        onChange={e => setDuration(parseInt(e.target.value) || 0)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Time Selection</label>
                                    <input
                                        type="time"
                                        className="planning-input"
                                        value={startTime ? format(startTime, 'HH:mm') : ''}
                                        onChange={e => {
                                            if (!e.target.value) return;
                                            const [h, m] = e.target.value.split(':').map(Number);
                                            setStartTime(setHours(setMinutes(startOfDay(selectedDate), m), h));
                                        }}
                                    />
                                </div>

                                <label className="form-label" style={{ marginTop: '24px' }}>Suggested Time Slots</label>
                                <div style={{
                                    display: 'flex', flexDirection: 'column', gap: '8px',
                                    maxHeight: '240px', overflowY: 'auto', paddingRight: '4px'
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
                                                    className={`time-slot ${isSelected ? 'selected' : ''}`}
                                                    style={{
                                                        opacity: item.type === 'free' && !canFit ? 0.5 : 1,
                                                        pointerEvents: item.type === 'task' ? 'none' : 'auto',
                                                        borderColor: item.type === 'task' ? 'rgba(239, 68, 68, 0.2)' : undefined,
                                                        background: item.type === 'task' ? 'rgba(239, 68, 68, 0.05)' : undefined
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>
                                                            {format(item.start, 'h:mm a')} - {format(item.end, 'h:mm a')}
                                                        </span>
                                                        {item.type === 'free' && (
                                                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{Math.floor(item.duration)} min available</span>
                                                        )}
                                                    </div>

                                                    {item.type === 'task' ? (
                                                        <span style={{ color: '#fca5a5', fontSize: '0.8rem' }}>{item.title}</span>
                                                    ) : isSelected ? (
                                                        <span style={{ color: '#667eea', fontSize: '0.8rem', fontWeight: 'bold' }}>Selected</span>
                                                    ) : canFit ? (
                                                        <span style={{ color: 'rgba(102, 126, 234, 0.6)', fontSize: '0.75rem' }}>Select</span>
                                                    ) : (
                                                        <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '0.75rem' }}>Too short</span>
                                                    )}
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        {step === 'time' && (
                            <button
                                onClick={() => setStep('details')}
                                className="btn-modal btn-modal-secondary"
                                style={{ flex: 1 }}
                            >
                                Back
                            </button>
                        )}

                        {step === 'details' ? (
                            <button
                                onClick={() => title.trim() && setStep('time')}
                                disabled={!title.trim()}
                                className="btn-modal btn-modal-primary"
                                style={{ flex: 2 }}
                            >
                                Next Step
                            </button>
                        ) : (
                            <button
                                onClick={handleCreate}
                                disabled={!startTime || loading}
                                className="btn-modal btn-modal-primary"
                                style={{ flex: 2 }}
                            >
                                {loading ? 'Planning...' : 'Confirm Task'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
