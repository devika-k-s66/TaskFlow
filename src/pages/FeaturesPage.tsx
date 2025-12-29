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
                "Example: 'Every weekday at 9 AM, prepare my work tasks'"
            ],
            icon: <Sparkles size={40} />,
            color: "#667eea"
        },
        {
            title: "Organized in One Place",
            description: "No more scattered notes or forgotten work. Everything you need — clear, simple, and structured.",
            details: [
                "Priority-based task management",
                "Due dates, recurring tasks, tags & categories",
                "Track progress and completions easily"
            ],
            icon: <Layers size={40} />,
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
            icon: <CheckCircle size={40} />,
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
            icon: <Clock size={40} />,
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
            icon: <Calendar size={40} />,
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
            icon: <BarChart2 size={40} />,
            color: "#ec4899"
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <HeroSection />

            <section className="section-padding">
                <div className="section-title">
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>Powerful Features</h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>Everything you need to master your workflow</p>
                </div>

                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="feature-card">
                            <div className="feature-icon-wrapper" style={{ color: f.color, background: 'rgba(255,255,255,0.9)' }}>
                                {f.icon}
                            </div>
                            <h3>{f.title}</h3>
                            <p style={{ marginBottom: '20px' }}>{f.description}</p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {f.details.map((detail, idx) => (
                                    <li key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'start',
                                        gap: '10px',
                                        marginBottom: '10px',
                                        color: 'rgba(255,255,255,0.85)',
                                        fontSize: '0.95rem'
                                    }}>
                                        <div style={{ marginTop: '5px', width: '6px', height: '6px', borderRadius: '50%', background: f.color }} />
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
