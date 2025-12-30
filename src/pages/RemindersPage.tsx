import { useState } from 'react';
import { Plus, Bell, Trash2, Check, Clock } from 'lucide-react';
import { useReminders } from '../hooks/useFirestore';
import { format } from 'date-fns';
import type { RepeatFrequency } from '../types';

export default function RemindersPage() {
    const { reminders, loading, addReminder, deleteReminder, updateReminder } = useReminders();

    // Form State
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [repeat, setRepeat] = useState<RepeatFrequency>('None');

    const handleAdd = async () => {
        if (!title || !time) return;
        try {
            await addReminder({
                title,
                time: new Date(time),
                repeat,
                notificationType: ['Web'], // Default to Web for now
                status: 'pending',
                notes: ''
            });
            setTitle('');
            setTime('');
            setRepeat('None');
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleStatus = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'pending' ? 'sent' : 'pending';
        updateReminder(id, { status: newStatus as any });
    };

    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div className="page-title flex justify-between items-center">
                <div>
                    <h1 style={{
                        fontSize: '3rem', fontWeight: '600', letterSpacing: '-1px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>Reminders</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem' }}>Manage your notifications and alerts</p>
                </div>
            </div>

            <div className="grid grid-3" style={{ gap: '24px', alignItems: 'start' }}>
                {/* Reminders Timeline */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="glass-clear" style={{ padding: '30px' }}>
                        <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '30px' }}>
                            <h3 style={{ color: 'white', fontWeight: '600' }}>Reminders Timeline</h3>
                        </div>
                        <div style={{ position: 'relative', paddingLeft: '40px' }}>
                            {/* Timeline line */}
                            <div style={{
                                position: 'absolute',
                                left: '19px',
                                top: '20px',
                                bottom: '20px',
                                width: '2px',
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.1))'
                            }}></div>

                            {loading ? (
                                <div style={{ color: 'white' }}>Loading reminders...</div>
                            ) : reminders.length === 0 ? (
                                <div style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>No pending reminders. Add one from the right sidebar.</div>
                            ) : (
                                reminders.sort((a, b) => a.time.getTime() - b.time.getTime()).map((reminder, index) => (
                                    <div
                                        key={reminder.id}
                                        style={{
                                            position: 'relative',
                                            marginBottom: '24px',
                                            paddingBottom: '0'
                                        }}
                                    >
                                        {/* Timeline dot */}
                                        <div style={{
                                            position: 'absolute',
                                            left: '-29px',
                                            top: '24px',
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: reminder.status === 'pending' ? '#fbbf24' : '#4ade80',
                                            border: '3px solid rgba(255,255,255,0.2)',
                                            boxShadow: '0 0 0 2px rgba(0,0,0,0.1)'
                                        }}></div>

                                        {/* Reminder card */}
                                        <div
                                            className="glass-clear"
                                            style={{
                                                padding: '24px',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                background: 'rgba(255,255,255,0.08)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'start'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateX(8px)';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateX(0)';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div className="flex items-center gap-md mb-sm">
                                                    <Bell size={16} style={{ color: 'white' }} />
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'white' }}>
                                                        {format(reminder.time, 'MMM d, h:mm a')}
                                                    </span>
                                                    <span className="badge" style={{
                                                        background: reminder.status === 'pending' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(74, 222, 128, 0.2)',
                                                        color: reminder.status === 'pending' ? '#fbbf24' : '#4ade80',
                                                        border: '1px solid rgba(255,255,255,0.1)'
                                                    }}>
                                                        {reminder.status}
                                                    </span>
                                                </div>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '6px', color: 'white' }}>
                                                    {reminder.title}
                                                </h4>
                                                {reminder.notes && (
                                                    <p style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'rgba(255,255,255,0.7)' }}>
                                                        {reminder.notes}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-sm">
                                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        {reminder.repeat}
                                                    </span>
                                                    {reminder.notificationType.map(type => (
                                                        <span key={type} className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                            {type}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-sm">
                                                <button
                                                    className="btn btn-sm btn-ghost"
                                                    onClick={() => handleToggleStatus(reminder.id, reminder.status)}
                                                    style={{ color: reminder.status === 'pending' ? 'white' : '#4ade80' }}
                                                    title={reminder.status === 'pending' ? 'Mark as sent/done' : 'Mark as pending'}
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-ghost"
                                                    onClick={() => deleteReminder(reminder.id)}
                                                    style={{ color: '#fca5a5' }}
                                                    title="Delete Reminder"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Add Reminder & Settings */}
                <div>
                    <div className="glass-clear mb-lg" style={{ padding: '24px' }}>
                        <h3 className="card-title mb-md" style={{ color: 'white' }}>Quick Add Reminder</h3>
                        <div className="form-group">
                            <label className="form-label" style={{ color: 'white' }}>Title</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Reminder title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ color: 'white' }}>Time</label>
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ color: 'white' }}>Repeat</label>
                            <select
                                className="form-select"
                                value={repeat}
                                onChange={e => setRepeat(e.target.value as RepeatFrequency)}
                                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }}
                            >
                                <option style={{ color: 'black' }} value="None">None</option>
                                <option style={{ color: 'black' }} value="Daily">Daily</option>
                                <option style={{ color: 'black' }} value="Weekly">Weekly</option>
                                <option style={{ color: 'black' }} value="Monthly">Monthly</option>
                            </select>
                        </div>
                        <button
                            className="btn btn-lg w-full"
                            onClick={handleAdd}
                            disabled={!title || !time}
                            style={{
                                background: 'white', color: '#667eea', fontWeight: '600', border: 'none',
                                opacity: (!title || !time) ? 0.6 : 1, cursor: (!title || !time) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Create Reminder
                        </button>
                    </div>

                    <div className="glass-clear" style={{ padding: '24px' }}>
                        <h3 className="card-title mb-md" style={{ color: 'white' }}>Notification Settings</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <label className="flex items-center justify-between" style={{ cursor: 'pointer', color: 'white' }}>
                                <span style={{ fontSize: '0.9375rem' }}>Web Push</span>
                                <div className="toggle active" style={{ background: '#4ade80' }}></div>
                            </label>
                            <label className="flex items-center justify-between" style={{ cursor: 'pointer', color: 'white' }}>
                                <span style={{ fontSize: '0.9375rem' }}>Email Notifications</span>
                                <div className="toggle" style={{ background: 'rgba(255,255,255,0.2)' }}></div>
                            </label>
                            <label className="flex items-center justify-between" style={{ cursor: 'pointer', color: 'white' }}>
                                <span style={{ fontSize: '0.9375rem' }}>Telegram Bot</span>
                                <div className="toggle" style={{ background: 'rgba(255,255,255,0.2)' }}></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
