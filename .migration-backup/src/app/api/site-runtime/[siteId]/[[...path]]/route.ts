import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseProjectData } from "@/lib/utils";
import {
  executeEndpoint,
  findEndpoint,
  normalizePath,
} from "@/lib/site-server-runtime";

async function handle(
  req: Request,
  siteId: string,
  pathSegments: string[] | undefined
) {
  const project = await prisma.project.findFirst({
    where: { siteId, published: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const data = parseProjectData(project.data);

  if (!data.server?.enabled) {
    return NextResponse.json(
      { error: "Server disabled for this site" },
      { status: 403 }
    );
  }

  const segments = pathSegments ?? [];
  const endpoint = findEndpoint(data, req.method, segments);

  if (!endpoint) {
    return NextResponse.json(
      {
        error: "Endpoint not found",
        path: normalizePath(segments.join("/")),
        method: req.method,
        available: (data.server?.endpoints ?? []).map((e) => ({
          method: e.method,
          path: e.path,
        })),
      },
      { status: 404 }
    );
  }

  let body: unknown = null;
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.json();
    }
  } catch {
    body = null;
  }

  const queryParams: Record<string, string> = {};
  new URL(req.url).searchParams.forEach((v, k) => {
    queryParams[k] = v;
  });

  const result = executeEndpoint(endpoint, body, queryParams);
  return NextResponse.json(result.body, { status: result.status });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ siteId: string; path?: string[] }> }
) {
  const { siteId, path } = await params;
  return handle(req, siteId, path);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ siteId: string; path?: string[] }> }
) {
  const { siteId, path } = await params;
  return handle(req, siteId, path);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ siteId: string; path?: string[] }> }
) {
  const { siteId, path } = await params;
  return handle(req, siteId, path);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ siteId: string; path?: string[] }> }
) {
  const { siteId, path } = await params;
  return handle(req, siteId, path);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ siteId: string; path?: string[] }> }
) {
  const { siteId, path } = await params;
  return handle(req, siteId, path);
}
