import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PROJECT_DATA } from "@/types/editor";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      published: true,
      siteId: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = body.name || "Новый сайт";

  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      name,
      data: JSON.stringify(DEFAULT_PROJECT_DATA),
    },
  });

  return NextResponse.json({ project });
}
