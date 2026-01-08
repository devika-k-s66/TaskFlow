import React from 'react';
import HeroSection from '../components/HeroSection';
import { Sparkles, CheckCircle, Clock, Calendar, BarChart2, Layers } from 'lucide-react';
import './LandingPage.css'; // Reuse landing page styles

const FeaturesPage: React.FC = () => {
    const features = [
        {
            title: "Automate Your Daily Life",
            description: "Instead of manually managing tasks, the system works for you. Create smart automations using Trigger → Condition → Action.",
            details: [
                "Automatically create tasks, routines, and reminders",
                "Let the system handle repetitive planning",
                "Example: 'Every weekday at 9 AM, get tasks ready'"
            ],
            icon: <Sparkles size={32} />,
            color: "var(--primary)"
        },
        {
            title: "Organized in One Place",
            description: "No more scattered notes or forgotten work. Everything you need — clear, simple, and structured.",
            details: [
                "Priority-based task management",
                "Due dates, recurring tasks, tags & categories",
                "Track progress and completions easily"
            ],
            icon: <Layers size={32} />,
            color: "#3b82f6"
        },
        {
            title: "Build Healthy Routines",
            description: "Turn habits into systems. Start small, stay consistent, and improve naturally.",
            details: [
                "Morning, evening, and custom routines",
                "Task bundles that repeat automatically",
                "One-click enable or disable"
            ],
            icon: <CheckCircle size={32} />,
            color: "#10b981"
        },
        {
            title: "Never Miss Important Things",
            description: "Smart reminders that respect your time. The system reminds you at the right time, not all the time.",
            details: [
                "Visual reminder timeline",
                "Notifications via Web, Email, and Telegram",
                "Snooze, repeat, or escalate reminders"
            ],
            icon: <Clock size={32} />,
            color: "#f59e0b"
        },
        {
            title: "Smart Calendar",
            description: "Visualize everything at a glance. Plan better days without overloading yourself.",
            details: [
                "Month, Week, and Day views",
                "Tasks, routines, and events together",
                "Drag-and-drop scheduling & Clear indicators"
            ],
            icon: <Calendar size={32} />,
            color: "#8b5cf6"
        },
        {
            title: "Learn From Productivity",
            description: "Understand yourself, not just your tasks. Get meaningful insights that help you work smarter.",
            details: [
                "Completion rate charts & Activity heatmaps",
                "Productivity insights",
                "Automation impact tracking"
            ],
            icon: <BarChart2 size={32} />,
            color: "#ec4899"
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--gradient-main)'
        }}>
            <HeroSection />

            <section className="section-padding" style={{ paddingTop: '80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 className="section-title" style={{ marginBottom: '24px' }}>Powerful Features</h2>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'rgba(255,255,255,0.7)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Everything you need to master your workflow, built with precision and care.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="feature-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="feature-icon-wrapper" style={{
                                color: f.color === '#667eea' ? 'var(--primary)' : f.color,
                                marginBottom: '24px'
                            }}>
                                {f.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{f.title}</h3>
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                lineHeight: '1.7',
                                marginBottom: '24px',
                                fontSize: '1rem'
                            }}>
                                {f.description}
                            </p>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                paddingTop: '20px',
                                marginTop: 'auto'
                            }}>
                                {f.details.map((detail, idx) => (
                                    <li key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'start',
                                        gap: '12px',
                                        marginBottom: '12px',
                                        color: '#94a3b8',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5'
                                    }}>
                                        <div style={{
                                            marginTop: '8px',
                                            minWidth: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: f.color === 'var(--primary)' ? '#667eea' : f.color
                                        }} />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default FeaturesPage;
