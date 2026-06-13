"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Edit3, Trash2 } from "lucide-react";

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

interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
    tags: string;
    featured: boolean;
    order: number;
}

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
    borderRadius: 12, fontSize: 14, color: "var(--text-primary)", outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 700,
    color: "var(--text-muted)", marginBottom: 8,
    textTransform: "uppercase", letterSpacing: "0.05em",
};

const Field = ({ label, name, type = "text", placeholder = "", defaultValue = "", onValueChange }: any) => (
    <div style={{ width: "100%" }}>
        <label style={labelStyle}>{label}</label>
        <input
            type={type} name={name} placeholder={placeholder} 
            defaultValue={defaultValue}
            onChange={(e) => onValueChange?.(e.target.value)}
            required={type !== "url"} style={inputStyle}
            id={`field-${name}`}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
        />
    </div>
);



export default function ProjectsAdmin() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editSaving, setEditSaving] = useState(false);
    const [isReordering, setIsReordering] = useState(false);

    useEffect(() => {
        fetch("/api/projects").then((r) => r.json()).then((d) => { 
            setProjects(Array.isArray(d) ? d : []); 
            setLoading(false); 
        });
    }, []);

    const onDragStart = () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        window.getSelection()?.removeAllRanges();
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;
        const items = Array.from(projects);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update local state immediately
        const updatedItems = items.map((item, index) => ({ ...item, order: index }));
        setProjects(updatedItems);
        setIsReordering(true);

        // Sync with DB
        try {
            await fetch("/api/projects", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orders: updatedItems.map((p, i) => ({ id: p.id, order: i }))
                }),
            });
        } catch (error) {
            console.error("Failed to sync order", error);
        }
        setIsReordering(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const form = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(form.entries());
        data.featured = form.get("featured") === "on";
        data.order = projects.length; // Add to end
        const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            const newProject = await res.json();
            setProjects([...projects, newProject]);
            (e.target as HTMLFormElement).reset();
        }
        setSaving(false);
    };

    const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingProject) return;
        setEditSaving(true);
        const form = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(form.entries());
        data.featured = form.get("featured") === "on";
        const res = await fetch(`/api/projects?id=${editingProject.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            const updated = await res.json();
            setProjects(projects.map((p) => p.id === updated.id ? { ...updated, order: p.order } : p));
            setEditingProject(null);
        }
        setEditSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
        if (res.ok) setProjects(projects.filter((p) => p.id !== id));
    };

    if (loading) return (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", margin: "0 auto 16px", animation: "spin 0.6s linear infinite" }} />
            Loading projects...
        </div>
    );

    return (
        <div style={{ maxWidth: 1000, paddingBottom: 100 }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .proj-row { transition: background 0.2s, box-shadow 0.2s; }
                .proj-row:hover .drag-handle { opacity: 1 !important; transform: translateX(0) !important; }
            `}</style>

            <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Admin</p>
                    <h1 className="gradient-text" style={{ fontSize: "2.6rem", fontWeight: 900 }}>Projects</h1>
                </div>
                {isReordering && (
                    <div style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 0.6s linear infinite" }} />
                        SYNCING ORDER...
                    </div>
                )}
            </div>

            {/* ── ADD FORM ── */}
            <form onSubmit={handleSubmit} className="glass" style={{ padding: 40, border: "1px solid var(--border)", marginBottom: 48 }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: 32, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 3, height: 20, background: "var(--accent)", borderRadius: 4 }} />
                    Register New Project
                </h2>
                <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                    <Field label="Project Title" name="title" placeholder="e.g. AI Content Generator" />
                    <Field label="Tech Stack" name="tags" placeholder="Next.js, Tailwind, Prisma" />
                </div>
                <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>Detailed Description</label>
                    <textarea name="description" rows={3} required style={{ ...inputStyle, lineHeight: 1.6, resize: "vertical" }}
                        onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                        onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
                </div>
                <div className="admin-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                    <Field label="Project Thumbnail" name="imageUrl" type="url" placeholder="https://..." />
                    <Field label="GitHub Repo" name="githubUrl" type="url" placeholder="https://github.com/..." />
                    <Field label="Live Demo" name="liveUrl" type="url" placeholder="https://..." />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 16, border: "1px solid var(--border)" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 700, color: "var(--text-primary)", cursor: "pointer" }}>
                        <input type="checkbox" name="featured" style={{ accentColor: "var(--accent)", width: 18, height: 18 }} />
                        Mark as Featured Work
                    </label>
                    <button type="submit" className="btn-glow" disabled={saving}>
                        {saving ? "Adding..." : "Add Project"}
                    </button>
                </div>
            </form>

            {/* ── DRAGGABLE PROJECT LIST ── */}
            <div className="glass" style={{ padding: "18px 32px", border: "1px solid var(--border)", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", marginBottom: 24 }}>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em" }}>Project Sequence</h2>
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

            <DragDropContext onDragStart={onDragStart} onDragEnd={(r) => { onDragEnd(r); window.getSelection()?.removeAllRanges(); }}>
                <DroppableFix droppableId="projects-list">
                    {(provided: any) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: "flex", flexDirection: "column" }}>
                            {projects.length === 0 ? (
                                <p style={{ padding: 60, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No projects found.</p>
                            ) : projects.map((project, index) => {
                                const tags = project.tags ? project.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                                return (
                                    <Draggable key={project.id} draggableId={project.id} index={index}>
                                        {(provided: any, snapshot: any) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="glass proj-row"
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
                                                {/* Drag Handle */}
                                                <div 
                                                    {...provided.dragHandleProps} 
                                                    className="drag-handle"
                                                    style={{ 
                                                        marginRight: 24, 
                                                        color: "var(--text-muted)", 
                                                        cursor: "grab",
                                                        opacity: 0.4,
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    <GripVertical size={20} />
                                                </div>

                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                                        <p style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.01em" }}>{project.title}</p>
                                                        {project.featured && <span style={{ padding: "4px 12px", borderRadius: 50, background: "rgba(255, 101, 132, 0.1)", color: "#ff6584", fontSize: 9, fontWeight: 900, border: "1px solid rgba(255, 101, 132, 0.2)", letterSpacing: "0.05em" }}>FEATURED</span>}
                                                    </div>
                                                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{project.description}</p>
                                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                                        {tags.map(tag => (
                                                            <span key={tag} style={{ fontSize: 10, color: "var(--accent)", background: "rgba(108, 99, 255, 0.08)", padding: "3px 10px", borderRadius: 6, fontWeight: 800, border: "1px solid rgba(108,99,255,0.1)" }}>{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div style={{ display: "flex", gap: 10, marginLeft: 24 }}>
                                                    <button onClick={() => setEditingProject(project)}
                                                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--text-primary)", cursor: "pointer", fontSize: 11, padding: "10px 18px", borderRadius: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                                                        <Edit3 size={14} /> EDIT
                                                    </button>
                                                    <button onClick={() => handleDelete(project.id)}
                                                        style={{ background: "rgba(255,59,59,0.06)", border: "1px solid rgba(255,59,59,0.2)", color: "#ff6b6b", cursor: "pointer", fontSize: 11, padding: "10px 18px", borderRadius: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                                                        <Trash2 size={14} /> DELETE
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </DroppableFix>
            </DragDropContext>

            {/* ── EDIT MODAL ── */}
            {editingProject && (
                <div className="admin-modal-overlay" style={{
                    position: "fixed", inset: 0, zIndex: 999,
                    background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)",
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
                }} onClick={() => setEditingProject(null)}>
                    <div className="glass admin-modal-card" style={{ width: "100%", maxWidth: 680, padding: 48, borderRadius: 24, border: "1px solid var(--border)", maxHeight: "90vh", overflowY: "auto" }}
                        onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: 32 }}>Update Project Detail</h2>
                        <form onSubmit={handleEditSave}>
                            <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                                <Field label="Title" name="title" defaultValue={editingProject.title} />
                                <Field label="Stack" name="tags" defaultValue={editingProject.tags} />
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label style={labelStyle}>Description</label>
                                <textarea name="description" rows={4} required defaultValue={editingProject.description}
                                    style={{ ...inputStyle, lineHeight: 1.6, resize: "vertical" }} />
                            </div>
                            <div className="admin-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
                                <Field label="Image URL" name="imageUrl" type="url" defaultValue={editingProject.imageUrl ?? ""} />
                                <Field label="GitHub" name="githubUrl" type="url" defaultValue={editingProject.githubUrl ?? ""} />
                                <Field label="Live" name="liveUrl" type="url" defaultValue={editingProject.liveUrl ?? ""} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
                                    <input type="checkbox" name="featured" defaultChecked={editingProject.featured} style={{ accentColor: "var(--accent)", width: 18, height: 18 }} />
                                    Featured Work
                                </label>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <button type="button" onClick={() => setEditingProject(null)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "10px 20px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
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
