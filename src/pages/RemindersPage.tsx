import { Plus, Bell } from 'lucide-react';
import { mockReminders } from '../data/mockData';
import { format } from 'date-fns';

export default function RemindersPage() {
    return (
        <div className="page-content fade-in">
            <div className="page-title flex justify-between items-center">
                <div>
                    <h1>Reminders</h1>
                    <p className="text-secondary">Manage your notifications and alerts</p>
                </div>
                <button className="btn btn-primary btn-lg">
                    <Plus size={20} />
                    Add Reminder
                </button>
            </div>

            <div className="grid grid-3" style={{ gap: '24px', alignItems: 'start' }}>
                {/* Reminders Timeline */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Reminders Timeline</h3>
                        </div>
                        <div style={{ position: 'relative', paddingLeft: '40px' }}>
                            {/* Timeline line */}
                            <div style={{
                                position: 'absolute',
                                left: '19px',
                                top: '20px',
                                bottom: '20px',
                                width: '2px',
                                background: 'linear-gradient(180deg, var(--primary), var(--primary-light))'
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
                                        top: '8px',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: reminder.status === 'pending' ? 'var(--primary)' : 'var(--success)',
                                        border: '3px solid white',
                                        boxShadow: '0 0 0 2px var(--primary)'
                                    }}></div>

                                    {/* Reminder card */}
                                    <div
                                        className="card"
                                        style={{
                                            padding: '16px 20px',
                                            background: 'var(--bg-white)',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateX(8px)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateX(0)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div style={{ flex: 1 }}>
                                                <div className="flex items-center gap-md mb-sm">
                                                    <Bell size={16} style={{ color: 'var(--primary)' }} />
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)' }}>
                                                        {format(reminder.time, 'h:mm a')}
                                                    </span>
                                                    <span className={`badge badge-${reminder.status === 'pending' ? 'warning' : 'success'}`}>
                                                        {reminder.status}
                                                    </span>
                                                </div>
                                                <h4 style={{ fontSize: '1.0rem', fontWeight: '600', marginBottom: '6px' }}>
                                                    {reminder.title}
                                                </h4>
                                                {reminder.notes && (
                                                    <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
                                                        {reminder.notes}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-sm">
                                                    <span className="badge badge-primary">{reminder.repeat}</span>
                                                    {reminder.notificationType.map(type => (
                                                        <span key={type} className="badge badge-primary">{type}</span>
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
                    <div className="card mb-lg">
                        <h3 className="card-title mb-md">Quick Add Reminder</h3>
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input type="text" className="form-input" placeholder="Reminder title" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Time</label>
                            <input type="datetime-local" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Repeat</label>
                            <select className="form-select">
                                <option>None</option>
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                        <button className="btn btn-primary w-full">Create Reminder</button>
                    </div>

                    <div className="card">
                        <h3 className="card-title mb-md">Notification Settings</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label className="flex items-center justify-between" style={{ cursor: 'pointer' }}>
                                <span style={{ fontSize: '0.9375rem' }}>Web Push</span>
                                <div className="toggle active"></div>
                            </label>
                            <label className="flex items-center justify-between" style={{ cursor: 'pointer' }}>
                                <span style={{ fontSize: '0.9375rem' }}>Email Notifications</span>
                                <div className="toggle"></div>
                            </label>
                            <label className="flex items-center justify-between" style={{ cursor: 'pointer' }}>
                                <span style={{ fontSize: '0.9375rem' }}>Telegram Bot</span>
                                <div className="toggle"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
