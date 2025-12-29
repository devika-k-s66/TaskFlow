import { Plus, Edit2, Repeat, Clock } from 'lucide-react';
import { mockRoutines } from '../data/mockData';

export default function RoutinesPage() {
    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div className="page-title flex justify-between items-center">
                <div>
                    <h1 style={{
                        fontSize: '3rem', fontWeight: '600', letterSpacing: '-1px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>Smart Routines</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem' }}>Manage your daily, weekly, and monthly routines</p>
                </div>
                <button className="btn btn-lg" style={{
                    background: 'white', color: '#667eea', fontWeight: '600', border: 'none',
                    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <Plus size={20} />
                    Create Routine
                </button>
            </div>

            <div className="grid grid-3" style={{ gap: '24px' }}>
                {mockRoutines.map(routine => (
                    <div key={routine.id} className="glass-clear" style={{ padding: '24px' }}>
                        <div className="flex justify-between items-start mb-md">
                            <div className="flex items-center gap-md">
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #FF9500, #FFB340)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <Repeat size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white' }}>
                                        {routine.name}
                                    </h3>
                                    <p className="flex items-center gap-sm" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>
                                        <Clock size={12} />
                                        {routine.repeat}
                                    </p>
                                </div>
                            </div>
                            <div className={`toggle ${routine.enabled ? 'active' : ''}`} style={{ background: routine.enabled ? '#4ade80' : 'rgba(255,255,255,0.2)' }}></div>
                        </div>

                        <div style={{
                            background: 'rgba(255, 149, 0, 0.05)',
                            borderRadius: '10px',
                            padding: '16px',
                            marginBottom: '16px',
                            border: '1px solid rgba(255,149,0,0.1)'
                        }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '12px', color: 'white' }}>
                                Tasks in routine:
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {routine.tasks.slice(0, 3).map(task => (
                                    <div key={task.id} className="flex items-center gap-sm">
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: '#fbbf24'
                                        }}></div>
                                        <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>{task.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="btn btn-sm w-full" style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <Edit2 size={16} style={{ marginRight: '8px' }} />
                            Edit Routine
                        </button>
                    </div>
                ))}

                {/* Add New Routine Card */}
                <div
                    className="glass-clear"
                    style={{
                        padding: '24px',
                        border: '2px dashed rgba(255,255,255,0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '280px',
                        transition: 'all 0.2s',
                        background: 'rgba(255,255,255,0.05)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'white';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                >
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px'
                    }}>
                        <Plus size={32} style={{ color: 'white' }} />
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
                        Create New Routine
                    </h3>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                        Build repeating task sequences
                    </p>
                </div>
            </div>
        </div>
    );
}
