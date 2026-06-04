import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSiteId, getPublishUrl } from "@/lib/utils";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let siteId = project.siteId;
  if (!siteId) {
    siteId = generateSiteId();
    let exists = await prisma.project.findUnique({ where: { siteId } });
    while (exists) {
      siteId = generateSiteId();
      exists = await prisma.project.findUnique({ where: { siteId } });
    }
  }

  const updated = await prisma.project.update({
    where: { id },
    data: {
      siteId,
      published: true,
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({
    ok: true,
    siteId: updated.siteId,
    url: getPublishUrl(updated.siteId!),
  });
}
