import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
    try {
        const skills = await prisma.skill.findMany({
            // @ts-ignore
            orderBy: [{ order: "asc" }, { level: "desc" }]
        });
        return NextResponse.json(skills);
    } catch {
        return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { orders, renameCategory } = body;

        if (renameCategory) {
            const { oldName, newName } = renameCategory;
            await prisma.skill.updateMany({
                where: { category: oldName },
                data: { category: newName }
            });
            return NextResponse.json({ success: true });
        }

        if (orders) {
            await Promise.all(
                orders.map((item: any) =>
                    prisma.skill.update({
                        where: { id: item.id },
                        // @ts-ignore
                        data: { order: item.order }
                    })
                )
            );
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    } catch {
        return NextResponse.json({ error: "Operation failed" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, category, level } = body;

        const skill = await prisma.skill.create({
            data: { name, category, level: parseInt(level) || 0 }
        });
        return NextResponse.json(skill);
    } catch {
        return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        const body = await req.json();
        const { name, category, level } = body;

        const skill = await prisma.skill.update({
            where: { id },
            data: { name, category, level: parseInt(level) || 0 }
        });
        return NextResponse.json(skill);
    } catch {
        return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const category = searchParams.get("category");

        if (category) {
            await prisma.skill.deleteMany({ where: { category } });
            return NextResponse.json({ success: true });
        }

        if (!id) return NextResponse.json({ error: "ID or Category is required" }, { status: 400 });

        await prisma.skill.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
