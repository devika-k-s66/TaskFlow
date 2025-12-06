import { Plus, Edit2, Repeat, Clock } from 'lucide-react';
import { mockRoutines } from '../data/mockData';

export default function RoutinesPage() {
    return (
        <div className="page-content fade-in">
            <div className="page-title flex justify-between items-center">
                <div>
                    <h1>Smart Routines</h1>
                    <p className="text-secondary">Manage your daily, weekly, and monthly routines</p>
                </div>
                <button className="btn btn-primary btn-lg">
                    <Plus size={20} />
                    Create Routine
                </button>
            </div>

            <div className="grid grid-3" style={{ gap: '24px' }}>
                {mockRoutines.map(routine => (
                    <div key={routine.id} className="glass-card">
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
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                                        {routine.name}
                                    </h3>
                                    <p className="flex items-center gap-sm text-muted" style={{ fontSize: '0.8125rem' }}>
                                        <Clock size={12} />
                                        {routine.repeat}
                                    </p>
                                </div>
                            </div>
                            <div className={`toggle ${routine.enabled ? 'active' : ''}`}></div>
                        </div>

                        <div style={{
                            background: 'rgba(255, 149, 0, 0.05)',
                            borderRadius: '10px',
                            padding: '16px',
                            marginBottom: '16px'
                        }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
                                Tasks in routine:
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {routine.tasks.slice(0, 3).map(task => (
                                    <div key={task.id} className="flex items-center gap-sm">
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: 'var(--primary)'
                                        }}></div>
                                        <span style={{ fontSize: '0.875rem' }}>{task.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="btn btn-sm btn-ghost w-full">
                            <Edit2 size={16} />
                            Edit Routine
                        </button>
                    </div>
                ))}

                {/* Add New Routine Card */}
                <div
                    className="card"
                    style={{
                        border: '2px dashed var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '280px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.background = 'rgba(10, 132, 255, 0.02)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.background = 'white';
                    }}
                >
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'var(--bg-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px'
                    }}>
                        <Plus size={32} style={{ color: 'var(--primary)' }} />
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                        Create New Routine
                    </h3>
                    <p className="text-muted" style={{ textAlign: 'center' }}>
                        Build repeating task sequences
                    </p>
                </div>
            </div>
        </div>
    );
}
