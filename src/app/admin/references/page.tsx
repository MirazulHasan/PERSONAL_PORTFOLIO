"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, UserCheck, Mail, Phone, Building2, Edit3, Trash2, Plus } from "lucide-react";

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
    borderRadius: 12, fontSize: 14, color: "var(--text-primary)",
    outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 700,
    color: "var(--text-muted)", marginBottom: 8,
    textTransform: "uppercase", letterSpacing: "0.05em",
};

const Field = ({ label, name, type = "text", placeholder = "", defaultValue = "", required = false }: any) => (
    <div style={{ width: "100%" }}>
        <label style={labelStyle}>{label}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
        />
    </div>
);

// Prevents SSR mismatch with react-beautiful-dnd / hello-pangea
function DroppableFix({ children, ...props }: any) {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const frame = requestAnimationFrame(() => setEnabled(true));
        return () => { cancelAnimationFrame(frame); setEnabled(false); };
    }, []);
    if (!enabled) return null;
    return <Droppable {...props}>{children}</Droppable>;
}

export default function ReferencesAdmin() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [editSaving, setEditSaving] = useState(false);
    const [isReordering, setIsReordering] = useState(false);

    useEffect(() => {
        fetch("/api/references")
            .then((res) => res.json())
            .then((data) => {
                setItems(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, []);

    const onDragStart = () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        window.getSelection()?.removeAllRanges();
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;
        const reordered = Array.from(items);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);

        setItems(reordered);
        setIsReordering(true);

        try {
            await fetch("/api/references", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orders: reordered.map((x, i) => ({ id: x.id, order: i }))
                }),
            });
        } catch (err) {
            console.error("Failed to sync order", err);
        }
        setIsReordering(false);
    };

    const openEdit = (item: any) => setEditingItem(item);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formEl = e.currentTarget;
        const form = new FormData(formEl);
        const data: any = Object.fromEntries(form.entries());
        data.order = items.length;

        const res = await fetch("/api/references", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const newItem = await res.json();
            setItems([...items, newItem]);
            formEl.reset();
        }
        setSaving(false);
    };

    const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingItem) return;
        setEditSaving(true);
        const fd = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(fd.entries());

        const res = await fetch(`/api/references?id=${editingItem.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            const updated = await res.json();
            setItems(items.map((i) => i.id === updated.id ? { ...updated, order: i.order } : i));
            setEditingItem(null);
        }
        setEditSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this reference?")) return;
        const res = await fetch(`/api/references?id=${id}`, { method: "DELETE" });
        if (res.ok) setItems(items.filter((i) => i.id !== id));
    };

    if (loading) return (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", margin: "0 auto 16px", animation: "spin 0.6s linear infinite" }} />
            Loading endorsements...
        </div>
    );

    return (
        <div style={{ maxWidth: 1000, paddingBottom: 100 }}>
            <style>{`
                .ref-row { transition: background 0.2s, box-shadow 0.2s; }
                .ref-row:hover .drag-handle { opacity: 1 !important; transform: translateX(0) !important; }
            `}</style>
            
            <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Endorsements</p>
                    <h1 className="gradient-text" style={{ fontSize: "2.6rem", fontWeight: 900 }}>References</h1>
                </div>
                {isReordering && (
                    <div style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 0.6s linear infinite" }} />
                        UPDATING SYNC...
                    </div>
                )}
            </div>

            {/* ── ADD FORM ── */}
            <form onSubmit={handleSubmit} className="glass" style={{ padding: 40, border: "1px solid var(--border)", marginBottom: 48 }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: 32, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 12 }}>
                    <UserCheck size={20} color="var(--accent)" />
                    Add Reference
                </h2>

                <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                    <Field label="Full Name" name="name" required placeholder="e.g. Dr. Sarah Jenkins" />
                    <Field label="Designation" name="designation" required placeholder="e.g. Research Director" />
                </div>

                <div className="admin-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 32 }}>
                    <Field label="Company / University" name="company" placeholder="e.g. MIT Lab" />
                    <Field label="Email" name="email" type="email" placeholder="sarah@mit.edu" />
                    <Field label="Phone Number" name="phone" type="tel" placeholder="+1..." />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 16, border: "1px solid var(--border)", marginTop: 8 }}>
                    <button type="submit" className="btn-glow" style={{ display: "flex", alignItems: "center", gap: 8 }} disabled={saving}>
                        <Plus size={18} />
                        {saving ? "Adding..." : "Add Reference"}
                    </button>
                </div>
            </form>

            {/* ── DRAGGABLE RECORDS LIST ── */}
            <div className="glass" style={{ padding: "18px 32px", border: "1px solid var(--border)", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", marginBottom: 24 }}>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em" }}>Priority Sequence</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        Drag to reorder
                    </span>
                    <span style={{ color: "var(--border)", opacity: 0.5 }}>•</span>
                    <span style={{ fontSize: 9, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        Click to edit
                    </span>
                </div>
            </div>

            <DragDropContext onDragStart={onDragStart} onDragEnd={(res) => { onDragEnd(res); window.getSelection()?.removeAllRanges(); }}>
                <DroppableFix droppableId="ref-list">
                    {(provided: any) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: "flex", flexDirection: "column" }}>
                            {items.length === 0 ? (
                                <p style={{ padding: 60, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No references documented.</p>
                            ) : items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided: any, snapshot: any) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="glass ref-row"
                                            style={{
                                                ...provided.draggableProps.style,
                                                padding: "24px 32px",
                                                border: "1px solid var(--border)",
                                                borderRadius: 20,
                                                marginBottom: 16,
                                                display: "flex",
                                                alignItems: "center",
                                                background: snapshot.isDragging ? "rgba(108,99,255,0.12)" : "var(--bg-card)",
                                                backdropFilter: snapshot.isDragging ? "blur(30px)" : "blur(10px)",
                                                boxShadow: snapshot.isDragging ? "0 20px 50px rgba(0,0,0,0.4)" : "none",
                                                zIndex: snapshot.isDragging ? 1000 : 1,
                                                ...(snapshot.isDropAnimating ? { transitionDuration: "0.001s" } : {}),
                                            }}
                                        >
                                            <div {...provided.dragHandleProps} className="drag-handle"
                                                style={{ marginRight: 24, color: "var(--text-muted)", cursor: "grab", opacity: 0.4, transition: "all 0.2s" }}>
                                                <GripVertical size={20} />
                                            </div>

                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.01em" }}>{item.name}</h3>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--accent)", fontSize: 13, fontWeight: 800, marginBottom: 12 }}>
                                                    <Building2 size={15} />
                                                    {item.designation} {item.company ? `· ${item.company}` : ""}
                                                </div>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 24, color: "var(--text-muted)", fontSize: 12, fontWeight: 700 }}>
                                                    {item.email && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Mail size={14} /> {item.email}</div>}
                                                    {item.phone && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Phone size={14} /> {item.phone}</div>}
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", gap: 10, marginLeft: 24 }}>
                                                <button onClick={() => openEdit(item)}
                                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--text-primary)", cursor: "pointer", fontSize: 11, padding: "10px 18px", borderRadius: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                                                    <Edit3 size={14} /> EDIT
                                                </button>
                                                <button onClick={() => handleDelete(item.id)}
                                                    style={{ background: "rgba(255,59,59,0.06)", border: "1px solid rgba(255,59,59,0.2)", color: "#ff6b6b", cursor: "pointer", fontSize: 11, padding: "10px 18px", borderRadius: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                                                    <Trash2 size={14} /> DELETE
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </DroppableFix>
            </DragDropContext>

            {/* ── EDIT MODAL ── */}
            {editingItem && (
                <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(15px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
                    onClick={() => setEditingItem(null)}>
                    <div className="glass" style={{ width: "100%", maxWidth: 680, padding: 48, borderRadius: 28, border: "1px solid var(--border)", maxHeight: "90vh", overflowY: "auto" }}
                        onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ fontWeight: 800, fontSize: "1.4rem", marginBottom: 32 }}>Update Reference Profile</h3>
                        <form onSubmit={handleEditSave}>
                            <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                                <Field label="Full Name" name="name" required defaultValue={editingItem.name} />
                                <Field label="Designation" name="designation" required defaultValue={editingItem.designation} />
                            </div>
                            <div className="admin-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 32 }}>
                                <Field label="Company" name="company" defaultValue={editingItem.company} />
                                <Field label="Email" name="email" type="email" defaultValue={editingItem.email} />
                                <Field label="Phone Number" name="phone" type="tel" defaultValue={editingItem.phone} />
                            </div>
                            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 16 }}>
                                <button type="button" onClick={() => setEditingItem(null)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "12px 24px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Discard</button>
                                <button type="submit" className="btn-glow" disabled={editSaving}>{editSaving ? "Saving..." : "Apply Changes"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
