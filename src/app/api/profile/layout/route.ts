import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Assume there is only one profile, or get the first one.
        const profile = await prisma.profile.findFirst();

        if (profile) {
            const updatedProfile = await prisma.profile.update({
                where: { id: profile.id },
                data: {
                    ...(body.layoutMain !== undefined && { layoutMain: body.layoutMain }),
                    ...(body.layoutSidebar !== undefined && { layoutSidebar: body.layoutSidebar }),
                    ...(body.layoutAts !== undefined && { layoutAts: body.layoutAts }),
                },
            });
            return NextResponse.json(updatedProfile);
        } else {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error updating layout:", error);
        return NextResponse.json({ error: "Failed to update layout" }, { status: 500 });
    }
}
