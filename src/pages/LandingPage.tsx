import { useNavigate } from 'react-router-dom';
import {
    Zap,
    CheckCircle,
    BarChart3,
    Clock,
    Calendar,
    Shield,
    Users,
    Brain,
    Briefcase,
    GraduationCap,
    Home,
    Heart,
    ArrowRight
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import './LandingPage.css';

export default function LandingPage() {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Zap size={30} />,
            title: 'Automates Your Daily Life',
            description: 'Instead of manually managing tasks, the system works for you. Create smart automations using Trigger → Condition → Action.',
            example: '“Every weekday at 9 AM, prepare my work tasks automatically.”',
            color: 'var(--primary)'
        },
        {
            icon: <CheckCircle size={30} />,
            title: 'Keeps Tasks Organized',
            description: 'No more scattered notes. Priority-based task management with due dates, recurring tasks, tags & categories.',
            example: 'Track progress and completions effortlessly in one structure.',
            color: '#10b981'
        },
        {
            icon: <Shield size={30} />,
            title: 'Builds Healthy Routines',
            description: 'Turn habits into systems. Morning, evening, and custom routines with task bundles that repeat automatically.',
            example: 'One-click enable or disable routines to stay consistent.',
            color: '#f59e0b'
        },
        {
            icon: <Clock size={30} />,
            title: 'Never Miss Important Things',
            description: 'Smart reminders that respect your time. Visual reminder timeline with notifications via Web, Email, and Telegram.',
            example: 'Snooze, repeat, or escalate reminders when you need it.',
            color: '#ef4444'
        },
        {
            icon: <Calendar size={30} />,
            title: 'Smart Calendar Views',
            description: 'Visualize everything at a glance. Month, Week, and Day views with tasks, routines, and events together.',
            example: 'Drag-and-drop scheduling to plan better days.',
            color: '#8b5cf6'
        },
        {
            icon: <BarChart3 size={30} />,
            title: 'Learn From Productivity',
            description: 'Understand yourself with completion rate charts, activity heatmaps, and automation impact tracking.',
            example: 'Get meaningful insights to help you work smarter.',
            color: '#3b82f6'
        }
    ];

    const audiences = [
        {
            icon: <GraduationCap size={24} />,
            title: 'Students',
            desc: 'Study routines, exam tracking, focus planning.',
            tag: 'Learn'
        },
        {
            icon: <Briefcase size={24} />,
            title: 'Professionals',
            desc: 'Meeting-based tasks, workday automations, deadlines.',
            tag: 'Work'
        },
        {
            icon: <Users size={24} />,
            title: 'Freelancers',
            desc: 'Project tracking, flexible routines, time awareness.',
            tag: 'Build'
        },
        {
            icon: <Home size={24} />,
            title: 'Homemakers',
            desc: 'Simple daily planning, family schedules, reminders.',
            tag: 'Life'
        },
        {
            icon: <Heart size={24} />,
            title: 'Elders',
            desc: 'Clean interface, large text, guided setup.',
            tag: 'Care'
        },
        {
            icon: <Brain size={24} />,
            title: 'ADHD Users',
            desc: 'Minimal views, one-task focus, gentle reminders.',
            tag: 'Focus'
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--gradient-main)'
        }}>
            <HeroSection />

            <section className="section-padding">
                <h2 className="section-title">Everything you need to master your day</h2>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="feature-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="feature-icon-wrapper" style={{ color: f.color === '#667eea' ? 'var(--primary)' : f.color }}>
                                {f.icon}
                            </div>
                            <h3>{f.title}</h3>
                            <p>{f.description}</p>
                            <div className="feature-example">{f.example}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="audience-section section-padding">
                <h2 className="section-title">Designed for Everyone</h2>
                <div className="audience-grid">
                    {audiences.map((a, i) => (
                        <div key={i} className="audience-card">
                            <span className="audience-tag">{a.tag}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ color: 'var(--primary)' }}>{a.icon}</div>
                                <h4 style={{ margin: 0, fontWeight: 700 }}>{a.title}</h4>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>{a.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section-padding">
                <div className="visual-section">
                    <div className="visual-content">
                        <h2>Plan better days without overloading yourself</h2>
                        <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: '1.6' }}>
                            Our smart calendar and automation engine work together to find the perfect slots for your deep work, routines, and rest.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
                            {[
                                'Visual reminder timeline',
                                'Drag-and-drop scheduling',
                                'Automation impact tracking'
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontWeight: 500 }}>
                                    <CheckCircle size={20} color="#10b981" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="visual-mockup">
                        <img
                            src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1000"
                            alt="Calendar Mockup"
                            style={{ width: '100%', borderRadius: '20px' }}
                        />
                    </div>
                </div>
            </section>

            <section className="cta-banner section-padding">
                <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Ready to transform your life?</h2>
                <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
                    Join the TaskFlow community and start automating your productivity today.
                </p>
                <button className="cta-button" onClick={() => navigate('/login')}>
                    Start Your Journey <ArrowRight size={20} style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
                </button>
            </section>

            <footer style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', borderTop: '1px solid #e2e8f0' }}>
                <p>© 2025 TaskFlow. All rights reserved.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Twitter</a>
                </div>
            </footer>
        </div>
    );
}

