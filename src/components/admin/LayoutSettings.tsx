"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, LayoutList, CheckCircle, X, GripVertical, FileText, Monitor } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import React from "react";

const allSections = [
    { id: "summary", title: "Profile Summary" },
    { id: "experience", title: "Professional Experience" },
    { id: "education", title: "Academic Background" },
    { id: "publications", title: "Publications" },
    { id: "activities", title: "Activities" },
    { id: "projects", title: "Selected Projects" },
    { id: "references", title: "References" },
    { id: "skills", title: "Skills & Tech" },
    { id: "certificates", title: "Certifications" },
];

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

export default function LayoutSettings({ profile }: { profile: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"LIVE" | "ATS">("LIVE");

    const [columns, setColumns] = useState({
        layoutMain: [] as typeof allSections,
        layoutSidebar: [] as typeof allSections,
        layoutAts: [] as typeof allSections,
    });

    useEffect(() => {
        // Load Live Profile Layout
        const mainKeys = profile?.layoutMain ? profile.layoutMain.split(',') : ["summary", "experience", "education", "publications", "activities", "projects", "references"];
        const sidebarKeys = profile?.layoutSidebar ? profile.layoutSidebar.split(',') : ["skills", "certificates"];
        
        const mainArr = mainKeys.map((k: string) => allSections.find(s => s.id === k)).filter(Boolean);
        const sideArr = sidebarKeys.map((k: string) => allSections.find(s => s.id === k)).filter(Boolean);
        
        const assignedLive = [...mainKeys, ...sidebarKeys];
        const orphansLive = allSections.filter(s => !assignedLive.includes(s.id));
        if (orphansLive.length > 0) mainArr.push(...orphansLive);

        // Load Print / ATS Layout
        const atsKeys = profile?.layoutAts ? profile.layoutAts.split(',') : ["summary", "experience", "projects", "education", "skills", "certificates", "publications", "activities", "references"];
        const atsArr = atsKeys.map((k: string) => allSections.find(s => s.id === k)).filter(Boolean);
        
        const orphansAts = allSections.filter(s => !atsKeys.includes(s.id));
        if (orphansAts.length > 0) atsArr.push(...orphansAts);

        setColumns({
            layoutMain: mainArr,
            layoutSidebar: sideArr,
            layoutAts: atsArr
        });
    }, [profile, open]);

    const onDragStart = () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        window.getSelection()?.removeAllRanges();
    };

    const handleDragEnd = (result: any) => {
        const { source, destination } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceCol = columns[source.droppableId as keyof typeof columns];
        const destCol = columns[destination.droppableId as keyof typeof columns];

        const sourceItems = Array.from(sourceCol);
        const destItems = source.droppableId === destination.droppableId ? sourceItems : Array.from(destCol);

        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);

        setColumns({
            ...columns,
            [source.droppableId]: sourceItems,
            [destination.droppableId]: destItems
        });
        setSaved(false);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const bodyPayload = activeTab === "LIVE" ? {
                layoutMain: columns.layoutMain.map(i => i.id).join(','),
                layoutSidebar: columns.layoutSidebar.map(i => i.id).join(','),
            } : {
                layoutAts: columns.layoutAts.map(i => i.id).join(','),
            };

            const res = await fetch("/api/profile/layout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyPayload),
            });
            if (res.ok) {
                setSaved(true);
                router.refresh();
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div style={{ position: "relative" }}>
            <button 
                onClick={() => setOpen(true)}
                className="btn-glow"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(255,100,100,0.1)", border: "1px solid rgba(255,100,100,0.3)", color: "var(--text-primary)" }}
            >
                <LayoutList size={16} /> Layout Settings
            </button>

            {open && (
                <div
                    className="admin-modal-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
                    style={{
                        position: "fixed",
                        top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 99999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                    <div
                        className="admin-modal-card"
                        style={{
                            padding: "32px",
                            borderRadius: 20,
                            width: 700,
                            maxWidth: "95vw",
                            maxHeight: "90vh",
                            overflowY: "auto",
                        }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
                                <LayoutList size={20} style={{ color: "var(--accent)" }} /> Layout Settings
                            </h3>
                            <button onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={20} /></button>
                        </div>
                        
                        {/* Tab Switcher */}
                        <div style={{ display: "flex", gap: 12, marginBottom: 24, padding: "4px", background: "var(--bg-section)", borderRadius: "12px", width: "fit-content" }}>
                            <button 
                                onClick={() => setActiveTab("LIVE")}
                                style={{ 
                                    display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                                    background: activeTab === "LIVE" ? "rgba(108,99,255,0.2)" : "transparent",
                                    color: activeTab === "LIVE" ? "var(--text-primary)" : "var(--text-muted)",
                                    fontWeight: activeTab === "LIVE" ? 700 : 500,
                                    transition: "all 0.2s"
                                }}
                            >
                                <Monitor size={16} /> Live Website Setup
                            </button>
                            <button 
                                onClick={() => setActiveTab("ATS")}
                                style={{ 
                                    display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                                    background: activeTab === "ATS" ? "rgba(108,99,255,0.2)" : "transparent",
                                    color: activeTab === "ATS" ? "var(--text-primary)" : "var(--text-muted)",
                                    fontWeight: activeTab === "ATS" ? 700 : 500,
                                    transition: "all 0.2s"
                                }}
                            >
                                <FileText size={16} /> ATS Print Setup
                            </button>
                        </div>

                        {activeTab === "LIVE" ? (
                            <>
                                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
                                    Structure the core 2-column aesthetic for the live CV preview landing page.
                                </p>
                                <DragDropContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 32 }}>
                                        {/* Main Column Box */}
                                        <div style={{ background: "var(--bg-section)", padding: 16, borderRadius: 16, border: "1px solid var(--border)" }}>
                                            <h4 style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>Main Content</h4>
                                            <DroppableFix droppableId="layoutMain">
                                                {(provided: any) => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: 150, display: "flex", flexDirection: "column", gap: 8 }}>
                                                        {columns.layoutMain.map((item, index) => (
                                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                {(provided: any, snapshot: any) => (
                                                                    <div ref={provided.innerRef} {...provided.draggableProps} style={{
                                                                        ...provided.draggableProps.style,
                                                                        userSelect: "none",
                                                                        boxSizing: "border-box",
                                                                        padding: "12px 16px",
                                                                        background: snapshot.isDragging ? "rgba(108,99,255,0.2)" : "var(--bg-card)",
                                                                        borderRadius: 8,
                                                                        border: `1px solid ${snapshot.isDragging ? "rgba(108,99,255,0.4)" : "var(--border)"}`,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: 12,
                                                                        fontWeight: 600,
                                                                        fontSize: 13,
                                                                        boxShadow: snapshot.isDragging ? "0 10px 20px rgba(0,0,0,0.3)" : "none",
                                                                        ...(snapshot.isDropAnimating ? { transitionDuration: "0.001s" } : {}),
                                                                    }}>
                                                                        <div {...provided.dragHandleProps} style={{ cursor: "grab", color: "var(--text-muted)" }}>
                                                                            <GripVertical size={16} />
                                                                        </div>
                                                                        {item.title}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </DroppableFix>
                                        </div>

                                        {/* Sidebar Box */}
                                        <div style={{ background: "var(--bg-section)", padding: 16, borderRadius: 16, border: "1px solid var(--border)" }}>
                                            <h4 style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>Sidebar</h4>
                                            <DroppableFix droppableId="layoutSidebar">
                                                {(provided: any) => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: 150, display: "flex", flexDirection: "column", gap: 8 }}>
                                                        {columns.layoutSidebar.map((item, index) => (
                                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                {(provided: any, snapshot: any) => (
                                                                    <div ref={provided.innerRef} {...provided.draggableProps} style={{
                                                                        ...provided.draggableProps.style,
                                                                        userSelect: "none",
                                                                        boxSizing: "border-box",
                                                                        padding: "12px 16px",
                                                                        background: snapshot.isDragging ? "rgba(108,99,255,0.2)" : "var(--bg-card)",
                                                                        borderRadius: 8,
                                                                        border: `1px solid ${snapshot.isDragging ? "rgba(108,99,255,0.4)" : "var(--border)"}`,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: 12,
                                                                        fontWeight: 600,
                                                                        fontSize: 13,
                                                                        boxShadow: snapshot.isDragging ? "0 10px 20px rgba(0,0,0,0.3)" : "none",
                                                                        ...(snapshot.isDropAnimating ? { transitionDuration: "0.001s" } : {}),
                                                                    }}>
                                                                        <div {...provided.dragHandleProps} style={{ cursor: "grab", color: "var(--text-muted)" }}>
                                                                            <GripVertical size={16} />
                                                                        </div>
                                                                        {item.title}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </DroppableFix>
                                        </div>
                                    </div>
                                </DragDropContext>
                            </>
                        ) : (
                            <>
                                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
                                    Structure the sequential vertical layout optimized for ATS and PDF Print parsing.
                                </p>
                                <DragDropContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
                                    <div style={{ background: "var(--bg-section)", padding: 16, borderRadius: 16, border: "1px solid var(--border)", marginBottom: 32 }}>
                                        <h4 style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>Single Column Print Sequence</h4>
                                        <DroppableFix droppableId="layoutAts">
                                            {(provided: any) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: 150, display: "flex", flexDirection: "column", gap: 8 }}>
                                                    {columns.layoutAts.map((item, index) => (
                                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {(provided: any, snapshot: any) => (
                                                                <div ref={provided.innerRef} {...provided.draggableProps} style={{
                                                                    ...provided.draggableProps.style,
                                                                    userSelect: "none",
                                                                    boxSizing: "border-box",
                                                                    padding: "12px 16px",
                                                                    background: snapshot.isDragging ? "rgba(108,99,255,0.2)" : "var(--bg-card)",
                                                                    borderRadius: 8,
                                                                    border: `1px solid ${snapshot.isDragging ? "rgba(108,99,255,0.4)" : "var(--border)"}`,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: 12,
                                                                    fontWeight: 600,
                                                                    fontSize: 13,
                                                                    boxShadow: snapshot.isDragging ? "0 10px 20px rgba(0,0,0,0.3)" : "none",
                                                                    ...(snapshot.isDropAnimating ? { transitionDuration: "0.001s" } : {}),
                                                                }}>
                                                                    <div {...provided.dragHandleProps} style={{ cursor: "grab", color: "var(--text-muted)" }}>
                                                                        <GripVertical size={16} />
                                                                    </div>
                                                                    {item.title}
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </DroppableFix>
                                    </div>
                                </DragDropContext>
                            </>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 }}>
                            {saved && <span style={{ color: "var(--success)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle size={16} /> Saved {activeTab} Layout Successfully</span>}
                            
                            <button onClick={handleSave} disabled={loading} className="btn-glow" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px" }}>
                                <Save size={16} /> {loading ? "Saving..." : `Save ${activeTab} Layout`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
