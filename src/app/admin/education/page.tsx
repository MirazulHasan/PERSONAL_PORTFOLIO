"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Calendar, GraduationCap, Edit3, Trash2 } from "lucide-react";

function DroppableFix({ children, ...props }: any) {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);
    if (!enabled) return null;
    return <Droppable {...props}>{children}</Droppable>;
}

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    background: "var(--bg-section)", border: "1px solid var(--border)",
    borderRadius: 12, fontSize: 14, color: "var(--text-primary)",
    outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 700,
    color: "var(--text-muted)", marginBottom: 8,
    textTransform: "uppercase", letterSpacing: "0.05em",
};
const selectStyle: React.CSSProperties = {
    ...inputStyle, cursor: "pointer",
};

const GradeSection = ({ gt, editingItem = null }: { gt: string; editingItem?: any }) => (
    <>
        {gt !== "None" && (
            <div style={{ display: "grid", gridTemplateColumns: gt === "Division" ? "1fr" : "1fr 1fr", gap: 20, alignItems: "center", marginTop: 24, padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed var(--border)" }}>
                <div>
                    <label style={labelStyle}>{gt === "Division" ? "Division/Class Result" : "Grade / Score"}</label>
                    <input
                        type={gt === "Division" ? "text" : "number"}
                        name="grade"
                        step={gt === "Division" ? undefined : "0.01"}
                        placeholder={gt === "Division" ? "e.g. First Class" : "e.g. 3.84"}
                        defaultValue={editingItem?.grade ?? ""}
                        style={inputStyle}
                    />
                </div>
                {(gt === "CGPA" || gt === "GPA") && (
                    <div>
                        <label style={labelStyle}>Out Of (Scale)</label>
                        <select name="gradeScale" defaultValue={editingItem?.gradeScale ?? "4.00"} style={selectStyle}>
                            <option value="4.00" style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>4.00</option>
                            <option value="5.00" style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>5.00</option>
                        </select>
                    </div>
                )}
            </div>
        )}
    </>
);

export default function EducationAdmin() {
    const [education, setEducation] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [gradeType, setGradeType] = useState("None");
    const [ongoing, setOngoing] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [editSaving, setEditSaving] = useState(false);
    const [editGradeType, setEditGradeType] = useState("None");
    const [editOngoing, setEditOngoing] = useState(false);
    const [isReordering, setIsReordering] = useState(false);

    useEffect(() => {
        fetch("/api/education").then((r) => r.json()).then((d) => {
            setEducation(Array.isArray(d) ? d : []);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (error) {
            const t = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(t);
        }
    }, [error]);

    const onDragStart = () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        window.getSelection()?.removeAllRanges();
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;
        const items = Array.from(education);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedItems = items.map((item, index) => ({ ...item, order: index }));
        setEducation(updatedItems);
        setIsReordering(true);

        try {
            await fetch("/api/education", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orders: updatedItems.map((x, i) => ({ id: x.id, order: i }))
                }),
            });
        } catch (err) {
            console.error("Failed to sync order", err);
        }
        setIsReordering(false);
    };

    const openEdit = (item: any) => {
        setEditingItem(item);
        setEditOngoing(item.current);
        setEditGradeType(item.gradeType || "None");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const fd = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(fd.entries());
        data.order = education.length;

        const res = await fetch("/api/education", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            const newRecord = await res.json();
            setEducation((prev) => [...prev, newRecord]);
            (e.target as HTMLFormElement).reset();
            setOngoing(false);
            setGradeType("None");
        }
        setSaving(false);
    };

    const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingItem) return;
        setEditSaving(true);
        const fd = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(fd.entries());
        data.current = editOngoing;
        const res = await fetch(`/api/education?id=${editingItem.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            const updated = await res.json();
            setEducation(education.map((e) => e.id === updated.id ? { ...updated, order: e.order } : e));
            setEditingItem(null);
        }
        setEditSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const res = await fetch(`/api/education?id=${id}`, { method: "DELETE" });
        if (res.ok) setEducation(education.filter((item) => item.id !== id));
    };

    if (loading) return (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", margin: "0 auto 16px", animation: "spin 0.6s linear infinite" }} />
            Loading academic records...
        </div>
    );

    return (
        <div style={{ maxWidth: 1000, paddingBottom: 100 }}>
            <style>{`
                .edu-row { transition: background 0.2s, box-shadow 0.2s; }
                .edu-row:hover .drag-handle { opacity: 1 !important; transform: translateX(0) !important; }
            `}</style>

            
            {error && (
                <div style={{ position: "fixed", top: 24, right: 24, zIndex: 2000, padding: "16px 24px", background: "rgba(239,68,68,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, color: "#ef4444", fontSize: 14, fontWeight: 600, boxShadow: "0 10px 40px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 18 }}>⚠️</span> {error}
                </div>
            )}

            <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Academic History</p>
                    <h1 className="gradient-text" style={{ fontSize: "2.6rem", fontWeight: 900 }}>Education</h1>
                </div>
                {isReordering && (
                    <div style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 0.6s linear infinite" }} />
                        SYNCING...
                    </div>
                )}
            </div>

            {/* ── ADD FORM ── */}
            <form onSubmit={handleSubmit} className="glass" style={{ padding: 40, border: "1px solid var(--border)", marginBottom: 48 }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: 32, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 12 }}>
                    <GraduationCap size={20} color="var(--accent)" />
                    Add Qualification
                </h2>
                <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24, alignItems: "flex-end" }}>
                    <div>
                        <label style={labelStyle}>School / University</label>
                        <input name="school" placeholder="e.g. Harvard University" required style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Degree</label>
                        <input name="degree" placeholder="e.g. Bachelor of Science" required style={inputStyle} />
                    </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>Field of Study</label>
                    <input name="field" placeholder="e.g. Computer Science" style={inputStyle} />
                </div>

                <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "flex-end", marginBottom: 8 }}>
                    <div style={{ width: "100%" }}>
                        <label style={labelStyle}>Passing Year</label>
                        <input
                            type="number" name="passingYear"
                            placeholder={ongoing ? "N/A" : "e.g. 2026"}
                            required={!ongoing} disabled={ongoing}
                            style={{ ...inputStyle, opacity: ongoing ? 0.3 : 1, cursor: ongoing ? "not-allowed" : "text" }}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Grade System</label>
                        <select name="gradeType" value={gradeType} onChange={(e) => setGradeType(e.target.value)} style={selectStyle}>
                            <option value="None" style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>None</option>
                            <option value="CGPA" style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>CGPA</option>
                            <option value="GPA" style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>GPA</option>
                            <option value="Division" style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>Division / Class</option>
                        </select>
                    </div>
                </div>

                <GradeSection gt={gradeType} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 16, border: "1px solid var(--border)", marginTop: 8 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 700, color: "var(--text-primary)", cursor: "pointer" }}>
                        <input type="checkbox" name="current" checked={ongoing} onChange={(e) => setOngoing(e.target.checked)}
                               style={{ accentColor: "var(--accent)", width: 18, height: 18 }} />
                        Ongoing
                    </label>
                    <button type="submit" className="btn-glow" disabled={saving}>
                        {saving ? "Saving..." : "Add Education"}
                    </button>
                </div>
            </form>

            {/* ── DRAGGABLE RECORDS LIST ── */}
            <div className="glass" style={{ padding: "18px 32px", border: "1px solid var(--border)", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", marginBottom: 24 }}>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em" }}>Qualification Sequence</h2>
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
                <DroppableFix droppableId="education-list">
                    {(provided: any) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: "flex", flexDirection: "column" }}>
                            {education.length === 0 ? (
                                <p style={{ padding: 60, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>History is empty.</p>
                            ) : education.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided: any, snapshot: any) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="glass edu-row"
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
                                                <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 6, letterSpacing: "-0.01em" }}>{item.degree}</h3>
                                                <p style={{ fontSize: 13, color: "var(--accent)", fontWeight: 800, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.02em" }}>{item.school}</p>
                                                
                                                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, color: "var(--text-muted)", fontSize: 12, fontWeight: 700 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <Calendar size={14} />
                                                        <span style={{ opacity: 0.8 }}>{item.current ? "ONGOING" : `CLASS OF ${item.passingYear}`}</span>
                                                    </div>
                                                    {item.gradeType && item.gradeType !== "None" && item.grade && (
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                            <span style={{ color: "var(--border)", opacity: 0.5 }}>•</span>
                                                            <span style={{ background: "rgba(255,255,255,0.03)", padding: "3px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 11, color: "var(--text-primary)", fontWeight: 800 }}>
                                                                {item.gradeType}: {item.grade}{item.gradeOutOf ? ` / ${item.gradeOutOf}` : ""}
                                                            </span>
                                                        </div>
                                                    )}
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
                <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
                    onClick={() => setEditingItem(null)}>
                    <div className="glass" style={{ width: "100%", maxWidth: 680, padding: 48, borderRadius: 24, border: "1px solid var(--border)", maxHeight: "90vh", overflowY: "auto" }}
                        onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: 32 }}>Edit Education</h2>
                        <form onSubmit={handleEditSave}>
                            <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24, alignItems: "flex-end" }}>
                                <div>
                                    <label style={labelStyle}>School / University</label>
                                    <input name="school" defaultValue={editingItem.school} required style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Degree</label>
                                    <input name="degree" defaultValue={editingItem.degree} required style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label style={labelStyle}>Field of Study</label>
                                <input name="field" defaultValue={editingItem.field ?? ""} style={inputStyle} />
                            </div>

                            <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "flex-end", marginBottom: 8 }}>
                                <div style={{ width: "100%" }}>
                                    <label style={labelStyle}>Passing Year</label>
                                    <input
                                        type="number" name="passingYear"
                                        defaultValue={editingItem.passingYear || ""}
                                        placeholder={editOngoing ? "N/A" : "e.g. 2026"}
                                        required={!editOngoing} disabled={editOngoing}
                                        style={{ ...inputStyle, opacity: editOngoing ? 0.3 : 1, cursor: editOngoing ? "not-allowed" : "text" }}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Grade System</label>
                                    <select name="gradeType" value={editGradeType} onChange={(e) => setEditGradeType(e.target.value)} style={selectStyle}>
                                        <option value="None" style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>None</option>
                                        <option value="CGPA" style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>CGPA</option>
                                        <option value="GPA" style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>GPA</option>
                                        <option value="Division" style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>Division / Class</option>
                                    </select>
                                </div>
                            </div>

                            <GradeSection gt={editGradeType} editingItem={editingItem} />

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
                                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "var(--accent)", cursor: "pointer" }}>
                                    <input type="checkbox" checked={editOngoing} onChange={(e) => setEditOngoing(e.target.checked)}
                                        style={{ accentColor: "var(--accent)", width: 17, height: 17 }} />
                                    Ongoing
                                </label>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <button type="button" onClick={() => setEditingItem(null)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "10px 20px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                                    <button type="submit" className="btn-glow" disabled={editSaving}>{editSaving ? "Saving..." : "Apply Changes"}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
