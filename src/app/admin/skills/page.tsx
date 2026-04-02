"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Cpu, Edit3, Trash2, Plus, Zap, X, ChevronDown } from "lucide-react";

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

const Field = ({ label, name, type = "text", placeholder = "", defaultValue = "" }: any) => (
    <div style={{ width: "100%" }}>
        <label style={labelStyle}>{label}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={name !== "icon"}
            min={type === "number" ? 0 : undefined}
            max={type === "number" ? 100 : undefined}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
        />
    </div>
);

// Custom Combobox for Categories — uses a Portal to avoid overflow clipping
const CategoryCombobox = ({ value, onChange, placeholder, categories }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const inputRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updatePosition = () => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width,
            });
        }
    };

    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    useEffect(() => {
        const handleInteraction = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                const portalEl = document.getElementById("category-dropdown-portal");
                if (portalEl && portalEl.contains(e.target as Node)) return;
                setIsOpen(false);
            }
        };

        if (isOpen) {
            updatePosition();
            window.addEventListener("mousedown", handleInteraction);
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);
        }

        return () => {
            window.removeEventListener("mousedown", handleInteraction);
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [isOpen]);

    const openDropdown = () => {
        updatePosition();
        setIsOpen(true);
    };

    const filtered = categories.filter((c: string) =>
        c.toLowerCase().includes(inputValue.toLowerCase())
    );

    const dropdown = isOpen && filtered.length > 0 ? createPortal(
        <div
            id="category-dropdown-portal"
            style={{
                position: "fixed",
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
                zIndex: 99999,
                maxHeight: 220,
                overflowY: "auto",
                background: "var(--bg-card, #0f0f1a)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                backdropFilter: "blur(20px)",
            }}
        >
            {filtered.map((cat: string) => (
                <div
                    key={cat}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setInputValue(cat);
                        onChange(cat);
                        setIsOpen(false);
                    }}
                    style={{
                        padding: "10px 16px",
                        cursor: "pointer",
                        fontSize: 14,
                        color: "var(--text-primary)",
                        borderBottom: "1px solid var(--border)",
                        transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(108,99,255,0.15)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                    {cat}
                </div>
            ))}
        </div>,
        document.body
    ) : null;

    return (
        <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
            <label style={labelStyle}>Category</label>
            <div ref={inputRef} style={{ position: "relative" }}>
                <input
                    type="text"
                    name="category"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        onChange(e.target.value);
                        openDropdown();
                    }}
                    onFocus={openDropdown}
                    placeholder={placeholder}
                    required
                    autoComplete="off"
                    style={{ ...inputStyle, paddingRight: 40 }}
                />
                <div
                    onMouseDown={(e) => { e.preventDefault(); isOpen ? setIsOpen(false) : openDropdown(); }}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "var(--text-muted)" }}
                >
                    <ChevronDown size={18} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </div>
            </div>
            {isOpen && (
                createPortal(
                    <div
                        id="category-dropdown-portal"
                        style={{
                            position: "fixed",
                            top: dropdownPos.top,
                            left: dropdownPos.left,
                            width: dropdownPos.width,
                            zIndex: 99999,
                            maxHeight: 220,
                            overflowY: "auto",
                            background: "var(--bg-card, #0f0f1a)",
                            border: "1px solid var(--border)",
                            borderRadius: 12,
                            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                            backdropFilter: "blur(20px)",
                        }}
                    >
                        {categories.map((cat: string) => (
                            <div
                                key={cat}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setInputValue(cat);
                                    onChange(cat);
                                    setIsOpen(false);
                                }}
                                style={{
                                    padding: "10px 16px",
                                    cursor: "pointer",
                                    fontSize: 14,
                                    color: "var(--text-primary)",
                                    borderBottom: "1px solid var(--border)",
                                    transition: "background 0.15s",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(108,99,255,0.15)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            >
                                {cat}
                            </div>
                        ))}
                    </div>,
                    document.body
                )
            )}
        </div>
    );
};

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

