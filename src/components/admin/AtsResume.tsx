import React from "react";
import { Mail, MapPin, Calendar, CheckCircle, Link as LinkIcon, Edit2, Star, Trophy, Zap, Lightbulb, Github, Linkedin, Facebook, Instagram, Youtube, Twitter } from "lucide-react";

export default function AtsResume({ profile, education, experience, skills, certificates, activities, publications, references }: any) {
    // Collect initials for the avatar placeholder
    const getInitials = (name: string) => {
        if (!name) return "MM";
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    };

    const getSocialIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('github')) return <Github size={12} color="#007bff" />;
        if (p.includes('linkedin')) return <Linkedin size={12} color="#007bff" />;
        if (p.includes('facebook')) return <Facebook size={12} color="#007bff" />;
        if (p.includes('instagram')) return <Instagram size={12} color="#007bff" />;
        if (p.includes('youtube')) return <Youtube size={12} color="#007bff" />;
        if (p.includes('twitter') || p.includes(' x ')) return <Twitter size={12} color="#007bff" />;
        return <LinkIcon size={12} color="#007bff" />;
    };

    return (
        <div id="ats-cv" className="ats-resume">
            <style>{`
                .ats-resume {
                    display: none;
                }
                @media print {
                    html, body {
                        background: #fff !important;
                        background-color: #fff !important;
                        color: #000 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        height: auto !important;
                    }
                    .ats-resume {
                        display: block !important;
                        background: #fff !important;
                        color: #000 !important;
                        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
                        line-height: 1.25;
                        padding: 0;
                        margin: 0;
                        width: 100%;
                        position: static !important;
                        overflow: visible !important;
                    }
                    
                    /* Page Settings */
                    @page { 
                        size: A4 portrait; 
                        margin: 15mm 15mm; 
                    }
                    
                    /* Global Overrides */
                    .ats-resume * {
                        box-sizing: border-box;
                    }
                    
                    /* Top Header Grid */
                    .ats-header-grid {
                        display: grid;
                        grid-template-columns: 1fr auto;
                        gap: 12pt;
                        align-items: center;
                        margin-bottom: 16pt;
                    }
                    
                    .ats-name { font-size: 26pt; font-weight: 800; margin: 0 0 4pt 0; text-transform: uppercase; color: #000; letter-spacing: 0.5px; }
                    .ats-title { font-size: 13pt; font-weight: 700; margin: 0 0 8pt 0; text-transform: uppercase; color: #007bff !important; letter-spacing: 0.2px; }
                    
                    .ats-contact-row { display: flex; flex-wrap: wrap; gap: 12pt; font-size: 9.5pt; color: #444; font-weight: 600; align-items: center; }
                    .ats-contact-item { display: flex; align-items: center; gap: 4pt; }
                    .ats-contact-item a { color: inherit; text-decoration: none; }
                    .ats-contact-item a:hover { text-decoration: underline; }
                    
                    .ats-avatar-circle {
                        width: 100pt;
                        height: 100pt;
                        border-radius: 50%;
                        background-color: #0084ff !important;
                        color: #000 !important;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 28pt;
                        font-weight: 800;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        overflow: hidden;
                        margin-right: 15pt;
                    }
                    .ats-avatar-circle img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    /* Main Split Layout */
                    .ats-body-grid {
                        display: block;
                    }
                    
                    /* Sections */
                    .ats-section { margin-bottom: 12pt; page-break-inside: avoid; }
                    .ats-section-title { 
                        font-size: 13pt; 
                        font-weight: 800; 
                        text-transform: uppercase; 
                        border-bottom: 2.5px solid #000; 
                        margin-bottom: 6pt; 
                        padding-bottom: 1pt; 
                        color: #000;
                    }

                    /* Custom Divider between items */
                    .ats-item { 
                        padding-bottom: 6pt;
                        margin-bottom: 6pt;
                        border-bottom: 1px dotted #ccc;
                        page-break-inside: avoid; 
                    }
                    .ats-item:last-child {
                        border-bottom: none;
                        padding-bottom: 0;
                        margin-bottom: 0;
                    }

                    /* Typography details */
                    .ats-item-title { font-weight: 800; font-size: 11.5pt; color: #000; margin-bottom: 2pt; line-height: 1.2; }
                    .ats-item-subtitle { font-weight: 700; font-size: 10pt; color: #007bff !important; margin-bottom: 2pt; }
                    .ats-item-date { font-size: 9pt; color: #777; display: flex; align-items: center; gap: 4pt; margin-bottom: 2pt; font-weight: 500; }
                    
                    .ats-resume p { font-size: 9.5pt; color: #444; margin: 0 0 2pt 0; text-align: justify; line-height: 1.25; }
                    .ats-resume ul { font-size: 9.5pt; color: #444; margin: 0 0 0 15pt; padding: 0; list-style-type: disc; }
                    .ats-resume li { margin-bottom: 1pt; text-align: justify; }

                    /* Skills specific */
                    .ats-skill-tag {
                        display: inline-block;
                        border-bottom: 1.5px solid #888;
                        padding-bottom: 2pt;
                        margin-right: 12pt;
                        margin-bottom: 6pt;
                        font-size: 9pt;
                        font-weight: 700;
                        color: #333;
                    }

                    .ats-interest-item {
                        display: flex;
                        gap: 6pt;
                        align-items: flex-start;
                        margin-bottom: 4pt;
                    }
                }
            `}</style>

            {/* HEADER */}
            <div className="ats-header-grid">
                <div>
                    <h1 className="ats-name">{profile?.name || "MD. MIRAZUL HASAN"}</h1>
                    <h2 className="ats-title">{profile?.title || "AI ENGINEER, AI AGENT AUTOMATION"}</h2>

                    <div className="ats-contact-row">
                        {profile?.email && (
                            <div className="ats-contact-item">
                                <Mail size={12} color="#007bff" />
                                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                            </div>
                        )}
                    </div>
                    <div className="ats-contact-row" style={{ marginTop: '4pt' }}>
                        {profile?.address && (
                            <div className="ats-contact-item">
                                <MapPin size={12} color="#007bff" />
                                <span>{profile.address}</span>
                            </div>
                        )}
                    </div>
                    {profile?.socialLinks?.length > 0 && (
                        <div className="ats-contact-row" style={{ marginTop: '4pt' }}>
                            {profile.socialLinks.map((l: any, idx: number) => (
                                <div key={idx} className="ats-contact-item">
                                    {getSocialIcon(l.platform)}
                                    <a href={l.url} target="_blank" rel="noopener noreferrer">{l.platform}</a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="ats-avatar-circle">
                    {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Profile" />
                    ) : (
                        getInitials(profile?.name)
                    )}
                </div>
            </div>

            {/* SINGLE COLUMN BODY */}
            <div className="ats-body-grid">
                
                {/* SUMMARY */}
                {(profile?.bio || profile?.aboutTitle) && (
                    <div className="ats-section">
                        <div className="ats-section-title">Summary</div>
                        <p>{profile?.bio || "Passionate about developing innovative solutions."}</p>
                    </div>
                )}

                {/* EXPERIENCE */}
                {experience?.length > 0 && (
                    <div className="ats-section">
                        <div className="ats-section-title">Experience</div>
                        {experience.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((exp: any) => (
                            <div key={exp.id} className="ats-item">
                                <div className="ats-item-title">{!exp.current ? `Former ${exp.position}` : exp.position}</div>
                                <div className="ats-item-subtitle">{exp.company}</div>
                                <div className="ats-item-date">
                                    <Calendar size={11} color="#777" />
                                    {new Date(exp.startDate).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })} -
                                    {exp.current ? " Present" : exp.endDate ? ` ${new Date(exp.endDate).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}` : ""}
                                </div>
                                {exp.description && (
                                    <p>{exp.description.replace(/^[-\*]\s*/gm, '')}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* EDUCATION */}
                {education?.length > 0 && (
                    <div className="ats-section">
                        <div className="ats-section-title">Education</div>
                        {education.sort((a: any, b: any) => {
                            // Prioritize MS in CS or anything with "Master" as the latest
                            const aIsMaster = a.degree?.toLowerCase().includes("master");
                            const bIsMaster = b.degree?.toLowerCase().includes("master");
                            if (aIsMaster && !bIsMaster) return -1;
                            if (!aIsMaster && bIsMaster) return 1;
                            
                            // Otherwise sort by date
                            const aDate = new Date(a.startDate || a.passingYear || 0).getTime();
                            const bDate = new Date(b.startDate || b.passingYear || 0).getTime();
                            return bDate - aDate;
                        }).map((edu: any) => (
                            <div key={edu.id} className="ats-item">
                                <div className="ats-item-title">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</div>
                                <div className="ats-item-subtitle">{edu.school}</div>
                                <div className="ats-item-date">
                                    <Calendar size={11} color="#777" />
                                    {edu.current ? "Present" : (edu.passingYear || "Ongoing")}
                                </div>
                                {edu.grade && <p>{edu.gradeType}: {edu.grade} {edu.gradeScale ? `/ ${edu.gradeScale}` : ""}</p>}
                            </div>
                        ))}
                    </div>
                )}

                {/* SKILLS */}
                {skills?.length > 0 && (
                    <div className="ats-section">
                        <div className="ats-section-title">Skills</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {/* Flatten all skills across categories to closely match the image */}
                            {skills.map((skill: any) => (
                                <span key={skill.id} className="ats-skill-tag">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* CERTIFICATIONS */}
                {certificates?.length > 0 && (
                    <div className="ats-section">
                        <div className="ats-section-title">Certifications</div>
                        {certificates.map((cert: any) => (
                            <div key={cert.id} className="ats-item">
                                <div className="ats-item-title" style={{ fontSize: '10.5pt' }}>{cert.title}</div>
                                <div className="ats-resume" style={{ display: 'block', fontSize: '9pt', color: '#666' }}>{cert.issuer}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* RESEARCH PAPERS (Publications) */}
                {publications?.length > 0 && (
                    <div className="ats-section">
                        <div className="ats-section-title">Research Papers</div>
                        {publications.map((pub: any, index: number) => (
                            <div key={pub.id} className="ats-interest-item ats-item" style={{ borderBottom: '1px dotted #ccc', paddingBottom: '6pt', marginBottom: '6pt' }}>
                                <div style={{ marginTop: '2pt' }}>
                                    {index === 0 ? <Edit2 size={13} color="#0084ff" /> : index === 1 ? <Star size={14} color="#0084ff" /> : <Trophy size={14} color="#0084ff" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="ats-item-title" style={{ fontSize: '10pt', marginBottom: '1pt' }}>{pub.title} {pub.submitted && "(Submitted)"}</div>
                                    <div style={{ fontSize: '9pt', color: '#666', lineHeight: 1.25 }}>{pub.publisher}</div>
                                    {pub.date && new Date(pub.date).getUTCFullYear() !== 1970 && (
                                        <div className="ats-item-date" style={{ marginTop: '3pt', marginBottom: 0 }}>
                                            {new Date(pub.date).getFullYear()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* EXTRA CURRICULAR ACTIVITIES */}
                {activities?.length > 0 && (
                    <div className="ats-section">
                        <div className="ats-section-title">Extra Curricular Activities</div>
                        {activities.map((act: any, index: number) => (
                            <div key={act.id} className="ats-interest-item ats-item" style={{ borderBottom: '1px dotted #ccc', paddingBottom: '6pt', marginBottom: '6pt' }}>
                                <div style={{ marginTop: '2pt' }}>
                                    {index === 0 ? <Zap size={14} color="#0084ff" /> : index === 1 ? <Lightbulb size={14} color="#0084ff" /> : index === 2 ? <Trophy size={14} color="#0084ff" /> : <CheckCircle size={14} color="#0084ff" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="ats-item-title" style={{ fontSize: '10pt', marginBottom: '1pt' }}>{!act.current ? "Former " : ""}{act.role || act.title}</div>
                                    <div style={{ fontSize: '9pt', color: '#666', lineHeight: 1.25 }}>{act.role ? act.title : act.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* REFERENCES */}
                {references?.length > 0 && (
                    <div className="ats-section">
                        <div className="ats-section-title">References</div>
                        {references.map((ref: any) => (
                            <div key={ref.id} className="ats-item">
                                <div className="ats-item-title" style={{ fontSize: '10.5pt' }}>{ref.name}</div>
                                <div style={{ fontSize: '9pt', color: '#444', fontWeight: 600 }}>{ref.designation}</div>
                                {ref.company && <div style={{ fontSize: '9pt', color: '#666' }}>{ref.company}</div>}
                                {ref.email && <div style={{ fontSize: '9pt', color: '#007bff' }}><a href={`mailto:${ref.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{ref.email}</a></div>}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
