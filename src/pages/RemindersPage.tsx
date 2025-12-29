import { Plus, Bell } from 'lucide-react';
import { mockReminders } from '../data/mockData';
import { format } from 'date-fns';

export default function RemindersPage() {
    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div className="page-title flex justify-between items-center">
                <div>
                    <h1 style={{
                        fontSize: '3rem', fontWeight: '600', letterSpacing: '-1px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>Reminders</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem' }}>Manage your notifications and alerts</p>
                </div>
                <button className="btn btn-lg" style={{
                    background: 'white', color: '#667eea', fontWeight: '600', border: 'none',
                    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <Plus size={20} />
                    Add Reminder
                </button>
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
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.1))' /* White gradient for glass theme */
                            }}></div>

                            {mockReminders.map((reminder, index) => (
                                <div
                                    key={reminder.id}
                                    style={{
                                        position: 'relative',
                                        marginBottom: '24px',
                                        paddingBottom: index < mockReminders.length - 1 ? '24px' : '0'
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
                                        border: '3px solid rgba(255,255,255,0.2)', /* Glass border */
                                        boxShadow: '0 0 0 2px rgba(0,0,0,0.1)'
                                    }}></div>

                                    {/* Reminder card */}
                                    <div
                                        className="glass-clear"
                                        style={{
                                            padding: '24px',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            background: 'rgba(255,255,255,0.08)' /* Slightly darker nested glass */
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
                                        <div className="flex items-center justify-between">
                                            <div style={{ flex: 1 }}>
                                                <div className="flex items-center gap-md mb-sm">
                                                    <Bell size={16} style={{ color: 'white' }} />
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'white' }}>
                                                        {format(reminder.time, 'h:mm a')}
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
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Add Reminder & Settings */}
                <div>
                    <div className="glass-clear mb-lg" style={{ padding: '24px' }}>
                        <h3 className="card-title mb-md" style={{ color: 'white' }}>Quick Add Reminder</h3>
                        <div className="form-group">
                            <label className="form-label" style={{ color: 'white' }}>Title</label>
                            <input type="text" className="form-input" placeholder="Reminder title" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ color: 'white' }}>Time</label>
                            <input type="datetime-local" className="form-input" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ color: 'white' }}>Repeat</label>
                            <select className="form-select" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }}>
                                <option style={{ color: 'black' }}>None</option>
                                <option style={{ color: 'black' }}>Daily</option>
                                <option style={{ color: 'black' }}>Weekly</option>
                                <option style={{ color: 'black' }}>Monthly</option>
                            </select>
                        </div>
                        <button className="btn btn-lg w-full" style={{ background: 'white', color: '#667eea', fontWeight: '600', border: 'none' }}>Create Reminder</button>
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
