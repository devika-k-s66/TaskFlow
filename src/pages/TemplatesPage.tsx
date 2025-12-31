import { useState } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Calendar,
    Layout,
} from 'lucide-react';
import { useTemplates } from '../hooks/useFirestore';
import type { Priority, TimeSlot } from '../types';
import { format } from 'date-fns';

export default function TemplatesPage() {
    const { templates, loading, addTemplate, updateTemplate, deleteTemplate } = useTemplates();
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Create form states
    const [templateName, setTemplateName] = useState('');
    const [slots, setSlots] = useState<Omit<TimeSlot, 'id'>[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // New slot form states
    const [slotTitle, setSlotTitle] = useState('');
    const [slotStartTime, setSlotStartTime] = useState('09:00');
    const [slotDuration, setSlotDuration] = useState(60);
    const [slotPriority, setSlotPriority] = useState<Priority>('Medium');
    const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
    const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const checkOverlap = (newStart: string, duration: number, excludeIndex: number | null = null) => {
        const [newH, newM] = newStart.split(':').map(Number);
        const newStartMin = newH * 60 + newM;
        const newEndMin = newStartMin + duration;

        return slots.some((slot, index) => {
            if (index === excludeIndex) return false;
            const [h, m] = slot.startTime.split(':').map(Number);
            const startMin = h * 60 + m;
            const endMin = startMin + slot.duration;

            return (newStartMin < endMin && newEndMin > startMin);
        });
    };

    const handleAddSlot = () => {
        if (!slotTitle.trim()) return;

        if (checkOverlap(slotStartTime, slotDuration, editingSlotIndex)) {
            setError('Time slot overlaps with an existing slot');
            setTimeout(() => setError(null), 3000);
            return;
        }

        const newSlot = {
            title: slotTitle,
            startTime: slotStartTime,
            duration: slotDuration,
            priority: slotPriority
        };

        if (editingSlotIndex !== null) {
            // Update existing slot
            const updatedSlots = [...slots];
            updatedSlots[editingSlotIndex] = newSlot;
            setSlots(updatedSlots);
            setEditingSlotIndex(null);
        } else {
            // Add new slot
            setSlots([...slots, newSlot]);

            // Auto-advance time only when adding new
            const [h, m] = slotStartTime.split(':').map(Number);
            const totalMinutes = h * 60 + m + slotDuration;
            const nextH = Math.floor(totalMinutes / 60) % 24;
            const nextM = totalMinutes % 60;
            setSlotStartTime(`${String(nextH).padStart(2, '0')}:${String(nextM).padStart(2, '0')}`);
        }

        // Reset form but keep time if adding
        setSlotTitle('');
        setError(null);
        if (editingSlotIndex !== null) {
            setSlotDuration(60);
            setSlotPriority('Medium');
        }
    };

    const handleEditSlot = (index: number) => {
        const slot = slots[index];
        setSlotTitle(slot.title);
        setSlotStartTime(slot.startTime);
        setSlotDuration(slot.duration);
        setSlotPriority(slot.priority);
        setEditingSlotIndex(index);
    };

    const handleRemoveSlot = (index: number) => {
        setSlots(slots.filter((_, i) => i !== index));
        if (editingSlotIndex === index) {
            setEditingSlotIndex(null);
            setSlotTitle('');
            setSlotDuration(60);
        }
    };

    const handleEditTemplate = (template: any) => {
        setTemplateName(template.name);
        // Strip IDs from slots to match state type, or keep them if we change state type. 
        // For now, we regenerate IDs on save, so stripping is fine.
        setSlots(template.slots.map((s: any) => {
            const { id, ...rest } = s;
            return rest;
        }));
        setEditingTemplateId(template.id);
        setShowCreateModal(true);
    };

    const handleSaveTemplate = async () => {
        if (!templateName.trim() || slots.length === 0) return;
        setIsSaving(true);
        try {
            if (editingTemplateId) {
                await updateTemplate(editingTemplateId, {
                    name: templateName,
                    slots: slots.map(s => ({ ...s, id: Math.random().toString(36).substr(2, 9) }))
                });
            } else {
                await addTemplate({
                    name: templateName,
                    slots: slots.map(s => ({ ...s, id: Math.random().toString(36).substr(2, 9) }))
                });
            }
            setShowCreateModal(false);
            resetForm();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        setTemplateName('');
        setSlots([]);
        setEditingSlotIndex(null);
        setEditingTemplateId(null);
        setError(null);
        setSlotTitle('');
        setSlotStartTime('09:00');
        setSlotDuration(60);
        setSlotPriority('Medium');
    };

    return (
        <div className="page-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <style>{`
                .glass-card { 
                    background: rgba(15, 23, 42, 0.9) !important; 
                    border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 24px; 
                    backdrop-filter: blur(20px);
                }
                .planning-input {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                    padding: 10px 14px !important;
                    border-radius: 10px !important;
                    font-size: 0.9rem !important;
                    width: 100%;
                }
                .planning-input option {
                    background-color: #1e293b;
                    color: white;
                }
                input[type="time"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    cursor: pointer;
                }
                .form-label {
                    display: block;
                    margin-bottom: 6px;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 600;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                }
                
                .slot-mini {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 3px 6px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 6px;
                }
                .slot-time { color: #fbbf24; font-weight: 800; font-size: 0.65rem; }
                .slot-title { color: white; font-weight: 600; flex: 1; font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .slot-duration { color: rgba(255,255,255,0.6); font-size: 0.6rem; }

                @media (max-width: 768px) {
                    .page-title { 
                        flex-direction: column; 
                        align-items: flex-start !important; 
                        gap: 16px; 
                    }
                    .page-title h1 {
                        font-size: 2rem !important;
                    }
                    .modal-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
                    .glass-card {
                        border-radius: 16px !important;
                    }
                    
                    /* Mobile Grid Overrides */
                    .templates-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 12px !important;
                    }
                    .template-card {
                        padding: 12px !important;
                    }
                    .template-icon-box {
                        width: 36px !important;
                        height: 36px !important;
                        border-radius: 8px !important;
                    }
                    .template-title {
                        font-size: 0.9rem !important;
                    }
                    .template-date {
                        font-size: 0.65rem !important;
                    }
                    .action-btn {
                        width: 28px !important;
                        height: 28px !important;
                    }
                    .new-template-card {
                        min-height: 200px !important;
                    }
                }
                
                @media (max-width: 480px) {
                   .form-row { grid-template-columns: 1fr !important; } 
                   .page-content { padding: 16px !important; }
                   .btn-lg { width: 100%; justify-content: center; }
                }

                .templates-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                }
            `}</style>

            <div className="page-title flex justify-between items-center">
                <div>
                    <h1 style={{
                        fontSize: '3rem', fontWeight: '600', letterSpacing: '-1px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>Time Templates</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem' }}>Design and manage your day blueprints</p>
                </div>
                <button className="btn btn-lg" onClick={() => setShowCreateModal(true)} style={{
                    background: 'white', color: '#667eea', fontWeight: '600', border: 'none',
                    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <Plus size={20} />
                    New Template
                </button>
            </div>

            <div className="templates-grid">
                {loading ? (
                    <div style={{ color: 'white' }}>Loading templates...</div>
                ) : templates.length === 0 ? (
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>No templates created yet.</div>
                ) : (
                    templates.map(template => (
                        <div key={template.id} className="glass-clear template-card" style={{ padding: '24px' }}>
                            <div className="flex justify-between items-start mb-md">
                                <div className="flex items-center gap-md">
                                    <div className="template-icon-box" style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <Layout size={20} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <h3 className="template-title" style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {template.name}
                                        </h3>
                                        <p className="template-date flex items-center gap-sm" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>
                                            <Calendar size={12} />
                                            {format(new Date(template.createdAt), 'MMM d, yyyy')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteTemplate(template.id); }}
                                    className="action-btn"
                                    style={{
                                        background: 'rgba(255,255,255,0.1)', border: 'none',
                                        color: '#fca5a5', width: '32px', height: '32px', borderRadius: '8px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                                        e.currentTarget.style.color = '#ef4444';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.color = '#fca5a5';
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEditTemplate(template); }}
                                    className="action-btn"
                                    style={{
                                        background: 'rgba(255,255,255,0.1)', border: 'none',
                                        color: '#fbbf24', width: '32px', height: '32px', borderRadius: '8px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                        transition: 'all 0.2s', marginLeft: '4px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(251, 191, 36, 0.2)';
                                        e.currentTarget.style.color = '#fbbf24';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.color = '#fbbf24';
                                    }}
                                >
                                    <Edit2 size={14} />
                                </button>
                            </div>

                            <div style={{
                                background: 'rgba(102, 126, 234, 0.05)',
                                borderRadius: '10px',
                                padding: '12px',
                                marginBottom: '0',
                                border: '1px solid rgba(102, 126, 234, 0.1)'
                            }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
                                    Structure ({template.slots.length} slots):
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {template.slots.slice(0, 3).map((slot, i) => (
                                        <div key={i} className="flex items-center gap-sm">
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: '#667eea'
                                            }}></div>
                                            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', flex: 1 }}>{slot.title}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{slot.startTime}</span>
                                        </div>
                                    ))}
                                    {template.slots.length > 3 && (
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', paddingLeft: '14px' }}>
                                            + {template.slots.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Add New Template Card */}
                <div
                    className="glass-clear new-template-card"
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
                    onClick={() => setShowCreateModal(true)}
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
                        Create New Template
                    </h3>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                        Design a reusable daily schedule
                    </p>
                </div>
            </div>

            {
                showCreateModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
                        padding: '16px'
                    }} onClick={() => setShowCreateModal(false)}>
                        <div className="glass-card" style={{
                            width: '100%', maxWidth: '850px', maxHeight: '90vh', overflow: 'hidden',
                            display: 'flex', flexDirection: 'column'
                        }} onClick={e => e.stopPropagation()}>

                            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white', fontWeight: '800' }}>
                                    {editingTemplateId ? 'Edit Template' : 'New Template'}
                                </h2>
                                <button onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                                <div className="modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div>
                                            <label className="form-label">Template Name</label>
                                            <input className="planning-input" placeholder="e.g. Work Day" value={templateName} onChange={e => setTemplateName(e.target.value)} />
                                        </div>

                                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '16px' }}>
                                            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', color: 'white', fontWeight: '700' }}>
                                                {editingSlotIndex !== null ? 'Edit Time Slot' : 'Add Time Slot'}
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <input className="planning-input" placeholder="What's happening?" value={slotTitle} onChange={e => setSlotTitle(e.target.value)} />
                                                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                    <div>
                                                        <label className="form-label">Start Time</label>
                                                        <input type="time" className="planning-input" value={slotStartTime} onChange={e => setSlotStartTime(e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <label className="form-label">Duration (Min)</label>
                                                        <input type="number" className="planning-input" value={slotDuration} onChange={e => setSlotDuration(Number(e.target.value))} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="form-label">Priority</label>
                                                    <select className="planning-input" value={slotPriority} onChange={e => setSlotPriority(e.target.value as Priority)}>
                                                        <option value="High">High</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="Low">Low</option>
                                                    </select>
                                                </div>
                                                {error && <div style={{ color: '#ff4d4f', fontSize: '0.8rem', marginTop: '-4px' }}>{error}</div>}
                                                <button onClick={handleAddSlot} disabled={!slotTitle.trim()} className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                                                    {editingSlotIndex !== null ? 'Update Slot' : 'Add Slot'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <label className="form-label">Structure Preview ({slots.length} slots)</label>
                                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '200px' }}>
                                            {slots.length === 0 ? (
                                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)' }}>Empty</div>
                                            ) : (
                                                slots.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((slot, i) => (
                                                    <div key={i} className="slot-mini" style={{ padding: '10px' }}>
                                                        <span className="slot-time" style={{ fontSize: '0.8rem' }}>{slot.startTime}</span>
                                                        <span className="slot-title" style={{ fontSize: '0.85rem' }}>{slot.title}</span>
                                                        <span className="slot-duration">{slot.duration}m</span>
                                                        <div className="flex gap-sm">
                                                            <button
                                                                onClick={() => handleEditSlot(i)}
                                                                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '2px' }}
                                                                title="Edit"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveSlot(i)}
                                                                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '2px' }}
                                                                title="Remove"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <button
                                            onClick={handleSaveTemplate}
                                            disabled={!templateName.trim() || slots.length === 0 || isSaving}
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                color: 'white', padding: '14px', borderRadius: '16px', fontWeight: '800', border: 'none', cursor: 'pointer',
                                                opacity: (!templateName.trim() || slots.length === 0 || isSaving) ? 0.5 : 1
                                            }}
                                        >
                                            {isSaving ? 'Saving...' : (editingTemplateId ? 'Update Template' : 'Save Template')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
