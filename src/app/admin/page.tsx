import { Github, Linkedin, Mail, ExternalLink, Globe, MapPin, Award, BookOpen, UserCheck, Briefcase, GraduationCap, Code, Rocket, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/db";
import DownloadPDFButton from "@/components/admin/DownloadPDFButton";
import AtsResume from "@/components/admin/AtsResume";
import LayoutSettings from "@/components/admin/LayoutSettings";
import CvPreviewGrid from "@/components/admin/CvPreviewGrid";

export const dynamic = 'force-dynamic';


// ── TYPES ───────────────────────────────────────────────────────────────────
interface Profile {
    name: string;
    title: string;
    bio: string;
    aboutTitle?: string | null;
    address?: string | null;
    avatarUrl?: string | null;
    email?: string | null;
    socialLinks?: SocialLink[];
    availability?: string | null;
    layoutMain?: string | null;
    layoutSidebar?: string | null;
}

interface SocialLink {
    platform: string;
    url: string;
}

interface Education {
    id: string;
    school: string;
    degree: string;
    field?: string | null;
    passingYear: number;
    gradeType?: string | null;
    grade?: string | null;
    gradeScale?: string | null;
    current: boolean;
}

interface Experience {
    id: string;
    company: string;
    position: string;
    description?: string | null;
    startDate: Date;
    endDate?: Date | null;
    current: boolean;
}

interface Skill {
    id: string;
    name: string;
    level: number;
}

interface Certificate {
    id: string;
    title: string;
    issuer: string;
    issuedAt: Date | null;
}

interface Activity {
    id: string;
    title: string;
    role?: string | null;
    description?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    current: boolean;
}

interface Publication {
    id: string;
    title: string;
    publisher?: string | null;
    date?: Date | null;
    submitted: boolean;
}

interface Reference {
    id: string;
    name: string;
    designation: string;
    company?: string | null;
    email?: string | null;
}

interface Project {
    id: string;
    title: string;
    description: string;
    githubUrl?: string | null;
    liveUrl?: string | null;
    tags: string;
}

const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform.toLowerCase()) {
        case "github": return <Github size={14} />;
        case "linkedin": return <Linkedin size={14} />;
        case "twitter": return <Twitter size={14} />;
        case "facebook": return <Facebook size={14} />;
        case "instagram": return <Instagram size={14} />;
        case "youtube": return <Youtube size={14} />;
        case "portfolio": return <Globe size={14} />;
        default: return <ExternalLink size={14} />;
    }
};

