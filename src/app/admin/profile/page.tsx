"use client";

import { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";


async function getCroppedImg(imageSrc: string, croppedAreaPixels: any, type: "avatar" | "about"): Promise<string | null> {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => { image.onload = resolve; });

    const canvas = document.createElement("canvas");
    
    // Optimized dimensions for web/mobile to ensure small payload size (fixed aspect 2:3 for about)
    const targetWidth = type === "avatar" ? 300 : 400;
    const targetHeight = type === "avatar" ? 300 : 600;
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Use WebP for best compression while retaining alpha channel (transparency)
    ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0, 0,
        targetWidth,
        targetHeight
    );
    // 0.8 quality WebP is significantly smaller than PNG/JPEG and supports transparency
    return canvas.toDataURL("image/webp", 0.8);
}

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    background: "var(--bg-section)", border: "1px solid var(--border)",
    borderRadius: 12, fontSize: 14, color: "var(--text-primary)", outline: "none",
    transition: "border-color 0.2s",
};

const Field = ({ label, name, type = "text", defaultValue }: any) => (
    <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
        <input type={type} name={name} defaultValue={defaultValue ?? ""}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
        />
    </div>
);


function DroppableFix({ children, ...props }: any) {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => { cancelAnimationFrame(animation); setEnabled(false); };
    }, []);
    if (!enabled) return null;
    return <Droppable {...props}>{children}</Droppable>;
}

