import { TrendingUp, Zap, Clock, Award } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const completionData = [
    { name: 'Mon', completed: 8 },
    { name: 'Tue', completed: 12 },
    { name: 'Wed', completed: 10 },
    { name: 'Thu', completed: 15 },
    { name: 'Fri', completed: 14 },
    { name: 'Sat', completed: 6 },
    { name: 'Sun', completed: 8 },
];

const activityData = [
    { hour: '6AM', tasks: 2 },
    { hour: '9AM', tasks: 8 },
    { hour: '12PM', tasks: 12 },
    { hour: '3PM', tasks: 15 },
    { hour: '6PM', tasks: 10 },
    { hour: '9PM', tasks: 5 },
];

export default function ReportsPage() {
    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div className="page-title">
                <h1 style={{
                    fontSize: '3rem', fontWeight: '600', letterSpacing: '-1px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>Reports & Analytics</h1>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem' }}>Track your productivity and automation impact</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-4 mb-lg">
                <div className="glass-clear" style={{ padding: '24px' }}>
                    <div className="flex items-center gap-md mb-md">
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #34C759, #66D97A)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Completion Rate</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white' }}>87%</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-clear" style={{ padding: '24px' }}>
                    <div className="flex items-center gap-md mb-md">
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #0A84FF, #4DA3FF)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}>
                            <Zap size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Tasks Automated</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white' }}>142</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-clear" style={{ padding: '24px' }}>
                    <div className="flex items-center gap-md mb-md">
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #FF9500, #FFB340)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Time Saved</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white' }}>12.5h</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-clear" style={{ padding: '24px' }}>
                    <div className="flex items-center gap-md mb-md">
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #FF3B30, #FF5E54)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}>
                            <Award size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Streak</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white' }}>21 days</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-2" style={{ gap: '24px', marginBottom: '24px' }}>
                <div className="glass-clear" style={{ padding: '30px' }}>
                    <h3 className="card-title mb-lg" style={{ color: 'white' }}>Daily Completion Rate</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={completionData}>
                            <defs>
                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'white' }} />
                            <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'white' }} />
                            <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: 'none', color: '#1e293b' }} />
                            <Area type="monotone" dataKey="completed" stroke="#0A84FF" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-clear" style={{ padding: '30px' }}>
                    <h3 className="card-title mb-lg" style={{ color: 'white' }}>Most Active Hours</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="hour" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'white' }} />
                            <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'white' }} />
                            <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: 'none', color: '#1e293b' }} />
                            <Bar dataKey="tasks" fill="#4ade80" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Automation Impact */}
            <div className="glass-clear" style={{ padding: '30px' }}>
                <h3 className="card-title mb-lg" style={{ color: 'white' }}>Automation Performance</h3>
                <div className="grid grid-3" style={{ gap: '24px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.1), rgba(10, 132, 255, 0.05))',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid rgba(10, 132, 255, 0.2)'
                    }}>
                        <p style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Tasks Auto-Generated</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white' }}>142</h2>
                        <p style={{ fontSize: '0.875rem', color: '#4ade80' }}>↑ 23% from last week</p>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.1), rgba(52, 199, 89, 0.05))',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid rgba(52, 199, 89, 0.2)'
                    }}>
                        <p style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Hours Saved Weekly</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white' }}>12.5</h2>
                        <p style={{ fontSize: '0.875rem', color: '#4ade80' }}>↑ 15% efficiency gain</p>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.1), rgba(255, 149, 0, 0.05))',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 149, 0, 0.2)'
                    }}>
                        <p style={{ marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Active Automations</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white' }}>8</h2>
                        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>Running 24/7</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
