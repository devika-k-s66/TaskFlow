import React from 'react';
import HeroSection from '../components/HeroSection';
import { GraduationCap, Briefcase, PenTool, Home, Heart, Brain } from 'lucide-react';
import './LandingPage.css';

const SolutionsPage: React.FC = () => {
    const audiences = [
        {
            title: "Students",
            desc: "Study routines, exam tracking, focus planning.",
            icon: <GraduationCap size={32} />,
            tag: "Education",
            color: "#667eea"
        },
        {
            title: "Professionals",
            desc: "Meeting-based tasks, workday automations, deadlines.",
            icon: <Briefcase size={32} />,
            tag: "Work",
            color: "#3b82f6"
        },
        {
            title: "Freelancers & Creators",
            desc: "Project tracking, flexible routines, time awareness.",
            icon: <PenTool size={32} />,
            tag: "Creative",
            color: "#f59e0b"
        },
        {
            title: "Homemakers",
            desc: "Simple daily planning, family schedules, reminders.",
            icon: <Home size={32} />,
            tag: "Lifestyle",
            color: "#10b981"
        },
        {
            title: "Elders & Beginners",
            desc: "Clean interface, large text, guided setup.",
            icon: <Heart size={32} />,
            tag: "Accessibility",
            color: "#ec4899"
        },
        {
            title: "ADHD & Overwhelmed",
            desc: "Minimal views, one-task focus, gentle reminders.",
            icon: <Brain size={32} />,
            tag: "Focus",
            color: "#8b5cf6"
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <HeroSection />

            <section className="section-padding">
                <div className="section-title">
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>Designed for Everyone</h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>Tailored solutions for every lifestyle</p>
                </div>

                <div className="audience-grid">
                    {audiences.map((a, i) => (
                        <div key={i} className="audience-card" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <span className="audience-tag" style={{ background: a.color, color: 'white' }}>{a.tag}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ color: 'white', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                                    {a.icon}
                                </div>
                                <h3 style={{ margin: 0, color: 'white', fontSize: '1.4rem' }}>{a.title}</h3>
                            </div>
                            <p style={{ margin: 0, fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>{a.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default SolutionsPage;
