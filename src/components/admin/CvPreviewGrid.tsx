import { Github, Award, BookOpen, UserCheck, Briefcase, GraduationCap, Code, Rocket, ExternalLink } from "lucide-react";

export default function CvPreviewGrid({ profile, education, experience, skills, certificates, activities, publications, references, projects }: any) {

    const renderMap: Record<string, React.ReactNode> = {
        summary: (profile?.bio || profile?.aboutTitle) ? (
            <section key="summary" style={{ marginBottom: 48 }}>
                <h3 className="cv-section-title"><UserCheck size={16} /> Profile Summary <span /></h3>
                <p style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>{profile?.aboutTitle ?? "Professional Summary"}</p>
                <p style={{ lineHeight: 1.8, color: "var(--text-muted)", fontSize: 15, textAlign: "justify" }}>{profile?.bio || "No biography added yet."}</p>
            </section>
        ) : null,
        
        experience: experience?.length > 0 ? (
            <section key="experience" style={{ marginBottom: 48 }}>
                <h3 className="cv-section-title"><Briefcase size={16} /> Professional Experience <span /></h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    {experience.map((exp: any) => (
                        <div key={exp.id} className="cv-experience-item">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, marginBottom: 8 }}>
                                <h4 style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.3 }}>{!exp.current ? `Former ${exp.position}` : exp.position}</h4>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", whiteSpace: "nowrap", flexShrink: 0, marginTop: 3 }}>
                                    {new Date(exp.startDate).toLocaleDateString('en-GB')} — {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-GB') : ""}
                                </span>
                            </div>
                            <p style={{ fontWeight: 700, color: "var(--text-muted)", marginBottom: 12, fontSize: 14 }}>{exp.company}</p>
                            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        ) : null,
        
        education: education?.length > 0 ? (
            <section key="education" style={{ marginBottom: 48 }}>
                <h3 className="cv-section-title"><GraduationCap size={16} /> Academic Background <span /></h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {education.map((edu: any) => (
                        <div key={edu.id}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <h4 style={{ fontWeight: 800, fontSize: 16 }}>{edu.degree}</h4>
                                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700 }}>{edu.current ? "Present" : (edu.passingYear || "Ongoing")}</span>
                            </div>
                            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600 }}>{edu.school}{edu.field ? ` • ${edu.field}` : ""}</p>
                            {edu.grade && <p style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, marginTop: 4, letterSpacing: "0.02em" }}>{edu.gradeType}: {edu.grade} {edu.gradeScale ? `/ ${edu.gradeScale}` : ""}</p>}
                        </div>
                    ))}
                </div>
            </section>
        ) : null,
        
        publications: publications?.length > 0 ? (
            <section key="publications" style={{ marginBottom: 48 }}>
                <h3 className="cv-section-title"><BookOpen size={16} /> Publications <span /></h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {publications.map((pub: any) => (
                        <div key={pub.id}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                                <h4 style={{ fontSize: 15, fontWeight: 800 }}>{pub.title}</h4>
                                {pub.submitted && <span style={{ fontSize: 10, background: "rgba(255,100,0,0.1)", color: "#ff8c00", padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,100,0,0.2)", fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>SUBMITTED</span>}
                            </div>
                            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{pub.publisher} {pub.date && new Date(pub.date).getUTCFullYear() !== 1970 ? `• ${new Date(pub.date).toLocaleDateString('en-GB')}` : ""}</p>
                        </div>
                    ))}
                </div>
            </section>
        ) : null,
        
        activities: activities?.length > 0 ? (
            <section key="activities" style={{ marginBottom: 48 }}>
                <h3 className="cv-section-title"><Rocket size={16} /> Activities <span /></h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    {activities.map((act: any) => (
                        <div key={act.id}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, marginBottom: 8 }}>
                                <h4 style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.3 }}>{!act.current ? `Former ` : ""}{act.role || act.title}</h4>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", whiteSpace: "nowrap", flexShrink: 0, marginTop: 4 }}>
                                    {act.startDate ? new Date(act.startDate).toLocaleDateString('en-GB') : "N/A"} — {act.current ? "Present" : act.endDate ? new Date(act.endDate).toLocaleDateString('en-GB') : "N/A"}
                                </span>
                            </div>
                            <p style={{ fontWeight: 700, color: "var(--text-muted)", marginBottom: 12, fontSize: 14 }}>{act.role ? act.title : ""}</p>
                            {act.description && <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{act.description}</p>}
                        </div>
                    ))}
                </div>
            </section>
        ) : null,
        
        projects: projects?.length > 0 ? (
            <section key="projects" style={{ marginBottom: 48 }}>
                <h3 className="cv-section-title"><Rocket size={16} /> Selected Projects <span /></h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    {projects.map((proj: any) => (
                        <div key={proj.id}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                <h4 style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.3 }}>{proj.title}</h4>
                                {(proj.githubUrl || proj.liveUrl) && (
                                    <div style={{ display: "flex", gap: 8 }}>
                                        {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ color: "var(--text-muted)" }}><Github size={14} /></a>}
                                        {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ color: "var(--text-muted)" }}><ExternalLink size={14} /></a>}
                                    </div>
                                )}
                            </div>
                            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 12 }}>{proj.description}</p>
                            {proj.tags && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {proj.tags.split(',').map((tag: string, idx: number) => (
                                        <span key={idx} className="cv-tag-chip" style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, border: "1px solid var(--border)", color: "var(--text-primary)" }}>{tag.trim()}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        ) : null,
        
        references: references?.length > 0 ? (
            <section key="references" style={{ marginBottom: 48 }}>
                <h3 className="cv-section-title"><UserCheck size={16} /> References <span /></h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                    {references.map((ref: any) => (
                        <div key={ref.id} className="cv-reference-item">
                            <h4 style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{ref.name}</h4>
                            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                                {ref.designation}<br />
                                {ref.company}<br />
                                {ref.email && <span style={{ color: "var(--accent)" }}>{ref.email}</span>}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        ) : null,
        
        skills: skills?.length > 0 ? (
            <section key="skills" style={{ marginBottom: 48 }}>
                <h3 className="cv-section-title"><Code size={16} /> Skills & Tech <span /></h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {Object.entries(
                        skills.reduce((acc: any, skill: any) => {
                            const cat = skill.category || "Other";
                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(skill);
                            return acc;
                        }, {})
                    ).map(([category, items]: [string, any]) => (
                        <div key={category} style={{ marginBottom: 8 }}>
                            <h4 style={{ fontSize: 10, fontWeight: 900, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>{category}</h4>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 12px", justifyContent: "flex-start" }}>
                                {items.map((skill: any) => (
                                    <span key={skill.id} className="skill-chip">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        ) : null,
        
        certificates: certificates?.length > 0 ? (
            <section key="certificates" style={{ marginBottom: 48 }}>
                <h3 className="cv-section-title"><Award size={16} /> Certifications <span /></h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {certificates.map((cert: any) => (
                        <div key={cert.id}>
                            <h4 style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.4 }}>{cert.title}</h4>
                            <p style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>{cert.issuer}</p>
                            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{cert.issuedAt && new Date(cert.issuedAt).getUTCFullYear() !== 1970 ? new Date(cert.issuedAt).toLocaleDateString('en-GB') : "Recent"}</p>
                        </div>
                    ))}
                </div>
            </section>
        ) : null,
    };

    const mainKeys = profile?.layoutMain ? profile.layoutMain.split(',') : ["summary", "experience", "education", "publications", "activities", "projects", "references"];
    const sidebarKeys = profile?.layoutSidebar ? profile.layoutSidebar.split(',') : ["skills", "certificates"];

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 1, background: "var(--border)", flex: 1, minHeight: 0 }}>
            <div className="cv-main-col" style={{ background: "rgba(255,255,255,0.01)", padding: 48, overflow: "hidden" }}>
                {mainKeys.map((key: string) => renderMap[key])}
            </div>

            <div className="cv-sidebar" style={{ background: "rgba(255,255,255,0.02)", padding: 48, overflow: "hidden" }}>
                {sidebarKeys.map((key: string) => renderMap[key])}
            </div>
        </div>
    );
}
