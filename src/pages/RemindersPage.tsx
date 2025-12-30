import { useState, useEffect } from 'react';
import { Bell, Trash2, Check } from 'lucide-react';
import { useReminders } from '../hooks/useFirestore';
import { format } from 'date-fns';
import type { RepeatFrequency } from '../types';

export default function RemindersPage() {
    const { reminders, loading, addReminder, deleteReminder, updateReminder } = useReminders();

    // Form State
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [repeat, setRepeat] = useState<RepeatFrequency>('None');

    // Better responsiveness with more breakpoints
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1200;
    const isSmallPhone = width < 480;

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
        <div className="page-content fade-in" style={{ padding: 0 }}>
            <div style={{
                maxWidth: '1600px',
                margin: '0 auto',
                padding: isSmallPhone ? '24px 16px' : isMobile ? '32px 24px' : '40px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div className="page-title" style={{ marginBottom: isMobile ? '32px' : '48px' }}>
                    <h1 style={{
                        fontSize: isSmallPhone ? '2rem' : isMobile ? '2.5rem' : '3.5rem',
                        fontWeight: '600',
                        letterSpacing: '-1px',
                        color: 'white',
                        marginBottom: '8px'
                    }}>Reminders</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? '1rem' : '1.2rem' }}>Manage your notifications and alerts</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: width < 1200 ? '1fr' : 'repeat(3, 1fr)',
                    gap: isMobile ? '24px' : '32px',
                    alignItems: 'start'
                }}>
                    {/* Reminders Timeline */}
                    <div style={{ gridColumn: width < 1200 ? 'span 1' : 'span 2' }}>
                        <div className="glass-clear" style={{ padding: isMobile ? '20px' : '30px' }}>
                            <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '30px' }}>
                                <h3 style={{ color: 'white', fontWeight: '600', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>Reminders Timeline</h3>
                            </div>
                            <div style={{ position: 'relative', paddingLeft: isSmallPhone ? '20px' : '40px' }}>
                                {/* Timeline line */}
                                <div style={{
                                    position: 'absolute',
                                    left: isSmallPhone ? '9px' : '19px',
                                    top: '20px',
                                    bottom: '20px',
                                    width: '2px',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.1))'
                                }}></div>

                                {loading ? (
                                    <div style={{ color: 'white' }}>Loading reminders...</div>
                                ) : reminders.length === 0 ? (
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>No pending reminders. Add one from the sidebar.</div>
                                ) : (
                                    reminders.sort((a, b) => a.time.getTime() - b.time.getTime()).map((reminder) => (
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
                                                left: isSmallPhone ? '-15px' : '-29px',
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
                                                    padding: isMobile ? '16px' : '24px',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    background: 'rgba(255,255,255,0.08)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'start',
                                                    gap: '12px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isMobile) {
                                                        e.currentTarget.style.transform = 'translateX(8px)';
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isMobile) {
                                                        e.currentTarget.style.transform = 'translateX(0)';
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                                    }
                                                }}
                                            >
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div className="flex items-center gap-sm mb-sm" style={{ flexWrap: 'wrap' }}>
                                                        <Bell size={14} style={{ color: 'white', flexShrink: 0 }} />
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'white' }}>
                                                            {format(reminder.time, isSmallPhone ? 'h:mm a' : 'MMM d, h:mm a')}
                                                        </span>
                                                        <span className="badge" style={{
                                                            background: reminder.status === 'pending' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(74, 222, 128, 0.2)',
                                                            color: reminder.status === 'pending' ? '#fbbf24' : '#4ade80',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            fontSize: '0.7rem',
                                                            padding: '2px 8px'
                                                        }}>
                                                            {reminder.status}
                                                        </span>
                                                    </div>
                                                    <h4 style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '600', marginBottom: '6px', color: 'white', wordBreak: 'break-word' }}>
                                                        {reminder.title}
                                                    </h4>
                                                    {reminder.notes && (
                                                        <p style={{ fontSize: '0.85rem', marginBottom: '12px', color: 'rgba(255,255,255,0.7)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                            {reminder.notes}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-xs" style={{ flexWrap: 'wrap' }}>
                                                        <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.7rem' }}>
                                                            {reminder.repeat}
                                                        </span>
                                                        {reminder.notificationType.map(type => (
                                                            <span key={type} className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.7rem' }}>
                                                                {type}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-sm" style={{ flexShrink: 0 }}>
                                                    <button
                                                        className="btn btn-sm btn-ghost"
                                                        onClick={() => handleToggleStatus(reminder.id, reminder.status)}
                                                        style={{
                                                            color: reminder.status === 'pending' ? 'white' : '#4ade80',
                                                            padding: '8px',
                                                            minWidth: '36px',
                                                            height: '36px'
                                                        }}
                                                        title={reminder.status === 'pending' ? 'Mark as sent/done' : 'Mark as pending'}
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-ghost"
                                                        onClick={() => deleteReminder(reminder.id)}
                                                        style={{
                                                            color: '#fca5a5',
                                                            padding: '8px',
                                                            minWidth: '36px',
                                                            height: '36px'
                                                        }}
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
                    <div style={{ display: 'grid', gridTemplateColumns: isTablet ? 'repeat(2, 1fr)' : '1fr', gap: isMobile ? '24px' : '32px' }}>
                        <div className="glass-clear" style={{ padding: '24px' }}>
                            <h3 className="card-title mb-md" style={{ color: 'white', fontSize: '1.2rem' }}>Quick Add</h3>
                            <div className="form-group">
                                <label className="form-label" style={{ color: 'white', fontSize: '0.85rem' }}>Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Reminder title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)', padding: '12px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ color: 'white', fontSize: '0.85rem' }}>Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-input"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)', padding: '12px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ color: 'white', fontSize: '0.85rem' }}>Repeat</label>
                                <select
                                    className="form-select"
                                    value={repeat}
                                    onChange={e => setRepeat(e.target.value as RepeatFrequency)}
                                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)', padding: '12px' }}
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
                                    background: 'white', color: '#667eea', fontWeight: '700', border: 'none',
                                    padding: '16px',
                                    fontSize: '1rem',
                                    borderRadius: '14px',
                                    opacity: (!title || !time) ? 0.6 : 1, cursor: (!title || !time) ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                }}
                            >
                                Create Reminder
                            </button>
                        </div>

                        <div className="glass-clear" style={{ padding: '24px' }}>
                            <h3 className="card-title mb-md" style={{ color: 'white', fontSize: '1.2rem' }}>Notifications</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <label className="flex items-center justify-between" style={{ cursor: 'pointer', color: 'white' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Web Push</span>
                                    <div className="toggle active" style={{ background: '#4ade80' }}></div>
                                </label>
                                <label className="flex items-center justify-between" style={{ cursor: 'pointer', color: 'white' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Email Notifications</span>
                                    <div className="toggle" style={{ background: 'rgba(255,255,255,0.2)' }}></div>
                                </label>
                                <label className="flex items-center justify-between" style={{ cursor: 'pointer', color: 'white' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Telegram Bot</span>
                                    <div className="toggle" style={{ background: 'rgba(255,255,255,0.2)' }}></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
