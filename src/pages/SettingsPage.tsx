import { User, Bell, Link2, Database, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="page-content fade-in">
            <div className="page-title">
                <h1>Settings</h1>
                <p className="text-secondary">Configure your application preferences</p>
            </div>

            <div className="grid grid-3" style={{ gap: '24px', alignItems: 'start' }}>
                {/* Settings Tabs */}
                <div className="card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {[
                            { icon: User, label: 'Profile', active: true },
                            { icon: Bell, label: 'Notifications', active: false },
                            { icon: Link2, label: 'Integrations', active: false },
                            { icon: Database, label: 'Data', active: false },
                        ].map(({ icon: Icon, label, active }) => (
                            <div
                                key={label}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    background: active ? 'var(--bg-main)' : 'transparent',
                                    color: active ? 'var(--primary)' : 'var(--text-primary)',
                                    fontWeight: active ? '600' : '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                }}
                            >
                                <Icon size={20} />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Settings Content */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="card">
                        <h3 className="card-title mb-lg">Profile Settings</h3>

                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                defaultValue="John Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                defaultValue="john.doe@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Timezone</label>
                            <select className="form-select">
                                <option>UTC-8 (Pacific Time)</option>
                                <option>UTC-5 (Eastern Time)</option>
                                <option>UTC+0 (GMT)</option>
                                <option>UTC+5:30 (IST)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Working Hours</label>
                            <div className="flex gap-md">
                                <input
                                    type="time"
                                    className="form-input"
                                    defaultValue="09:00"
                                />
                                <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>to</span>
                                <input
                                    type="time"
                                    className="form-input"
                                    defaultValue="17:00"
                                />
                            </div>
                        </div>

                        <button className="btn btn-primary">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>

                    <div className="card mt-lg">
                        <h3 className="card-title mb-lg">Notification Preferences</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <label className="flex items-center justify-between" style={{ cursor: 'pointer' }}>
                                <div>
                                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>Web Push Notifications</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        Receive browser notifications for tasks and reminders
                                    </div>
                                </div>
                                <div className="toggle active"></div>
                            </label>

                            <label className="flex items-center justify-between" style={{ cursor: 'pointer' }}>
                                <div>
                                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>Email Notifications</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        Get email alerts for important updates
                                    </div>
                                </div>
                                <div className="toggle"></div>
                            </label>

                            <label className="flex items-center justify-between" style={{ cursor: 'pointer' }}>
                                <div>
                                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>Daily Summary</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        Receive daily task summary at end of day
                                    </div>
                                </div>
                                <div className="toggle active"></div>
                            </label>
                        </div>
                    </div>

                    <div className="card mt-lg">
                        <h3 className="card-title mb-lg">Integrations</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{
                                padding: '16px',
                                background: 'var(--bg-main)',
                                borderRadius: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Google Calendar</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        Sync tasks with your calendar
                                    </div>
                                </div>
                                <button className="btn btn-sm btn-primary">Connect</button>
                            </div>

                            <div style={{
                                padding: '16px',
                                background: 'var(--bg-main)',
                                borderRadius: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Telegram Bot</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        Receive reminders via Telegram
                                    </div>
                                </div>
                                <button className="btn btn-sm btn-outline">Configure</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
