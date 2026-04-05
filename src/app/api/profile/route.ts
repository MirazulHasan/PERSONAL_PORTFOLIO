import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import cloudinary from "@/lib/cloudinary";

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
        console.log("PUT /api/profile - Body size:", JSON.stringify(body).length, "keys:", Object.keys(body));

        const {
            name, title, heroHeadline1, heroHeadline2, bio = "", aboutTitle, address, avatarUrl, aboutImageUrl, resumeUrl, email,
            socialLinks = [],
            educationTitle, educationSubtitle,
            experienceTitle, experienceSubtitle,
            skillsTitle, skillsSubtitle,
            projectsTitle, projectsSubtitle,
            certificatesTitle, certificatesSubtitle,
            publicationsTitle, publicationsSubtitle,
            activitiesTitle, activitiesSubtitle,
            referencesTitle, referencesSubtitle,
            heroGreetingPrefix, heroGreetingSuffix,
            blogTitle, blogSubtitle,
            availability
        } = body;

        const profile = await prisma.profile.findFirst();
        let updated;

        // Helper to upload images to Cloudinary if they are base64
        const uploadToCloudinary = async (imageUrl: string | null, folder: string) => {
            if (!imageUrl || !imageUrl.startsWith("data:image/")) return imageUrl;
            try {
                const uploadRes = await cloudinary.uploader.upload(imageUrl, {
                    folder: `portfolio/${folder}`,
                    resource_type: "auto",
                });
                return uploadRes.secure_url;
            } catch (err) {
                console.error(`Cloudinary Upload Error (${folder}):`, err);
                return imageUrl; // Fallback to original
            }
        };

        const finalAvatarUrl = await uploadToCloudinary(avatarUrl, "avatars");
        const finalAboutImageUrl = await uploadToCloudinary(aboutImageUrl, "about");

        // Helper to use provided value or fall back to system defaults if blank
        const clean = (val: string, fallback: string) => (val && val.trim() !== "") ? val : fallback;

        const data: any = {
            name, title, heroHeadline1, heroHeadline2, heroGreetingPrefix, heroGreetingSuffix, bio, aboutTitle, address, 
            avatarUrl: finalAvatarUrl, 
            aboutImageUrl: finalAboutImageUrl, 
            resumeUrl, email,
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
            blogSubtitle: clean(blogSubtitle, "Journal"),
            availability: clean(availability, "Available for new opportunities")
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
        console.error("Profile Update Error Details:", error.message, error);
        return NextResponse.json({
            error: "Failed to update profile - " + error.message,
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
