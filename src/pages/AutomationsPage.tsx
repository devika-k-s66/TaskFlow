import { useState } from 'react';
import { Plus, Play, Edit2, Trash2, ArrowRight, Zap, Clock, CheckCircle } from 'lucide-react';
import { mockAutomations } from '../data/mockData';
import { format } from 'date-fns';

export default function AutomationsPage() {
    const [showBuilder, setShowBuilder] = useState(false);

    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div className="page-title flex justify-between items-center">
                <div>
                    <h1 style={{
                        fontSize: '3rem', fontWeight: '600', letterSpacing: '-1px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>Automations</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem' }}>Create intelligent workflows to automate your tasks</p>
                </div>
                <button className="btn btn-lg" style={{
                    background: 'white', color: '#667eea', fontWeight: '600', border: 'none',
                    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }} onClick={() => setShowBuilder(true)}>
                    <Plus size={20} />
                    Create Automation
                </button>
            </div>

            {/* Automations Grid */}
            <div className="grid grid-2" style={{ gap: '24px' }}>
                {mockAutomations.map(automation => (
                    <div
                        key={automation.id}
                        className="glass-clear"
                        style={{
                            padding: '24px',
                            position: 'relative'
                        }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-lg">
                            <div className="flex items-center gap-md">
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: automation.enabled
                                        ? 'rgba(102, 126, 234, 0.2)'
                                        : 'rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: automation.enabled ? 'white' : 'rgba(255,255,255,0.5)',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px', color: 'white' }}>
                                        {automation.name}
                                    </h3>
                                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>
                                        {automation.lastRun
                                            ? `Last run: ${format(automation.lastRun, 'MMM d, h:mm a')}`
                                            : 'Never run'}
                                    </p>
                                </div>
                            </div>
                            <div className={`toggle ${automation.enabled ? 'active' : ''}`} style={{ background: automation.enabled ? '#4ade80' : 'rgba(255,255,255,0.2)' }}></div>
                        </div>

                        {/* Automation Flow */}
                        <div style={{
                            background: 'rgba(0,0,0,0.1)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '16px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div className="flex items-center gap-md">
                                {/* Trigger */}
                                <div style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <div className="flex items-center gap-sm mb-sm">
                                        <Clock size={14} style={{ color: 'white' }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'white', textTransform: 'uppercase' }}>
                                            Trigger
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255,255,255,0.9)' }}>
                                        {automation.trigger.type === 'Time' && `At ${automation.trigger.time}`}
                                        {automation.trigger.type === 'System' && `${automation.trigger.value}`}
                                    </p>
                                </div>

                                <ArrowRight size={20} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />

                                {/* Condition (if exists) */}
                                {automation.conditions && automation.conditions.length > 0 && (
                                    <>
                                        <div style={{
                                            flex: 1,
                                            background: 'rgba(255,255,255,0.1)',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.2)'
                                        }}>
                                            <div className="flex items-center gap-sm mb-sm">
                                                <CheckCircle size={14} style={{ color: '#fbbf24' }} />
                                                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#fbbf24', textTransform: 'uppercase' }}>
                                                    Condition
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255,255,255,0.9)' }}>
                                                {automation.conditions[0].type}
                                            </p>
                                        </div>
                                        <ArrowRight size={20} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                                    </>
                                )}

                                {/* Action */}
                                <div style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <div className="flex items-center gap-sm mb-sm">
                                        <Zap size={14} style={{ color: '#4ade80' }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#4ade80', textTransform: 'uppercase' }}>
                                            Action
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255,255,255,0.9)' }}>
                                        {automation.actions[0].type.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-sm">
                                <button className="btn btn-sm" style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <Edit2 size={16} style={{ marginRight: '6px' }} />
                                    Edit
                                </button>
                                <button className="btn btn-sm" style={{ background: 'white', color: '#667eea', fontWeight: '600' }}>
                                    <Play size={16} style={{ marginRight: '6px' }} />
                                    Run Now
                                </button>
                            </div>
                            <button className="btn btn-sm" style={{ background: 'transparent', color: '#fca5a5', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
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
                    onClick={() => setShowBuilder(true)}
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
                        Create New Automation
                    </h3>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                        Build intelligent workflows to save time
                    </p>
                </div>
            </div>

            {/* Automation Builder Modal */}
            {showBuilder && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                    onClick={() => setShowBuilder(false)}
                >
                    <div
                        className="glass-clear"
                        style={{
                            maxWidth: '900px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            padding: '32px',
                            background: 'rgba(255,255,255,0.95)', /* Opaque white for serious editing */
                            border: '1px solid white'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>Create New Automation</h2>

                        {/* Step indicator */}
                        <div className="flex items-center gap-md mb-lg">
                            {['Select Trigger', 'Add Conditions', 'Define Actions'].map((step, index) => (
                                <div key={step} className="flex items-center gap-md" style={{ flex: 1 }}>
                                    <div className="flex items-center gap-sm" style={{ flex: 1 }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: index === 0 ? '#667eea' : '#e2e8f0',
                                            color: index === 0 ? 'white' : '#94a3b8',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: '600', fontSize: '0.875rem'
                                        }}>
                                            {index + 1}
                                        </div>
                                        <span style={{
                                            fontSize: '0.875rem', fontWeight: '500',
                                            color: index === 0 ? '#1e293b' : '#94a3b8'
                                        }}>
                                            {step}
                                        </span>
                                    </div>
                                    {index < 2 && (
                                        <div style={{ flex: 1, height: '2px', background: '#e2e8f0' }}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Content placeholder */}
                        <div style={{
                            background: '#f8fafc',
                            borderRadius: '12px',
                            padding: '40px',
                            textAlign: 'center',
                            marginBottom: '24px',
                            border: '1px solid #e2e8f0'
                        }}
                        >
                            <Zap size={48} style={{ color: '#667eea', margin: '0 auto 16px' }} />
                            <h3 style={{ marginBottom: '8px', color: '#1e293b' }}>Choose a Trigger</h3>
                            <p style={{ color: '#64748b' }}>Select when this automation should run</p>
                        </div>

                        <div className="flex justify-between">
                            <button className="btn btn-ghost" style={{ color: '#64748b' }} onClick={() => setShowBuilder(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" style={{ background: '#667eea', color: 'white' }}>
                                Next Step
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
