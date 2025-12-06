import { useState } from 'react';
import { Plus, Play, Edit2, Trash2, ArrowRight, Zap, Clock, CheckCircle } from 'lucide-react';
import { mockAutomations } from '../data/mockData';
import { format } from 'date-fns';

export default function AutomationsPage() {
    const [showBuilder, setShowBuilder] = useState(false);

    return (
        <div className="page-content fade-in">
            <div className="page-title flex justify-between items-center">
                <div>
                    <h1>Automations</h1>
                    <p className="text-secondary">Create intelligent workflows to automate your tasks</p>
                </div>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => setShowBuilder(true)}
                >
                    <Plus size={20} />
                    Create Automation
                </button>
            </div>

            {/* Automations Grid */}
            <div className="grid grid-2" style={{ gap: '24px' }}>
                {mockAutomations.map(automation => (
                    <div
                        key={automation.id}
                        className="glass-card"
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
                                        ? 'linear-gradient(135deg, #0A84FF, #4DA3FF)'
                                        : 'var(--border-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px' }}>
                                        {automation.name}
                                    </h3>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                        {automation.lastRun
                                            ? `Last run: ${format(automation.lastRun, 'MMM d, h:mm a')}`
                                            : 'Never run'}
                                    </p>
                                </div>
                            </div>
                            <div className={`toggle ${automation.enabled ? 'active' : ''}`}></div>
                        </div>

                        {/* Automation Flow */}
                        <div style={{
                            background: 'rgba(10, 132, 255, 0.05)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '16px'
                        }}>
                            <div className="flex items-center gap-md">
                                {/* Trigger */}
                                <div style={{
                                    flex: 1,
                                    background: 'white',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '2px solid var(--primary)'
                                }}>
                                    <div className="flex items-center gap-sm mb-sm">
                                        <Clock size={14} style={{ color: 'var(--primary)' }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)', textTransform: 'uppercase' }}>
                                            Trigger
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                                        {automation.trigger.type === 'Time' && `At ${automation.trigger.time}`}
                                        {automation.trigger.type === 'System' && `${automation.trigger.value}`}
                                    </p>
                                </div>

                                <ArrowRight size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />

                                {/* Condition (if exists) */}
                                {automation.conditions && automation.conditions.length > 0 && (
                                    <>
                                        <div style={{
                                            flex: 1,
                                            background: 'white',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '2px solid var(--warning)'
                                        }}>
                                            <div className="flex items-center gap-sm mb-sm">
                                                <CheckCircle size={14} style={{ color: 'var(--warning)' }} />
                                                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--warning)', textTransform: 'uppercase' }}>
                                                    Condition
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                                                {automation.conditions[0].type}
                                            </p>
                                        </div>
                                        <ArrowRight size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                    </>
                                )}

                                {/* Action */}
                                <div style={{
                                    flex: 1,
                                    background: 'white',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '2px solid var(--success)'
                                }}>
                                    <div className="flex items-center gap-sm mb-sm">
                                        <Zap size={14} style={{ color: 'var(--success)' }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--success)', textTransform: 'uppercase' }}>
                                            Action
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                                        {automation.actions[0].type.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-sm">
                                <button className="btn btn-sm btn-ghost">
                                    <Edit2 size={16} />
                                    Edit
                                </button>
                                <button className="btn btn-sm btn-primary">
                                    <Play size={16} />
                                    Run Now
                                </button>
                            </div>
                            <button className="btn btn-sm btn-ghost" style={{ color: 'var(--error)' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                <div
                    className="card"
                    style={{
                        padding: '24px',
                        border: '2px dashed var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '280px',
                        transition: 'all 0.2s'
                    }}
                    onClick={() => setShowBuilder(true)}
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
                        Create New Automation
                    </h3>
                    <p className="text-muted" style={{ textAlign: 'center' }}>
                        Build intelligent workflows to save time
                    </p>
                </div>
            </div>

            {/* Automation Builder Modal (simplified preview) */}
            {showBuilder && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                    onClick={() => setShowBuilder(false)}
                >
                    <div
                        className="card"
                        style={{
                            maxWidth: '900px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            padding: '32px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginBottom: '24px' }}>Create New Automation</h2>

                        {/* Step indicator */}
                        <div className="flex items-center gap-md mb-lg">
                            {['Select Trigger', 'Add Conditions', 'Define Actions'].map((step, index) => (
                                <div key={step} className="flex items-center gap-md" style={{ flex: 1 }}>
                                    <div className="flex items-center gap-sm" style={{ flex: 1 }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: index === 0 ? 'var(--primary)' : 'var(--border-color)',
                                            color: index === 0 ? 'white' : 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '600',
                                            fontSize: '0.875rem'
                                        }}>
                                            {index + 1}
                                        </div>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            color: index === 0 ? 'var(--text-primary)' : 'var(--text-muted)'
                                        }}>
                                            {step}
                                        </span>
                                    </div>
                                    {index < 2 && (
                                        <div style={{
                                            flex: 1,
                                            height: '2px',
                                            background: 'var(--border-color)'
                                        }}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Content placeholder */}
                        <div style={{
                            background: 'var(--bg-main)',
                            borderRadius: '12px',
                            padding: '40px',
                            textAlign: 'center',
                            marginBottom: '24px'
                        }}>
                            <Zap size={48} style={{ color: 'var(--primary)', margin: '0 auto 16px' }} />
                            <h3 style={{ marginBottom: '8px' }}>Choose a Trigger</h3>
                            <p className="text-muted">Select when this automation should run</p>
                        </div>

                        <div className="flex justify-between">
                            <button className="btn btn-ghost" onClick={() => setShowBuilder(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary">
                                Next Step
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
