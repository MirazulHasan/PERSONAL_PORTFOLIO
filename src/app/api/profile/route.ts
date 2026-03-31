import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const profile = await prisma.profile.findFirst({
            include: {
                socialLinks: {
                    orderBy: { order: 'asc' }
                }
            }
        });
        return NextResponse.json(profile);
    } catch {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const {
            name, title, bio = "", aboutTitle, address, avatarUrl, resumeUrl, email,
            socialLinks = [],
            educationTitle, educationSubtitle,
            experienceTitle, experienceSubtitle,
            skillsTitle, skillsSubtitle,
            projectsTitle, projectsSubtitle,
            certificatesTitle, certificatesSubtitle,
            publicationsTitle, publicationsSubtitle,
            activitiesTitle, activitiesSubtitle,
            referencesTitle, referencesSubtitle,
            blogTitle, blogSubtitle
        } = body;

        const profile = await prisma.profile.findFirst();
        let updated;

        // Helper to use provided value or fall back to system defaults if blank
        const clean = (val: string, fallback: string) => (val && val.trim() !== "") ? val : fallback;

        const data: any = {
            name, title, bio, aboutTitle, address, avatarUrl, resumeUrl, email,
            educationTitle: clean(educationTitle, "Academic Background"),
            educationSubtitle: clean(educationSubtitle, "Education"),
            experienceTitle: clean(experienceTitle, "Professional Experience"),
            experienceSubtitle: clean(experienceSubtitle, "Career Path"),
            skillsTitle: clean(skillsTitle, "Core Expertise"),
            skillsSubtitle: clean(skillsSubtitle, "Technical Stack"),
            projectsTitle: clean(projectsTitle, "Featured Projects"),
            projectsSubtitle: clean(projectsSubtitle, "Portfolio"),
            certificatesTitle: clean(certificatesTitle, "Certifications"),
            certificatesSubtitle: clean(certificatesSubtitle, "Recognition"),
            publicationsTitle: clean(publicationsTitle, "Research & Publications"),
            publicationsSubtitle: clean(publicationsSubtitle, "Academic Work"),
            activitiesTitle: clean(activitiesTitle, "Extra-Curricular Activities"),
            activitiesSubtitle: clean(activitiesSubtitle, "Involvement"),
            referencesTitle: clean(referencesTitle, "References"),
            referencesSubtitle: clean(referencesSubtitle, "Endorsements"),
            blogTitle: clean(blogTitle, "Latest Writing"),
            blogSubtitle: clean(blogSubtitle, "Journal")
        };

        if (profile) {
            updated = (prisma.profile as any).update({
                where: { id: profile.id },
                data: {
                    ...data,
                    socialLinks: {
                        deleteMany: {},
                        create: socialLinks.map((link: any, index: number) => ({
                            platform: link.platform,
                            url: link.url,
                            order: index
                        }))
                    }
                },
                include: { socialLinks: true }
            });
        } else {
            updated = (prisma.profile as any).create({
                data: {
                    ...data,
                    socialLinks: {
                        create: socialLinks.map((link: any) => ({
                            platform: link.platform,
                            url: link.url
                        }))
                    }
                },
                include: { socialLinks: true }
            });
        }

        // Finalize the update/create
        updated = await updated;
        return NextResponse.json(updated);


    } catch (error: any) {
        console.error("Profile Update Error Details:", error.message, error.stack);
        return NextResponse.json({
            error: "Failed to update profile",
            details: error.message
        }, { status: 500 });
    }
}