export default function SkillsAdmin() {
    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [editSaving, setEditSaving] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    
    const [newCategory, setNewCategory] = useState("");
    const [editCategory, setEditCategory] = useState("");

    useEffect(() => {
        fetch("/api/skills")
            .then((res) => res.json())
            .then((data) => {
                setSkills(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, []);

    const { skillsByCategory, categories } = useMemo(() => {
        const grouped = skills.reduce((acc: any, skill: any) => {
            if (!acc[skill.category]) acc[skill.category] = [];
            acc[skill.category].push(skill);
            return acc;
        }, {});
        
        Object.keys(grouped).forEach(cat => {
            grouped[cat].sort((a: any, b: any) => a.order - b.order);
        });

        const sortedCats = Object.keys(grouped).sort((a, b) => {
            const minA = Math.min(...grouped[a].map((s: any) => s.order));
            const minB = Math.min(...grouped[b].map((s: any) => s.order));
            return minA - minB;
        });

        return { skillsByCategory: grouped, categories: sortedCats };
    }, [skills]);

    const toggleCategory = (cat: string) => {
        const next = new Set(expandedCategories);
        if (next.has(cat)) next.delete(cat);
        else next.add(cat);
        setExpandedCategories(next);
    };

    const onDragStart = () => {
        // Blur focused element so browser doesn't keep text selected after drop
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        // Clear any text selection
        window.getSelection()?.removeAllRanges();
    };

    const onDragEnd = async (result: any) => {
        const { destination, source, type } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === "category") {
            const newCats = Array.from(categories);
            const [removed] = newCats.splice(source.index, 1);
            newCats.splice(destination.index, 0, removed);
            syncGlobalOrder(newCats, skillsByCategory);
        } else {
            const catId = source.droppableId;
            const newSkills = Array.from(skillsByCategory[catId]);
            const [removed] = newSkills.splice(source.index, 1);
            newSkills.splice(destination.index, 0, removed);
            
            const updatedGrouped = { ...skillsByCategory, [catId]: newSkills };
            syncGlobalOrder(categories, updatedGrouped);
        }
    };

    const syncGlobalOrder = async (cats: string[], grouped: any) => {
        setIsReordering(true);
        const flattened: any[] = [];
        cats.forEach(cat => flattened.push(...grouped[cat]));
        const updates = flattened.map((x, i) => ({ id: x.id, order: i }));
        
        setSkills(flattened.map((s, i) => ({ ...s, order: i })));

        try {
            await fetch("/api/skills", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orders: updates }),
            });
        } catch (err) {
            console.error("Failed to sync order", err);
        }
        setIsReordering(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formEl = e.currentTarget;
        const form = new FormData(formEl);
        const data: any = Object.fromEntries(form.entries());
        data.order = skills.length;
        data.category = newCategory || data.category;

        const res = await fetch("/api/skills", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const newSkill = await res.json();
            setSkills([...skills, newSkill]);
            formEl.reset();
            setNewCategory("");
        }
        setSaving(false);
    };

    const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingItem) return;
        setEditSaving(true);
        const fd = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(fd.entries());
        data.category = editCategory || data.category;

        const res = await fetch(`/api/skills?id=${editingItem.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            const updated = await res.json();
            setSkills(skills.map((s) => s.id === updated.id ? { ...updated, order: s.order } : s));
            setEditingItem(null);
        }
        setEditSaving(false);
    };

    const openEdit = (item: any) => {
        setEditingItem(item);
        setEditCategory(item.category);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this skill?")) return;
        const res = await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
        if (res.ok) setSkills(skills.filter((s) => s.id !== id));
    };

    const [renamingCategory, setRenamingCategory] = useState<{ oldName: string, newName: string } | null>(null);
    const [renameSaving, setRenameSaving] = useState(false);

    const handleRenameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!renamingCategory || !renamingCategory.newName.trim()) return;
        if (renamingCategory.newName === renamingCategory.oldName) {
            setRenamingCategory(null);
            return;
        }

        setRenameSaving(true);
        const res = await fetch("/api/skills", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                renameCategory: { 
                    oldName: renamingCategory.oldName, 
                    newName: renamingCategory.newName 
                } 
            }),
        });

        if (res.ok) {
            const updatedSkills = skills.map(s => s.category === renamingCategory.oldName ? { ...s, category: renamingCategory.newName } : s);
            setSkills(updatedSkills);
            setRenamingCategory(null);
        }
        setRenameSaving(false);
    };

    const handleRenameCategory = (oldName: string) => {
        setRenamingCategory({ oldName, newName: oldName });
    };

    const handleDeleteCategory = async (categoryName: string) => {
        if (!confirm(`Are you sure? This will delete ALL skills in the "${categoryName}" category!`)) return;

        const res = await fetch(`/api/skills?category=${encodeURIComponent(categoryName)}`, {
            method: "DELETE"
        });

        if (res.ok) {
            setSkills(skills.filter(s => s.category !== categoryName));
        }
    };

    if (loading) return (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", margin: "0 auto 16px", animation: "spin 0.6s linear infinite" }} />
            Exploring Tech Stack...
        </div>
    );

    return (
        <div style={{ maxWidth: 1000, paddingBottom: 100 }}>
            <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Knowledge Base</p>
                    <h1 className="gradient-text" style={{ fontSize: "2.6rem", fontWeight: 900 }}>Technical Skills</h1>
                </div>
                {isReordering && (
                    <div style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 0.6s linear infinite" }} />
                        SYNCING...
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="glass" style={{ padding: 40, border: "1px solid var(--border)", marginBottom: 48, overflow: "visible" }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: 32, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 12 }}>
                    <Cpu size={20} color="var(--accent)" />
                    Register New Competency
                </h2>
                <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24, alignItems: "flex-end" }}>
                    <Field label="Skill Name" name="name" placeholder="e.g. TypeScript" />
                    <CategoryCombobox 
                        value={newCategory} 
                        onChange={setNewCategory} 
                        placeholder="e.g. Frontend" 
                        categories={categories} 
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 16, border: "1px solid var(--border)", marginTop: 8 }}>
                    <button type="submit" className="btn-glow" style={{ height: 46, display: "flex", alignItems: "center", gap: 8 }} disabled={saving}>
                        <Plus size={18} />
                        {saving ? "..." : "Add Competency"}
                    </button>
                </div>
            </form>

            <div className="glass" style={{ padding: "18px 32px", border: "1px solid var(--border)", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", marginBottom: 24 }}>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em" }}>Skill Sequence</h2>
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

            <DragDropContext onDragStart={onDragStart} onDragEnd={(result) => { onDragEnd(result); window.getSelection()?.removeAllRanges(); }}>
                <DroppableFix droppableId="categories-root" type="category">
                    {(provided: any) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: "flex", flexDirection: "column" }}>
                            {categories.map((cat, catIdx) => {
                                const isExpanded = expandedCategories.has(cat);
                                const catSkills = skillsByCategory[cat] || [];
                                return (
                                    <Draggable key={cat} draggableId={cat} index={catIdx}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} 
                                                className="glass" 
                                                style={{ 
                                                    ...provided.draggableProps.style,
                                                    border: "1px solid var(--border)", 
                                                    overflow: "hidden", 
                                                    borderRadius: 20,
                                                    marginBottom: 20,
                                                    background: snapshot.isDragging ? "rgba(108,99,255,0.08)" : "var(--bg-card)",
                                                    ...(snapshot.isDropAnimating ? { transitionDuration: "0.001s" } : {}),
                                                }}>
                                                <div style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", background: isExpanded ? "rgba(255,255,255,0.02)" : "transparent" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                        <div {...provided.dragHandleProps} style={{ color: "var(--text-muted)", cursor: "grab", opacity: 0.3 }}>
                                                            <GripVertical size={20} />
                                                        </div>
                                                        <div onClick={() => toggleCategory(cat)} style={{ cursor: "pointer" }}>
                                                            <h3 style={{ fontWeight: 800, fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat}</h3>
                                                            <span style={{ fontSize: 10, fontWeight: 800, color: "var(--accent)", background: "rgba(108,99,255,0.08)", padding: "2px 10px", borderRadius: 50 }}>{catSkills.length} SKILLS</span>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                        <button onClick={() => handleRenameCategory(cat)} 
                                                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--text-primary)", cursor: "pointer", fontSize: 11, padding: "10px 18px", borderRadius: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                                                            <Edit3 size={14} /> EDIT
                                                        </button>
                                                        <button onClick={() => handleDeleteCategory(cat)} 
                                                            style={{ background: "rgba(255,59,59,0.06)", border: "1px solid rgba(255,59,59,0.2)", color: "#ff6b6b", cursor: "pointer", fontSize: 11, padding: "10px 18px", borderRadius: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                                                            <Trash2 size={14} /> DELETE
                                                        </button>
                                                        <div onClick={() => toggleCategory(cat)} style={{ cursor: "pointer", transition: "transform 0.4s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                                                            <Plus size={20} style={{ transform: isExpanded ? "rotate(45deg)" : "none" }} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div style={{ borderTop: "1px solid var(--border)" }}>
                                                        <Droppable droppableId={cat} type="skill">
                                                            {(skillProvided) => (
                                                                <div {...skillProvided.droppableProps} ref={skillProvided.innerRef}>
                                                                    {catSkills.map((skill: any, skillIdx: number) => (
                                                                        <Draggable key={skill.id} draggableId={skill.id} index={skillIdx}>
                                                                            {(sProvided, sSnapshot) => (
                                                                                <div ref={sProvided.innerRef} {...sProvided.draggableProps} 
                                                                                    className="skill-row"
                                                                                    style={{
                                                                                        ...sProvided.draggableProps.style,
                                                                                        padding: "16px 32px",
                                                                                        borderBottom: "1px solid var(--border)",
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                        background: sSnapshot.isDragging ? "rgba(108,99,255,0.12)" : "transparent",
                                                                                        ...(sSnapshot.isDropAnimating ? { transitionDuration: "0.001s" } : {}),
                                                                                    }}>
                                                                                    <div {...sProvided.dragHandleProps} style={{ marginRight: 24, color: "var(--text-muted)", cursor: "grab", opacity: 0.2 }}>
                                                                                        <GripVertical size={18} />
                                                                                    </div>
                                                                                    <div style={{ flex: 1 }}>
                                                                                        <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>{skill.name}</span>
                                                                                    </div>
                                                                                    <div style={{ display: "flex", gap: 10 }}>
                                                                                        <button onClick={() => openEdit(skill)} 
                                                                                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--text-primary)", cursor: "pointer", fontSize: 11, padding: "10px 18px", borderRadius: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                                                                                            <Edit3 size={14} /> EDIT
                                                                                        </button>
                                                                                        <button onClick={() => handleDelete(skill.id)} 
                                                                                            style={{ background: "rgba(255,59,59,0.06)", border: "1px solid rgba(255,59,59,0.2)", color: "#ff6b6b", cursor: "pointer", fontSize: 11, padding: "10px 18px", borderRadius: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                                                                                            <Trash2 size={14} /> DELETE
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </Draggable>
                                                                    ))}
                                                                    {skillProvided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    </div>
                                                )}
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

            {editingItem && (
                <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(15px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setEditingItem(null)}>
                    <div className="glass" style={{ width: "100%", maxWidth: 500, padding: 48, borderRadius: 28, border: "1px solid var(--border)", overflow: "visible" }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                            <h3 style={{ fontWeight: 800, fontSize: "1.3rem", display: "flex", alignItems: "center", gap: 12 }}><Zap size={20} color="var(--accent)" /> Edit Skill Detail</h3>
                            <button onClick={() => setEditingItem(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={22} /></button>
                        </div>
                        <form onSubmit={handleEditSave}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 32 }}>
                                <Field label="Skill Name" name="name" defaultValue={editingItem.name} />
                                <CategoryCombobox 
                                    value={editCategory} 
                                    onChange={setEditCategory} 
                                    placeholder="e.g. Frontend" 
                                    categories={categories} 
                                />
                            </div>
                            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                                <button type="button" onClick={() => setEditingItem(null)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "10px 20px", borderRadius: 10, fontWeight: 700 }}>Discard</button>
                                <button type="submit" className="btn-glow" disabled={editSaving}>{editSaving ? "Saving..." : "Apply Changes"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {renamingCategory && (
                <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(15px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setRenamingCategory(null)}>
                    <div className="glass" style={{ width: "100%", maxWidth: 450, padding: 40, borderRadius: 24, border: "1px solid var(--border)", overflow: "visible" }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ fontWeight: 800, fontSize: "1.2rem", display: "flex", alignItems: "center", gap: 12 }}>
                                <Edit3 size={20} color="var(--accent)" />
                                Rename Category
                            </h3>
                            <button onClick={() => setRenamingCategory(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                                <X size={22} />
                            </button>
                        </div>
                        <form onSubmit={handleRenameSubmit}>
                            <div style={{ marginBottom: 24 }}>
                                <label style={labelStyle}>Category Name</label>
                                <input
                                    type="text"
                                    value={renamingCategory.newName}
                                    onChange={(e) => setRenamingCategory({ ...renamingCategory, newName: e.target.value })}
                                    required
                                    autoFocus
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                                <button type="button" onClick={() => setRenamingCategory(null)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "10px 20px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                                <button type="submit" className="btn-glow" disabled={renameSaving}>
                                    {renameSaving ? "Renaming..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
