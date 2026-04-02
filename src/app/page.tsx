import Link from "next/link";
import prisma from "@/lib/db";
import ClientInteractivity from "@/components/ClientInteractivity";
import ProjectCarousel from "@/components/ProjectCarousel";
import SkillTree from "@/components/SkillTree";
import Navbar from "@/components/Navbar";
import CodingPanel from "@/components/CodingPanel";
import EducationSection from "@/components/EducationSection";
import ExperienceSection from "@/components/ExperienceSection";
import PublicationSection from "@/components/PublicationSection";

export const dynamic = 'force-dynamic';

async function getProfile() {
  try {
    return await prisma.profile.findFirst({ include: { socialLinks: true } });
  } catch {
    return null;
  }
}

async function getProjects() {
  try {
    return await prisma.project.findMany({
      where: { featured: true },
      // @ts-ignore
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: 6,
    });
  } catch {
    return [];
  }
}

async function getSkills() {
  try {
    return await prisma.skill.findMany({
      // @ts-ignore
      orderBy: [{ order: "asc" }, { level: "desc" }],
    });
  } catch {
    return [];
  }
}

async function getCertificates() {
  try {
    return await prisma.certificate.findMany({
      // @ts-ignore
      orderBy: [{ order: "asc" }, { issuedAt: "desc" }],
    });
  } catch {
    return [];
  }
}

async function getActivities() {
  try { return (prisma as any).activity.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] }); } catch { return []; }
}
async function getPublications() {
  try { return (prisma as any).publication.findMany({ orderBy: [{ order: "asc" }, { date: "desc" }] }); } catch { return []; }
}
async function getReferences() {
  try { return (prisma as any).reference.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }); } catch { return []; }
}

async function getEducation() {
  try {
    return await prisma.education.findMany({
      // @ts-ignore
      orderBy: [{ order: "asc" }, { current: "desc" }, { passingYear: "desc" }],
    });
  } catch {
    return [];
  }
}

