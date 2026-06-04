import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db, usersTable, sessionsTable, projectsTable } from "@workspace/db";

const router = Router();

async function getSessionUser(req: any): Promise<{ id: string; email: string; name: string | null; image: string | null } | null> {
  const sessionId = req.cookies?.session_id;
  if (!sessionId) return null;

  const session = await db.query.sessionsTable.findFirst({
    where: eq(sessionsTable.id, sessionId),
  });

  if (!session || session.expiresAt < new Date()) return null;

  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, session.userId) });
  if (!user) return null;

  return { id: user.id, email: user.email, name: user.name, image: user.image };
}

function generateSiteId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `site_${num}`;
}

function getPublishUrl(siteId: string): string {
  const domains = process.env.REPLIT_DOMAINS;
  if (domains) {
    const domain = domains.split(",")[0].trim();
    return `https://${domain}/site/${siteId}`;
  }
  return `/site/${siteId}`;
}

router.get("/projects", async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const projects = await db.query.projectsTable.findMany({
      where: eq(projectsTable.userId, user.id),
      orderBy: desc(projectsTable.updatedAt),
      columns: { id: true, name: true, published: true, siteId: true, updatedAt: true, createdAt: true },
    });

    return res.json({ projects });
  } catch (e) {
    req.log.error(e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/projects", async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const name = req.body?.name || "Новый сайт";
    const id = randomUUID();

    const defaultData = {
      version: 1,
      elements: {
        root: {
          id: "root",
          type: "section",
          name: "Страница",
          children: [],
          parentId: null,
          positionMode: "relative",
          styles: {
            minHeight: "100vh",
            width: "100%",
            backgroundColor: "#ffffff",
            position: "relative",
          },
        },
      },
      rootIds: ["root"],
      scripts: [],
      globalScripts: [],
      meta: { title: name, description: "", lang: "ru" },
      settings: { canvasWidth: 1200, gridSize: 8, snapToGrid: true },
      server: { enabled: false, endpoints: [] },
    };

    await db.insert(projectsTable).values({
      id,
      userId: user.id,
      name,
      data: JSON.stringify(defaultData),
    });

    const project = await db.query.projectsTable.findFirst({ where: eq(projectsTable.id, id) });
    return res.json({ project });
  } catch (e) {
    req.log.error(e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/projects/:id", async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const project = await db.query.projectsTable.findFirst({
      where: and(eq(projectsTable.id, req.params.id), eq(projectsTable.userId, user.id)),
    });

    if (!project) return res.status(404).json({ error: "Not found" });
    return res.json({ project });
  } catch (e) {
    req.log.error(e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.put("/projects/:id", async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const existing = await db.query.projectsTable.findFirst({
      where: and(eq(projectsTable.id, req.params.id), eq(projectsTable.userId, user.id)),
    });

    if (!existing) return res.status(404).json({ error: "Not found" });

    const body = req.body || {};
    await db.update(projectsTable)
      .set({
        name: body.name ?? existing.name,
        data: body.data ?? existing.data,
        description: body.description ?? existing.description,
        updatedAt: new Date(),
      })
      .where(eq(projectsTable.id, req.params.id));

    const project = await db.query.projectsTable.findFirst({ where: eq(projectsTable.id, req.params.id) });
    return res.json({ project });
  } catch (e) {
    req.log.error(e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    await db.delete(projectsTable)
      .where(and(eq(projectsTable.id, req.params.id), eq(projectsTable.userId, user.id)));

    return res.json({ ok: true });
  } catch (e) {
    req.log.error(e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/projects/:id/publish", async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const project = await db.query.projectsTable.findFirst({
      where: and(eq(projectsTable.id, req.params.id), eq(projectsTable.userId, user.id)),
    });

    if (!project) return res.status(404).json({ error: "Not found" });

    let siteId = project.siteId;
    if (!siteId) {
      siteId = generateSiteId();
      let exists = await db.query.projectsTable.findFirst({ where: eq(projectsTable.siteId, siteId) });
      while (exists) {
        siteId = generateSiteId();
        exists = await db.query.projectsTable.findFirst({ where: eq(projectsTable.siteId, siteId) });
      }
    }

    await db.update(projectsTable)
      .set({ siteId, published: true, publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(projectsTable.id, req.params.id));

    return res.json({ ok: true, siteId, url: getPublishUrl(siteId) });
  } catch (e) {
    req.log.error(e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/site/:siteId", async (req, res) => {
  try {
    const project = await db.query.projectsTable.findFirst({
      where: and(eq(projectsTable.siteId, req.params.siteId), eq(projectsTable.published, true)),
    });

    if (!project) return res.status(404).json({ error: "Not found" });
    // Return raw data; the frontend will render it using the site-renderer lib
    return res.json({ data: project.data, siteId: project.siteId });
  } catch (e) {
    req.log.error(e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