// ── COMPONENT ──────────────────────────────────────────────────────────────
export default async function AdminDashboard() {
    // ── DATA FETCHING ────────────────────────────────────────────────────────
    const profileData = await prisma.profile.findFirst({ include: { socialLinks: true } });
    const profile = profileData as unknown as Profile | null;

    const education = await (prisma as any).education.findMany({
        orderBy: [{ order: "asc" }, { current: "desc" }, { passingYear: "desc" }]
    }) as unknown as Education[];

    const experience = await (prisma as any).experience.findMany({
        orderBy: [{ order: "asc" }, { startDate: "desc" }]
    }) as unknown as Experience[];

    const skills = await (prisma as any).skill.findMany({
        orderBy: [{ order: "asc" }, { level: "desc" }]
    }) as unknown as Skill[];

    const certificates = await (prisma as any).certificate.findMany({
        orderBy: [{ order: "asc" }, { issuedAt: "desc" }],
        take: 6
    }) as unknown as Certificate[];

    const activities = await (prisma as any).activity.findMany({
        orderBy: [{ order: "asc" }, { startDate: "desc" }]
    }) as Activity[];

    const publications = await (prisma as any).publication.findMany({
        orderBy: [{ order: "asc" }, { date: "desc" }]
    }) as Publication[];

    let references: Reference[] = [];
    try {
        references = await (prisma as any).reference.findMany({
            orderBy: [{ order: "asc" }, { createdAt: "asc" }]
        }) as Reference[];
    } catch (error) {
        console.warn("Failed to fetch references:", error);
    }

    const projects = await (prisma as any).project.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }]
    }) as Project[];

    const adminCards = [
        { title: "About", href: "/admin/profile", icon: "👤" },
        { title: "Education", href: "/admin/education", icon: "🎓" },
        { title: "Experience", href: "/admin/experience", icon: "💼" },
        { title: "Skills", href: "/admin/skills", icon: "🧠" },
        { title: "Projects", href: "/admin/projects", icon: "🚀" },
        { title: "Certificates", href: "/admin/certificates", icon: "📜" },
        { title: "Activities", href: "/admin/activities", icon: "🏅" },
        { title: "Publications", href: "/admin/publications", icon: "📚" },
        { title: "References", href: "/admin/references", icon: "🤝" },
    ];

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: 100 }}>
            <style>{`
                .cv-card { background: rgba(255,255,255,0.01); backdrop-filter: blur(24px); border: 1px solid var(--border); border-radius: 32px; box-shadow: 0 40px 100px rgba(0,0,0,0.3); overflow: hidden; }
                .cv-section-title { font-size: 11px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
                .cv-section-title span { height: 1px; flex: 1; background: linear-gradient(to right, var(--accent), transparent); opacity: 0.3; }
                .skill-chip { background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 50px; font-size: 11px; font-weight: 800; color: var(--text-primary); display: table; width: auto; line-height: 1.4; padding: 6px 15px; white-space: normal; text-align: left; margin-bottom: 2px; }
                .quick-btn:hover { border-color: var(--accent) !important; background: rgba(108,99,255,0.08) !important; transform: translateY(-3px); }

                @media print {
                    @page { size: auto; margin: 0; }
                    body { background: #fff !important; color: #000 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    
                    .admin-layout-wrapper { background: transparent !important; }

                    /* Hide everything we don't need */
                    .hide-on-print, nav, footer, button, .ticker-container, #cv-card, .dot-pattern, .glow-circle, #background-effects { display: none !important; }
                    
                    /* Reset container */
                    main, html, body { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        width: 100% !important; 
                        height: auto !important; 
                        overflow: visible !important; 
                        background: #fff !important;
                    }
                }
            `}</style>

            <div className="hide-on-print" style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Live Portfolio Overview</p>
                    <h1 className="gradient-text" style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.04em" }}>CV Preview</h1>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <LayoutSettings profile={profile} />

                    <DownloadPDFButton name={profile?.name} />

                    <div style={{ padding: "8px 16px", background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 50, color: "var(--accent)", fontSize: 11, fontWeight: 800 }}>
                        PORTFOLIO STATUS: ONLINE
                    </div>
                </div>
            </div>

            {/* ── HIGH-IMPACT CV PREVIEW ── */}
            <div id="cv-card" className="cv-card">

                {/* Header */}
                <div className="cv-card-header" style={{ padding: "60px 48px", background: "linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)", borderBottom: "1px solid var(--border)", display: "flex", gap: 40, alignItems: "center" }}>
                    <div style={{
                        width: 140, height: 140, borderRadius: "50%",
                        background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                        padding: 3, flexShrink: 0,
                        boxShadow: "0 0 50px rgba(108,99,255,0.3)",
                    }}>
                        <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "var(--bg-primary)" }}>
                            {profile?.avatarUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={profile.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 900, color: "var(--text-primary)" }}>MH</div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 style={{ fontSize: "3rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-0.02em" }}>{profile?.name || "Your Name"}</h2>
                        <p style={{ fontSize: "1.4rem", color: "var(--accent)", fontWeight: 700, marginBottom: 12 }}>{profile?.title || "Professional Title"}</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 14, color: "var(--text-muted)", fontSize: 13 }}>
                            {/* All social links in one row */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 32px", marginBottom: 4 }}>
                                {profile?.socialLinks?.map((link, i) => (
                                    <a key={i} href={link.url} target="_blank" rel="noreferrer" style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        textDecoration: "none",
                                        color: "var(--text-primary)",
                                        fontWeight: 700,
                                        fontSize: 13,
                                        transition: "opacity 0.2s"
                                    }}>
                                        <span style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transform: "translateY(2.5px)", // Improved vertical correction for this specific font
                                            opacity: 0.9,
                                            flexShrink: 0
                                        }}>
                                            <SocialIcon platform={link.platform} />
                                        </span>
                                        <span style={{ lineHeight: 1 }}>{link.platform}</span>
                                    </a>
                                ))}
                            </div>

                            {/* Main Contact (Email & Address) */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 32, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
                                {profile?.email && <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Mail size={16} color="var(--accent)" /> <a href={`mailto:${profile.email}`} className="transition-colors hover:text-[#6c63ff]" style={{ color: "inherit", textDecoration: "none" }}>{profile.email}</a></span>}
                                {profile?.address && <span style={{ display: "flex", alignItems: "center", gap: 8 }}><MapPin size={16} color="var(--accent)" /> {profile.address}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <CvPreviewGrid
                    profile={profile}
                    education={education}
                    experience={experience}
                    skills={skills}
                    certificates={certificates}
                    activities={activities}
                    publications={publications}
                    references={references}
                    projects={projects}
                />
            </div>

            <AtsResume
                profile={profile}
                education={education}
                experience={experience}
                skills={skills}
                certificates={certificates}
                activities={activities}
                publications={publications}
                references={references}
                projects={projects}
            />

            {/* ── MANAGE CV DATA ── */}
            <div className="hide-on-print" style={{ marginTop: 64 }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 28, color: "var(--text-primary)" }}>Management Dashboard</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 20 }}>
                    {adminCards.map((card) => (
                        <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
                            <div className="glass quick-btn" style={{
                                padding: "28px 20px", textAlign: "center",
                                border: "1px solid var(--border)", borderRadius: 20,
                                transition: "all 0.3s ease",
                            }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
                                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)" }}>{card.title}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