async function getExperience() {
  try {
    return await prisma.experience.findMany({
      // @ts-ignore
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
  } catch {
    return [];
  }
}

async function getPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const profile = await getProfile();
  const projects = await getProjects();
  const skills = await getSkills();
  const certificates = await getCertificates();
  const activities = await getActivities();
  const publications = await getPublications();
  const references = await getReferences();
  const education = await getEducation();
  const experience = await getExperience();
  const posts = await getPosts();

  // Group skills by category
  const skillsByCategory = skills.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});


  return (
    <main>
      <Navbar profile={profile} />

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "100px 5% 60px", // Increased top padding to ensure zero overlap
        overflow: "hidden",
      }}>

        <div className="animate-in" style={{ maxWidth: 760, position: "relative" }}>
          {/* Avatar */}
          {profile?.avatarUrl && (
            <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 10 }}>
              <div style={{
                width: 120, height: 120, borderRadius: "50%",
                background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                padding: 3, boxShadow: "0 0 60px rgba(108,99,255,0.5)",
              }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "var(--avatar-bg)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={profile.avatarUrl} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            </div>
          )}
          <div style={{
            display: "inline-block",
            padding: "6px 18px",
            borderRadius: 50,
            background: "rgba(108,99,255,0.15)",
            border: "1px solid rgba(108,99,255,0.35)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--accent)",
            marginTop: 20,
            marginBottom: 28,
            letterSpacing: "0.02em",
          }}>
            Available for new opportunities
          </div>
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24 }}>
            Hi, I&apos;m <span className="gradient-text">{profile?.name ?? "Md. Mirazul Hasan"}</span>
          </h1>
          <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 40, maxWidth: 640, margin: "0 auto 40px" }}>
            {profile?.bio ?? "Full Stack Developer crafting clean, scalable, and beautiful web applications with a passion for great user experience."}
          </p>
          <div className="hero-cta-row" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            <Link href="#projects" className="btn-glow">View My Work</Link>
            <Link href="#contact" className="btn-outline">Get in Touch</Link>
          </div>
          <CodingPanel />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "100px 5%" }}>
        <div className="reveal about-responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
          <div>
            <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>About Me</p>
            <h2 className="section-title" style={{ marginBottom: 24 }}>{(profile as any)?.aboutTitle ?? "Passionate about building things that matter"}</h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 16 }}>
              {profile?.bio ?? "I'm a full stack developer with experience building production-ready applications. I love clean code, great design, and solving hard problems."}
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              {profile?.socialLinks?.map((link: any) => (
                <a key={link.id} href={link.url} className="btn-outline" target="_blank" rel="noreferrer" style={{ fontSize: 14 }}>{link.platform}</a>
              ))}
            </div>
          </div>
          <div className="glass hover-card about-info-card" style={{ padding: 40 }}>
            {/* Avatar in about card */}
            {profile?.avatarUrl && (
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid var(--border)" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #6c63ff, #ff6584)", padding: 2,
                  boxShadow: "0 0 24px rgba(108,99,255,0.4)",
                }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "var(--avatar-bg)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={profile.avatarUrl} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>{profile.name}</p>
                  <p style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{profile.title}</p>
                </div>
              </div>
            )}
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>Role</p>
              <p style={{ fontWeight: 600 }}>{profile?.title ?? "Full Stack Developer"}</p>
            </div>
            {(profile as any)?.address && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>Address</p>
                <p style={{ fontWeight: 600 }}>{(profile as any).address}</p>
              </div>
            )}
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>Email</p>
              <p style={{ fontWeight: 600 }}>{profile?.email ?? "hello@example.com"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <section id="education" className="reveal" style={{ padding: "100px 5%" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{(profile as any)?.educationSubtitle ?? "Education"}</p>
            <h2 className="section-title" style={{ marginBottom: 60 }}>{(profile as any)?.educationTitle ?? "Academic Background"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 40, position: "relative", paddingLeft: 20 }}>
              {/* Staircase Connector (Railing) */}
              <div style={{
                position: "absolute", top: 40, left: 10, bottom: 40, width: 2,
                background: "linear-gradient(to bottom, var(--accent), var(--accent-2), transparent)",
                opacity: 0.2, borderRadius: 2
              }} />

              <EducationSection education={education} />

            </div>

          </div>
        </section>
      )}

      {/* ── EXPERIENCE ── */}
      {experience.length > 0 && (
        <section id="experience" className="reveal" style={{ padding: "100px 5%", maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{(profile as any)?.experienceSubtitle ?? "Career Path"}</p>
          <h2 className="section-title" style={{ marginBottom: 60 }}>{(profile as any)?.experienceTitle ?? "Professional Experience"}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <ExperienceSection experience={experience} />
          </div>
        </section>
      )}

      {/* ── SKILLS (Core Expertise) ── */}
      {skills.length > 0 && (
        <section id="skills" className="reveal" style={{ padding: "100px 5%" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{(profile as any)?.skillsSubtitle ?? "Technical Stack"}</p>
            <h2 className="section-title" style={{ marginBottom: 60 }}>{(profile as any)?.skillsTitle ?? "Core Expertise"}</h2>
            <SkillTree skillsByCategory={skillsByCategory} />
          </div>
        </section>
      )}

      {/* ── PROJECTS ── */}
      <section id="projects" className="reveal" style={{ padding: "100px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{(profile as any)?.projectsSubtitle ?? "Portfolio"}</p>
          <h2 className="section-title" style={{ marginBottom: 60 }}>{(profile as any)?.projectsTitle ?? "Featured Projects"}</h2>
          {projects.length === 0 ? (
            <div className="glass" style={{ padding: 60, textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>No projects yet — add them from the <a href="/admin/projects" style={{ color: "var(--accent)" }}>admin dashboard</a>.</p>
            </div>
          ) : (
            <ProjectCarousel projects={projects} />
          )}
        </div>
      </section>

      {/* ── CERTIFICATES ── */}
      {certificates.length > 0 && (
        <section id="certificates" className="reveal" style={{ padding: "100px 5%", maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{(profile as any)?.certificatesSubtitle ?? "Recognition"}</p>
          <h2 className="section-title" style={{ marginBottom: 60 }}>{(profile as any)?.certificatesTitle ?? "Certifications"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {certificates.map((cert: any) => (
              <div key={cert.id} className="glass hover-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 8 }}>{cert.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>{cert.issuer}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{cert.issuedAt && new Date(cert.issuedAt).getUTCFullYear() !== 1970 ? new Date(cert.issuedAt).getFullYear() : ""}</span>
                  {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Verify →</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PUBLICATIONS ── */}
      {publications.length > 0 && (
        <section id="publications" className="reveal" style={{ padding: "100px 5%" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{(profile as any)?.publicationsSubtitle ?? "Academic Work"}</p>
            <h2 className="section-title" style={{ marginBottom: 60 }}>{(profile as any)?.publicationsTitle ?? "Research & Publications"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <PublicationSection publications={publications} />
            </div>
          </div>
        </section>
      )}

      {/* ── EXTRA-CURRICULAR ACTIVITIES ── */}
      {activities.length > 0 && (
        <section id="activities" className="reveal" style={{ padding: "100px 5%", maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{(profile as any)?.activitiesSubtitle ?? "Involvement"}</p>
          <h2 className="section-title" style={{ marginBottom: 60 }}>{(profile as any)?.activitiesTitle ?? "Extra-Curricular Activities"}</h2>
          <div className="activities-timeline-section" style={{ position: "relative", borderLeft: "2px solid var(--border)", paddingLeft: 32, display: "flex", flexDirection: "column", gap: 48 }}>
            {(() => {
              const grouped: any[] = [];
              activities.forEach((act: any) => {
                const existing = grouped.find(g => g.title === act.title);
                if (existing) existing.roles.push(act);
                else grouped.push({ id: act.id, title: act.title, roles: [act] });
              });
              return grouped.map((group) => (
                <div key={group.id} style={{ position: "relative" }}>
                  {/* Main Timeline dot */}
                  <span className="activities-dot-main" style={{ position: "absolute", left: -41, top: 4, width: 16, height: 16, borderRadius: "50%", background: "var(--bg-primary)", border: "4px solid var(--accent)", boxShadow: "0 0 12px rgba(108,99,255,0.6)" }} />
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: group.roles.length > 1 ? 24 : 4 }}>{group.title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: group.roles.length > 1 ? 32 : 12 }}>
                    {group.roles.map((act: any) => (
                      <div key={act.id} style={{ position: "relative" }}>
                        {group.roles.length > 1 && (
                          <span className="activities-dot-sub" style={{ position: "absolute", left: -37, top: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px rgba(108,99,255,0.4)" }} />
                        )}
                        <p style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>{act.endDate && !act.current ? `Former ${act.role}` : act.role}</p>
                        {(act.startDate || act.endDate || act.current) && (
                          <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>
                            {act.startDate ? new Date(act.startDate).getFullYear() : ""}
                            {" — "}
                            {act.current ? "Present" : act.endDate ? new Date(act.endDate).getFullYear() : ""}
                          </p>
                        )}
                        {act.description && <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>{act.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </section>
      )}

      {/* ── REFERENCES ── */}
      {references.length > 0 && (
        <section id="references" className="reveal" style={{ padding: "100px 5%" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{(profile as any)?.referencesSubtitle ?? "Endorsements"}</p>
            <h2 className="section-title" style={{ marginBottom: 60 }}>{(profile as any)?.referencesTitle ?? "References"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
              {references.map((ref: any) => (
                <div key={ref.id} className="glass hover-card" style={{ padding: 28, borderTop: "4px solid var(--accent)" }}>
                  <div style={{ fontSize: 40, color: "var(--border)", marginBottom: 12, lineHeight: 1 }}>❝</div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4 }}>{ref.name}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>{ref.designation} {ref.company && `at ${ref.company}`}</p>
                  {ref.email && <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>📧 {ref.email}</p>}
                  {ref.phone && <p style={{ fontSize: 13, color: "var(--text-muted)" }}>📞 {ref.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BLOG SECTION ── */}
      {posts.length > 0 && (
        <section id="blog" className="reveal" style={{ padding: "100px 5%", maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{(profile as any)?.blogSubtitle ?? "Journal"}</p>
          <h2 className="section-title" style={{ marginBottom: 60 }}>{(profile as any)?.blogTitle ?? "Latest Writing"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {posts.map((post: any) => (
              <div key={post.id} className="glass hover-card" style={{ padding: 32 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12, fontWeight: 700 }}>
                  {new Date(post.createdAt).toLocaleDateString('en-GB')}
                </p>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <h3 className="blog-card-title">{post.title}</h3>
                </Link>
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 24, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {post.content.replace(/[#*`]/g, '').slice(0, 150)}...
                </p>
                <Link href={`/blog/${post.slug}`} style={{ color: "var(--accent)", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>Read Article →</Link>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* ── CONTACT ── */}
      <section id="contact" className="reveal" style={{ padding: "100px 5%", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Contact</p>
          <h2 className="section-title" style={{ marginBottom: 20 }}>Let&apos;s work together</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 40 }}>
            Whether you have a project in mind, a question, or just want to say hi — my inbox is always open.
          </p>
          <a href={`mailto:${profile?.email ?? "hello@example.com"}`} className="btn-glow" style={{ fontSize: "1rem" }}>
            Send me an Email
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 5%", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 12 }}>
          © {new Date().getFullYear()} {profile?.name ?? "Portfolio"}. Built with Next.js &amp; Prisma.
        </p>
        <Link href="/login" className="admin-footer-link" style={{
          fontSize: 12, color: "var(--text-muted)", textDecoration: "none",
          transition: "color 0.2s", letterSpacing: "0.04em",
        }}>Admin Login →</Link>
      </footer>
      <ClientInteractivity />
    </main>
  );
}
