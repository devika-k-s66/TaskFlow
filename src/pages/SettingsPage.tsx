import { User, Bell, Link2, Database, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div className="page-title">
                <h1 style={{
                    fontSize: '3rem', fontWeight: '600', letterSpacing: '-1px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>Settings</h1>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem' }}>Configure your application preferences</p>
            </div>

            <div className="grid grid-3" style={{ gap: '24px', alignItems: 'start' }}>
                {/* Settings Tabs */}
                <div className="glass-clear" style={{ padding: '24px' }}>
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
                                    background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                                    color: 'white',
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
                    <div className="glass-clear" style={{ padding: '30px' }}>
                        <h3 className="card-title mb-lg" style={{ color: 'white' }}>Profile Settings</h3>

                        <div className="form-group">
                            <label className="form-label" style={{ color: 'white' }}>Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                defaultValue="John Doe"
                                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ color: 'white' }}>Email</label>
                            <input
                                type="email"
                                className="form-input"
                                defaultValue="john.doe@example.com"
                                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ color: 'white' }}>Timezone</label>
                            <select className="form-select" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }}>
                                <option style={{ color: 'black' }}>UTC-8 (Pacific Time)</option>
                                <option style={{ color: 'black' }}>UTC-5 (Eastern Time)</option>
                                <option style={{ color: 'black' }}>UTC+0 (GMT)</option>
                                <option style={{ color: 'black' }}>UTC+5:30 (IST)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ color: 'white' }}>Working Hours</label>
                            <div className="flex gap-md">
                                <input
                                    type="time"
                                    className="form-input"
                                    defaultValue="09:00"
                                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }}
                                />
                                <span style={{ alignSelf: 'center', color: 'white' }}>to</span>
                                <input
                                    type="time"
                                    className="form-input"
                                    defaultValue="17:00"
                                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }}
                                />
                            </div>
                        </div>

                        <button className="btn btn-lg" style={{ background: 'white', color: '#667eea', fontWeight: '600', border: 'none', marginTop: '20px' }}>
                            <Save size={18} style={{ marginRight: '8px' }} />
                            Save Changes
                        </button>
                    </div>

                    <div className="glass-clear mt-lg" style={{ padding: '30px' }}>
                        <h3 className="card-title mb-lg" style={{ color: 'white' }}>Notification Preferences</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <label className="flex items-center justify-between" style={{ cursor: 'pointer' }}>
                                <div>
                                    <div style={{ fontWeight: '500', marginBottom: '4px', color: 'white' }}>Web Push Notifications</div>
                                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                                        Receive browser notifications for tasks and reminders
                                    </div>
                                </div>
                                <div className="toggle active" style={{ background: '#4ade80' }}></div>
                            </label>

                            <label className="flex items-center justify-between" style={{ cursor: 'pointer' }}>
                                <div>
                                    <div style={{ fontWeight: '500', marginBottom: '4px', color: 'white' }}>Email Notifications</div>
                                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                                        Get email alerts for important updates
                                    </div>
                                </div>
                                <div className="toggle" style={{ background: 'rgba(255,255,255,0.2)' }}></div>
                            </label>

                            <label className="flex items-center justify-between" style={{ cursor: 'pointer' }}>
                                <div>
                                    <div style={{ fontWeight: '500', marginBottom: '4px', color: 'white' }}>Daily Summary</div>
                                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                                        Receive daily task summary at end of day
                                    </div>
                                </div>
                                <div className="toggle active" style={{ background: '#4ade80' }}></div>
                            </label>
                        </div>
                    </div>

                    <div className="glass-clear mt-lg" style={{ padding: '30px' }}>
                        <h3 className="card-title mb-lg" style={{ color: 'white' }}>Integrations</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{
                                padding: '20px',
                                background: 'rgba(255,255,255,0.08)',
                                borderRadius: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '4px', color: 'white' }}>Google Calendar</div>
                                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                                        Sync tasks with your calendar
                                    </div>
                                </div>
                                <button className="btn btn-sm" style={{ background: 'white', color: '#667eea', fontWeight: '600' }}>Connect</button>
                            </div>

                            <div style={{
                                padding: '20px',
                                background: 'rgba(255,255,255,0.08)',
                                borderRadius: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '4px', color: 'white' }}>Telegram Bot</div>
                                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                                        Receive reminders via Telegram
                                    </div>
                                </div>
                                <button className="btn btn-sm" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'white' }}>Configure</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
