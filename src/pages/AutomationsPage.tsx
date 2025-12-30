import { useState } from 'react';
import { Plus, Play, Edit2, Trash2, ArrowRight, Zap, Clock, CheckCircle, X } from 'lucide-react';
import { useAutomations } from '../hooks/useFirestore';
import { format } from 'date-fns';
import type { Automation, TriggerType, ConditionType, ActionType } from '../types';

export default function AutomationsPage() {
    const { automations, loading, addAutomation, updateAutomation, deleteAutomation } = useAutomations();
    const [showBuilder, setShowBuilder] = useState(false);
    const [step, setStep] = useState(0);

    // Form State
    const [name, setName] = useState('');
    const [triggerType, setTriggerType] = useState<TriggerType>('Time');
    const [triggerValue, setTriggerValue] = useState('09:00');
    const [conditionType, setConditionType] = useState<ConditionType | ''>('');
    const [actionType, setActionType] = useState<ActionType>('CreateTask');

    const resetForm = () => {
        setName('');
        setTriggerType('Time');
        setTriggerValue('09:00');
        setConditionType('');
        setActionType('CreateTask');
        setStep(0);
    };

    const handleSave = async () => {
        if (!name) return;

        try {
            await addAutomation({
                name,
                enabled: true,
                trigger: {
                    type: triggerType,
                    time: triggerType === 'Time' ? triggerValue : undefined,
                    value: triggerType !== 'Time' ? triggerValue : undefined
                },
                conditions: conditionType ? [{ type: conditionType as ConditionType }] : [],
                actions: [{ type: actionType }]
            });
            setShowBuilder(false);
            resetForm();
        } catch (e) {
            console.error(e);
        }
    };

    const toggleAutomation = (automation: Automation) => {
        updateAutomation(automation.id, { enabled: !automation.enabled });
    };

    const steps = ['Select Trigger', 'Add Conditions', 'Define Actions'];

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
                {loading ? (
                    <div style={{ color: 'white', gridColumn: 'span 2' }}>Loading automations...</div>
                ) : automations.length === 0 ? (
                    <div style={{ color: 'rgba(255,255,255,0.6)', gridColumn: 'span 2', textAlign: 'center', padding: '40px' }}>
                        No automations created yet. Start by clicking "Create Automation".
                    </div>
                ) : (
                    automations.map(automation => (
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
                                <div
                                    className={`toggle ${automation.enabled ? 'active' : ''}`}
                                    style={{ background: automation.enabled ? '#4ade80' : 'rgba(255,255,255,0.2)', cursor: 'pointer' }}
                                    onClick={() => toggleAutomation(automation)}
                                ></div>
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
                                            {automation.trigger.type !== 'Time' && automation.trigger.type}
                                        </p>
                                    </div>

                                    <ArrowRight size={20} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />

                                    {/* Condition */}
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
                                <button
                                    className="btn btn-sm"
                                    onClick={() => deleteAutomation(automation.id)}
                                    style={{ background: 'transparent', color: '#fca5a5', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}

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
                            background: 'rgba(255,255,255,0.95)',
                            border: '1px solid white'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-lg">
                            <h2 style={{ color: '#1e293b' }}>Create New Automation</h2>
                            <button onClick={() => setShowBuilder(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X color='#64748b' />
                            </button>
                        </div>

                        {/* Step indicator */}
                        <div className="flex items-center gap-md mb-lg">
                            {steps.map((s, index) => (
                                <div key={s} className="flex items-center gap-md" style={{ flex: 1 }}>
                                    <div className="flex items-center gap-sm" style={{ flex: 1 }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: index <= step ? '#667eea' : '#e2e8f0',
                                            color: index <= step ? 'white' : '#94a3b8',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: '600', fontSize: '0.875rem'
                                        }}>
                                            {index + 1}
                                        </div>
                                        <span style={{
                                            fontSize: '0.875rem', fontWeight: '500',
                                            color: index <= step ? '#1e293b' : '#94a3b8'
                                        }}>
                                            {s}
                                        </span>
                                    </div>
                                    {index < 2 && (
                                        <div style={{ flex: 1, height: '2px', background: index < step ? '#667eea' : '#e2e8f0' }}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div style={{
                            background: '#f8fafc',
                            borderRadius: '12px',
                            padding: '40px',
                            marginBottom: '24px',
                            border: '1px solid #e2e8f0'
                        }}>
                            {step === 0 && (
                                <div className="flex flex-col gap-md">
                                    <h3 style={{ color: '#1e293b' }}>Automation Basics</h3>
                                    <div>
                                        <label style={{ display: 'block', color: '#64748b', marginBottom: '8px' }}>Name</label>
                                        <input
                                            value={name} onChange={e => setName(e.target.value)}
                                            placeholder="Daily Morning Routine..."
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#1e293b' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#64748b', marginBottom: '8px' }}>Trigger Type</label>
                                        <select
                                            value={triggerType} onChange={e => setTriggerType(e.target.value as TriggerType)}
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#1e293b' }}
                                        >
                                            <option value="Time">Specific Time</option>
                                            <option value="System">System Event</option>
                                            <option value="TaskBased">Task Completion</option>
                                        </select>
                                    </div>
                                    {triggerType === 'Time' && (
                                        <div>
                                            <label style={{ display: 'block', color: '#64748b', marginBottom: '8px' }}>At Time</label>
                                            <input
                                                type="time"
                                                value={triggerValue} onChange={e => setTriggerValue(e.target.value)}
                                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#1e293b' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 1 && (
                                <div className="flex flex-col gap-md">
                                    <h3 style={{ color: '#1e293b' }}>Conditions (Optional)</h3>
                                    <p style={{ color: '#64748b' }}>Run this automation only if...</p>
                                    <select
                                        value={conditionType} onChange={e => setConditionType(e.target.value as ConditionType)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#1e293b' }}
                                    >
                                        <option value="">No Condition (Always Run)</option>
                                        <option value="TaskCount">Task Count is...</option>
                                        <option value="Weekend">It is the Weekend</option>
                                        <option value="Overdue">Items are Overdue</option>
                                    </select>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="flex flex-col gap-md">
                                    <h3 style={{ color: '#1e293b' }}>Actions</h3>
                                    <p style={{ color: '#64748b' }}>What should happen?</p>
                                    <select
                                        value={actionType} onChange={e => setActionType(e.target.value as ActionType)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#1e293b' }}
                                    >
                                        <option value="CreateTask">Create a Task</option>
                                        <option value="SendNotification">Send Notification</option>
                                        <option value="MoveTask">Move Tasks</option>
                                        <option value="GenerateChecklist">Generate Checklist</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between">
                            <button className="btn btn-ghost" style={{ color: '#64748b' }} onClick={() => {
                                if (step > 0) setStep(step - 1);
                                else setShowBuilder(false);
                            }}>
                                {step === 0 ? 'Cancel' : 'Back'}
                            </button>

                            {step < 2 ? (
                                <button className="btn btn-primary" style={{ background: '#667eea', color: 'white' }} onClick={() => setStep(step + 1)}>
                                    Next Step
                                </button>
                            ) : (
                                <button className="btn btn-primary" style={{ background: '#667eea', color: 'white' }} onClick={handleSave}>
                                    Save Automation
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
