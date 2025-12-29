import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function CalendarPage() {
    const [currentDate] = useState(new Date(2025, 11, 6));

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Generate calendar days
    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const days = getDaysInMonth();

    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div className="page-title">
                <h1 style={{
                    fontSize: '3rem', fontWeight: '600', letterSpacing: '-1px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>Calendar</h1>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem' }}>Visualize your workload schedule</p>
            </div>

            <div className="glass-clear" style={{ padding: '32px' }}>
                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-lg">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>{monthName}</h2>
                    <div className="flex items-center gap-md">
                        <div className="flex items-center gap-sm" style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '4px',
                            borderRadius: '8px'
                        }}>
                            <button className="btn btn-sm" style={{ background: 'transparent', color: 'white', border: 'none' }}>Month</button>
                            <button className="btn btn-sm" style={{ background: 'white', color: '#667eea', fontWeight: '600', border: 'none' }}>Week</button>
                            <button className="btn btn-sm" style={{ background: 'transparent', color: 'white', border: 'none' }}>Day</button>
                        </div>
                        <button className="btn" style={{ background: 'transparent', color: 'white', border: 'none', padding: '8px' }}>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="btn" style={{ background: 'transparent', color: 'white', border: 'none', padding: '8px' }}>
                            <ChevronRight size={20} />
                        </button>
                        <button className="btn btn-primary" style={{ background: 'white', color: '#667eea', fontWeight: '600', border: 'none' }}>
                            <Plus size={18} style={{ marginRight: '8px' }} />
                            New Event
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '1px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    overflow: 'hidden'
                }}>
                    {/* Day headers */}
                    {daysOfWeek.map(day => (
                        <div
                            key={day}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '12px',
                                textAlign: 'center',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                color: 'rgba(255,255,255,0.8)'
                            }}
                        >
                            {day}
                        </div>
                    ))}

                    {/* Calendar days */}
                    {days.map((day, index) => (
                        <div
                            key={index}
                            style={{
                                background: day ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                                padding: '12px',
                                minHeight: '100px',
                                cursor: day ? 'pointer' : 'default',
                                transition: 'all 0.15s',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => {
                                if (day) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                if (day) e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            }}
                        >
                            {day && (
                                <>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '8px'
                                    }}>
                                        <span style={{
                                            fontWeight: day === 6 ? '700' : '500',
                                            fontSize: '0.9375rem',
                                            color: day === 6 ? 'white' : 'rgba(255,255,255,0.7)'
                                        }}>
                                            {day}
                                        </span>
                                        {day === 6 && (
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: '#667eea'
                                            }}></div>
                                        )}
                                    </div>
                                    {/* Event indicators */}
                                    {(day === 7 || day === 14 || day === 21) && (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px'
                                        }}>
                                            <div style={{
                                                background: 'rgba(102, 126, 234, 0.3)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                border: '1px solid rgba(102, 126, 234, 0.3)'
                                            }}>
                                                Team meeting
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
