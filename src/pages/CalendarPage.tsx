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
        <div className="page-content fade-in">
            <div className="page-title">
                <h1>Calendar</h1>
                <p className="text-secondary">Visualize your workload schedule</p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-lg">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{monthName}</h2>
                    <div className="flex items-center gap-md">
                        <div className="flex items-center gap-sm" style={{
                            background: 'var(--bg-main)',
                            padding: '4px',
                            borderRadius: '8px'
                        }}>
                            <button className="btn btn-sm btn-ghost">Month</button>
                            <button className="btn btn-sm btn-primary">Week</button>
                            <button className="btn btn-sm btn-ghost">Day</button>
                        </div>
                        <button className="btn btn-ghost">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="btn btn-ghost">
                            <ChevronRight size={20} />
                        </button>
                        <button className="btn btn-primary">
                            <Plus size={18} />
                            New Event
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '1px',
                    background: 'var(--border-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    overflow: 'hidden'
                }}>
                    {/* Day headers */}
                    {daysOfWeek.map(day => (
                        <div
                            key={day}
                            style={{
                                background: 'var(--bg-main)',
                                padding: '12px',
                                textAlign: 'center',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)'
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
                                background: day ? 'white' : 'var(--bg-main)',
                                padding: '12px',
                                minHeight: '100px',
                                cursor: day ? 'pointer' : 'default',
                                transition: 'all 0.15s',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => {
                                if (day) e.currentTarget.style.background = 'var(--bg-main)';
                            }}
                            onMouseLeave={(e) => {
                                if (day) e.currentTarget.style.background = 'white';
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
                                            color: day === 6 ? 'var(--primary)' : 'var(--text-primary)'
                                        }}>
                                            {day}
                                        </span>
                                        {day === 6 && (
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: 'var(--primary)'
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
                                                background: 'var(--primary)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500'
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