export default function ProfileAdmin() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const [socialLinks, setSocialLinks] = useState<any[]>([]);

    // Crop state
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [activeTarget, setActiveTarget] = useState<"avatar" | "about">("avatar");
    const [aboutDragOver, setAboutDragOver] = useState(false);

    useEffect(() => {
        fetch("/api/profile?t=" + Date.now())
            .then((r) => r.json())
            .then((d) => {
                setProfile(d);
                const links = (d?.socialLinks || []).map((l: any, idx: number) => ({
                    ...l,
                    id: String(l.id || `init-${idx}-${Date.now()}`)
                }));
                setSocialLinks(links);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const onCropComplete = useCallback((_: any, cap: any) => {
        setCroppedAreaPixels(cap);
    }, []);

    const loadFile = (file: File) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setImageSrc(reader.result as string);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setShowCropper(true);
        });
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: "avatar" | "about") => {
        if (e.target.files && e.target.files.length > 0) {
            setActiveTarget(target);
            loadFile(e.target.files[0]);
        }
    };

    const handleAvatarDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setActiveTarget("avatar");
            loadFile(file);
        }
    };

    const handleAboutDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setAboutDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setActiveTarget("about");
            loadFile(file);
        }
    };

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setUploading(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, activeTarget);
            if (!croppedImage) {
                setUploading(false);
                return;
            }

            // Set the profile state with the new base64 image URL
            if (activeTarget === "avatar") {
                setProfile((prev: any) => ({ ...prev, avatarUrl: croppedImage }));
            } else {
                setProfile((prev: any) => ({ ...prev, aboutImageUrl: croppedImage }));
            }
            setShowCropper(false);
            showToast("success", "Photo updated locally! Click 'Save Profile' to permanently save.");
        } catch (error) {
            console.error("Update Error:", error);
            showToast("error", "Error updating photo.");
        }
        setUploading(false);
    };

    const handleAddLink = () => {
        if (socialLinks.length >= 10) {
            showToast("error", "Maximum 10 social links allowed.");
            return;
        }
        const newId = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setSocialLinks(prev => [...prev, { id: newId, platform: "GitHub", url: "" }]);
    };
    const handleRemoveLink = (i: number) => {
        setSocialLinks(prev => prev.filter((_, idx) => idx !== i));
    };
    const handleLinkChange = (i: number, field: string, value: string) => {
        setSocialLinks(prev => {
            const newList = [...prev];
            newList[i] = { ...newList[i], [field]: value };
            return newList;
        });
    };
    const handleSocialDragEnd = (result: any) => {
        if (!result.destination) return;
        if (result.source.index === result.destination.index) return;
        setSocialLinks(prev => {
            const items = Array.from(prev);
            const [moved] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, moved);
            return items;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const form = new FormData(e.currentTarget);
        const data = Object.fromEntries(form.entries());

        const res = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, avatarUrl: profile?.avatarUrl, aboutImageUrl: profile?.aboutImageUrl, socialLinks }),
        });
        setSaving(false);
        if (res.ok) {
            showToast("success", "Profile saved successfully!");
        } else {
            const errData = await res.json().catch(() => ({}));
            console.error("Save error:", res.status, errData);
            showToast("error", `Save failed (${res.status}): ${errData.error || "Please check payload size or connection."}`);
        }
    };

    if (loading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 16, color: "var(--text-muted)" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
            Loading profile…
        </div>
    );

    return (
        <div style={{ maxWidth: 860 }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes toastIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                .upload-zone:hover { border-color: var(--accent) !important; background: rgba(108,99,255,0.06) !important; }
                .remove-link-btn:hover { background: rgba(255,77,77,0.15) !important; }
            `}</style>

            {/* ── Header ── */}
            <div style={{ marginBottom: 40 }}>
                <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Admin</p>
                <h1 className="gradient-text" style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.04em" }}>About Me Settings</h1>
            </div>

            {/* ── Toast ── */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 32, right: 120, zIndex: 9999,
                    padding: "14px 24px", borderRadius: 14, fontWeight: 600, fontSize: 14,
                    background: toast.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                    border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)"}`,
                    color: toast.type === "success" ? "#4ade80" : "#f87171",
                    backdropFilter: "blur(16px)",
                    animation: "toastIn 0.3s ease",
                    display: "flex", alignItems: "center", gap: 10,
                }}>
                    {toast.type === "success" ? "✓" : "✕"} {toast.msg}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* ── Photo Grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24, marginBottom: 24 }}>
                    {/* ── Avatar Card ── */}
                    <div className="glass" style={{ padding: 24, border: "1px solid var(--border)" }}>
                        <h2 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ width: 3, height: 16, background: "var(--accent)", borderRadius: 4, display: "inline-block" }} />
                            Profile Photo
                        </h2>
                        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                            {/* Avatar preview */}
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <div style={{
                                    width: 100, height: 100, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                                    padding: 3,
                                    boxShadow: "0 0 30px rgba(108,99,255,0.3)",
                                }}>
                                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#0a0a0f" }}>
                                        {profile?.avatarUrl ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={profile.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, color: "var(--text-primary)" }}>
                                                {(profile?.name?.[0] || "M").toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <label htmlFor="avatar-input" style={{
                                    position: "absolute", bottom: 0, right: 0,
                                    width: 32, height: 32, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", fontSize: 14,
                                    boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                                    border: "2px solid #0a0a0f",
                                }} title="Upload new photo">📷</label>
                            </div>

                            {/* Drop zone */}
                            <div
                                className="upload-zone"
                                onDrop={handleAvatarDrop}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                style={{
                                    flex: 1, minWidth: 150,
                                    border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border)"}`,
                                    borderRadius: 16, padding: "16px",
                                    textAlign: "center", cursor: "pointer",
                                    background: dragOver ? "rgba(108,99,255,0.06)" : "transparent",
                                    transition: "all 0.2s",
                                }}
                                onClick={() => document.getElementById("avatar-input")?.click()}
                            >
                                <div style={{ fontSize: 24, marginBottom: 8 }}>🖼️</div>
                                <p style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", marginBottom: 4 }}>
                                    Upload Avatar
                                </p>
                                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>max 10 MB</p>
                            </div>

                            <input id="avatar-input" type="file" accept="image/*" onChange={(e) => handleFileChange(e, "avatar")} style={{ display: "none" }} />
                        </div>
                    </div>

                    {/* ── About Me Standing Photo ── */}
                    <div className="glass" style={{ padding: 24, border: "1px solid var(--border)" }}>
                        <h2 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ width: 3, height: 16, background: "var(--accent)", borderRadius: 4, display: "inline-block" }} />
                            Standing Photo
                        </h2>
                        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <div style={{
                                    width: 100, height: 130, borderRadius: 12,
                                    background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                                    padding: 3,
                                    boxShadow: "0 0 30px rgba(108,99,255,0.3)",
                                }}>
                                    <div style={{ width: "100%", height: "100%", borderRadius: 9, overflow: "hidden", background: "#0a0a0f" }}>
                                        {profile?.aboutImageUrl ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={profile.aboutImageUrl} alt="About" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, color: "var(--text-primary)" }}>
                                                🧍
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <label htmlFor="about-input" style={{
                                    position: "absolute", bottom: -5, right: -5,
                                    width: 32, height: 32, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", fontSize: 14,
                                    boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                                    border: "2px solid #0a0a0f",
                                }} title="Upload About Photo">📷</label>
                            </div>

                            <div
                                className="upload-zone"
                                onDrop={handleAboutDrop}
                                onDragOver={(e) => { e.preventDefault(); setAboutDragOver(true); }}
                                onDragLeave={() => setAboutDragOver(false)}
                                style={{
                                    flex: 1, minWidth: 150,
                                    border: `2px dashed ${aboutDragOver ? "var(--accent)" : "var(--border)"}`,
                                    borderRadius: 16, padding: "16px",
                                    textAlign: "center", cursor: "pointer",
                                    background: aboutDragOver ? "rgba(108,99,255,0.06)" : "transparent",
                                    transition: "all 0.2s",
                                }}
                                onClick={() => document.getElementById("about-input")?.click()}
                            >
                                <div style={{ fontSize: 24, marginBottom: 8 }}>👕</div>
                                <p style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", marginBottom: 4 }}>
                                    Upload Full-body
                                </p>
                                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Transparent Recommended</p>
                            </div>

                            <input id="about-input" type="file" accept="image/*" onChange={(e) => handleFileChange(e, "about")} style={{ display: "none" }} />
                        </div>
                    </div>
                </div>

                {/* ── Basic Info ── */}
                <div className="glass" style={{ padding: 40, border: "1px solid var(--border)", marginBottom: 24 }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 28, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 3, height: 20, background: "var(--accent)", borderRadius: 4, display: "inline-block" }} />
                        Basic Information
                    </h2>
                    <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                        <Field label="Full Name" name="name" defaultValue={profile?.name ?? ""} />
                        <Field label="Professional Title (Document Meta)" name="title" defaultValue={profile?.title ?? ""} />
                    </div>
                    <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                        <Field label="Hero First Line (Large Text 1)" name="heroHeadline1" defaultValue={profile?.heroHeadline1 ?? "AI"} />
                        <Field label="Hero Second Line (Large Text 2)" name="heroHeadline2" defaultValue={profile?.heroHeadline2 ?? "Engineer"} />
                    </div>
                    <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                        <Field label="Hero Greeting Prefix (Hi, I'm)" name="heroGreetingPrefix" defaultValue={profile?.heroGreetingPrefix ?? "Hi, I'm"} />
                        <Field label="Hero Greeting Suffix (and I am a)" name="heroGreetingSuffix" defaultValue={profile?.heroGreetingSuffix ?? "and I am a"} />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <Field label="About Section Title" name="aboutTitle" defaultValue={profile?.aboutTitle ?? "Passionate about building things that matter"} />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Bio / About Me</label>
                        <textarea name="bio" rows={5} defaultValue={profile?.bio ?? ""}
                            style={{ ...inputStyle, lineHeight: 1.7, resize: "vertical" }}
                            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                        />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <Field label="Present Address" name="address" defaultValue={profile?.address ?? ""} />
                    </div>
                    <Field label="Primary Email Address" name="email" type="email" defaultValue={profile?.email ?? ""} />
                </div>

                {/* ── Social Links ── */}
                <div style={{
                    padding: 40, border: "1px solid var(--border)", marginBottom: 32,
                    borderRadius: 20, background: "var(--bg-card)",
                    boxShadow: "0 4px 24px -1px rgba(0,0,0,0.1)",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ width: 3, height: 20, background: "var(--accent)", borderRadius: 4, display: "inline-block" }} />
                            Social Profiles
                        </h2>
                        <div style={{ display: "flex", gap: 12 }}>
                            {socialLinks.length > 0 && (
                                <button type="button" onClick={() => { if (confirm("Clear all links?")) setSocialLinks([]); }} style={{
                                    background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)",
                                    color: "#ff4d4d", padding: "7px 16px", borderRadius: 8,
                                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                                }}>CLEAR ALL</button>
                            )}
                            <button type="button" onClick={handleAddLink} style={{
                                background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.4)",
                                color: "var(--accent)", padding: "7px 16px", borderRadius: 8,
                                fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em",
                            }}>+ ADD LINK</button>
                        </div>
                    </div>

                    <DragDropContext
                        onDragStart={() => {
                            if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
                            window.getSelection()?.removeAllRanges();
                        }}
                        onDragEnd={(result) => {
                            handleSocialDragEnd(result);
                            window.getSelection()?.removeAllRanges();
                        }}
                    >
                        <DroppableFix droppableId="social-links">
                            {(provided: any) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ display: "flex", flexDirection: "column", gap: 12 }}
                                >
                                    {socialLinks.map((link, i) => (
                                        <Draggable key={link.id || String(i)} draggableId={link.id || String(i)} index={i}>
                                            {(provided: any, snapshot: any) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        display: "flex", gap: 12, alignItems: "center",
                                                        background: snapshot.isDragging ? "rgba(108,99,255,0.12)" : "rgba(108,99,255,0.02)",
                                                        backdropFilter: snapshot.isDragging ? "blur(30px)" : "blur(10px)",
                                                        padding: "16px", borderRadius: "16px",
                                                        border: `1px solid ${snapshot.isDragging ? "rgba(108,99,255,0.4)" : "var(--border)"}`,
                                                        boxShadow: snapshot.isDragging ? "0 20px 50px rgba(0,0,0,0.4)" : "none",
                                                        zIndex: snapshot.isDragging ? 1000 : 1,
                                                        ...(snapshot.isDropAnimating ? { transitionDuration: "0.001s" } : {}),
                                                    }}
                                                >
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        style={{ display: "flex", alignItems: "center", cursor: "grab", color: "var(--text-muted)", flexShrink: 0 }}
                                                        title="Drag to reorder"
                                                    >
                                                        <GripVertical size={18} />
                                                    </div>
                                                    <div style={{ width: 160, flexShrink: 0 }}>
                                                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>Platform</label>
                                                        <select value={link.platform} onChange={(e) => handleLinkChange(i, "platform", e.target.value)}
                                                            style={{ ...inputStyle, padding: "11px 16px", cursor: "pointer" }}>
                                                            {[
                                                                "LinkedIn", "ResearchGate", "ORCID", "Google Scholar", "Academia.edu", "Semantic Scholar", "IEEE Xplore",
                                                                "GitHub", "Stack Overflow", "Kaggle", "HuggingFace",
                                                                "Twitter", "Instagram", "Facebook", "YouTube", "TikTok", "Reddit", "Threads",
                                                                "Medium", "Dev.to", "Hashnode", "Behance", "Dribbble",
                                                                "Discord", "Telegram",
                                                                "Portfolio", "Other"
                                                            ].map(p => (
                                                                <option key={p} value={p} style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>{p}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>URL</label>
                                                        <input type="url" value={link.url} onChange={(e) => handleLinkChange(i, "url", e.target.value)}
                                                            placeholder="https://..." style={{ ...inputStyle, padding: "11px 16px" }}
                                                            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                                            onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
                                                    </div>
                                                    <button type="button" className="remove-link-btn" onClick={() => handleRemoveLink(i)} style={{
                                                        background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.3)",
                                                        color: "#ff4d4d", padding: "11px 14px", borderRadius: 12, cursor: "pointer",
                                                        fontSize: 16, lineHeight: 1, transition: "background 0.2s", flexShrink: 0,
                                                    }}>✕</button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </DroppableFix>
                    </DragDropContext>

                    {socialLinks.length === 0 && (
                        <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "40px 20px", border: "1px dashed var(--border)", borderRadius: 16, background: "rgba(255,255,255,0.01)" }}>
                            <div style={{ fontSize: 24, marginBottom: 12 }}>🔗</div>
                            <p>No social links yet.</p>
                            <p style={{ fontSize: 11, marginTop: 4 }}>Click <strong>+ ADD LINK</strong> to showcase your profiles.</p>
                        </div>
                    )}
                </div>

                {/* ── Section Titles Customization ── */}
                <div className="glass" style={{ padding: 40, border: "1px solid var(--border)", marginBottom: 32 }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 28, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 3, height: 20, background: "var(--accent)", borderRadius: 4, display: "inline-block" }} />
                        Page Section Customization
                    </h2>

                    <div className="admin-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px 24px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>🎓 Education</p>
                            <Field label="Title" name="educationTitle" defaultValue={profile?.educationTitle} />
                            <Field label="Subtitle" name="educationSubtitle" defaultValue={profile?.educationSubtitle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>💼 Experience</p>
                            <Field label="Title" name="experienceTitle" defaultValue={profile?.experienceTitle} />
                            <Field label="Subtitle" name="experienceSubtitle" defaultValue={profile?.experienceSubtitle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>🛠️ Skills</p>
                            <Field label="Title" name="skillsTitle" defaultValue={profile?.skillsTitle} />
                            <Field label="Subtitle" name="skillsSubtitle" defaultValue={profile?.skillsSubtitle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>🚀 Projects</p>
                            <Field label="Title" name="projectsTitle" defaultValue={profile?.projectsTitle} />
                            <Field label="Subtitle" name="projectsSubtitle" defaultValue={profile?.projectsSubtitle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>🏆 Certificates</p>
                            <Field label="Title" name="certificatesTitle" defaultValue={profile?.certificatesTitle} />
                            <Field label="Subtitle" name="certificatesSubtitle" defaultValue={profile?.certificatesSubtitle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>📝 Publications</p>
                            <Field label="Title" name="publicationsTitle" defaultValue={profile?.publicationsTitle} />
                            <Field label="Subtitle" name="publicationsSubtitle" defaultValue={profile?.publicationsSubtitle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>✨ Extra-Curricular</p>
                            <Field label="Title" name="activitiesTitle" defaultValue={profile?.activitiesTitle} />
                            <Field label="Subtitle" name="activitiesSubtitle" defaultValue={profile?.activitiesSubtitle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>🤝 References</p>
                            <Field label="Title" name="referencesTitle" defaultValue={profile?.referencesTitle} />
                            <Field label="Subtitle" name="referencesSubtitle" defaultValue={profile?.referencesSubtitle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>✍️ Blog/Journal</p>
                            <Field label="Title" name="blogTitle" defaultValue={profile?.blogTitle} />
                            <Field label="Subtitle" name="blogSubtitle" defaultValue={profile?.blogSubtitle} />
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 16, border: "1px solid var(--border)", marginTop: 8 }}>

                    <button type="submit" className="btn-glow" disabled={saving} style={{ padding: "14px 40px", fontSize: 15 }}>
                        {saving ? "Saving…" : "Save Profile"}
                    </button>
                </div>
            </form>

            {/* ── Crop Modal ── */}
            {showCropper && imageSrc && (
                <div style={{
                    position: "fixed", inset: 0,
                    background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)",
                    zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
                }}>
                    <div className="glass" style={{ width: "100%", maxWidth: 580, padding: "36px 32px", border: "1px solid var(--border)" }}>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 8 }}>Crop &amp; Resize Photo</h2>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>Drag to reposition · Scroll or use slider to zoom</p>

                        {/* Cropper area */}
                        <div style={{ position: "relative", width: "100%", height: 360, background: "#000", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={activeTarget === "avatar" ? 1 : 2 / 3}
                                cropShape={activeTarget === "avatar" ? "round" : "rect"}
                                showGrid={false}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        {/* Controls */}
                        <div className="admin-grid-2" style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <div>
                                <label style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase" }}>
                                    <span>Zoom</span>
                                    <span style={{ color: "var(--text-primary)" }}>{zoom.toFixed(1)}×</span>
                                </label>
                                <input type="range" min={1} max={3} step={0.05} value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    style={{ width: "100%", accentColor: "var(--accent)" }} />
                            </div>
                            <div>
                                <label style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase" }}>
                                    <span>Rotate</span>
                                    <span style={{ color: "var(--text-primary)" }}>{rotation}°</span>
                                </label>
                                <input type="range" min={-180} max={180} step={1} value={rotation}
                                    onChange={(e) => setRotation(Number(e.target.value))}
                                    style={{ width: "100%", accentColor: "var(--accent)" }} />
                            </div>
                        </div>

                        {/* Preview circle */}
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24, padding: "16px 20px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid var(--border)" }}>
                            <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--accent)", flexShrink: 0 }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#6c63ff,#ff6584)" }} />}
                            </div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Optimized High Quality Photo</p>
                                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Round crop shown in sidebar &amp; portfolio</p>
                            </div>
                        </div>

                        <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                            <button
                                onClick={() => document.getElementById("avatar-input")?.click()}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)";
                                    e.currentTarget.style.color = "var(--text-primary)";
                                    e.currentTarget.style.background = "rgba(108,99,255,0.08)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border)";
                                    e.currentTarget.style.color = "var(--text-muted)";
                                    e.currentTarget.style.background = "transparent";
                                }}
                                style={{
                                    background: "transparent",
                                    border: "1px dashed var(--border)",
                                    color: "var(--text-muted)",
                                    padding: "9px 18px",
                                    borderRadius: 10,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontSize: 13,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    transition: "all 0.2s",
                                }}
                            >
                                <span style={{ fontSize: 15 }}>🖼️</span> Choose different file
                            </button>
                            <div style={{ display: "flex", gap: 12 }}>
                                <button onClick={() => setShowCropper(false)}
                                    style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "10px 20px", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                                    Cancel
                                </button>
                                <button onClick={handleUpload} className="btn-glow" disabled={uploading} style={{ padding: "10px 28px" }}>
                                    {uploading ? "Uploading…" : "Apply Photo"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
