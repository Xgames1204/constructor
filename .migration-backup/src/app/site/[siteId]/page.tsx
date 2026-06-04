import { prisma } from "@/lib/prisma";
import { parseProjectData } from "@/lib/utils";
import { renderProjectBody } from "@/lib/site-renderer";
import { notFound } from "next/navigation";

export default async function PublishedSitePage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;

  const project = await prisma.project.findFirst({
    where: { siteId, published: true },
  });

  if (!project) {
    notFound();
  }

  const data = parseProjectData(project.data);
  const { html, scripts, apiBootstrap } = renderProjectBody(data, siteId);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; }
        img, video, iframe { max-width: 100%; }
        .c-hidden { display: none !important; }
        button { cursor: pointer; }
        input, textarea { font: inherit; max-width: 100%; }
        p, h1, h2, h3, a, button, span { overflow-wrap: anywhere; word-break: break-word; }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {apiBootstrap ? (
        <script dangerouslySetInnerHTML={{ __html: apiBootstrap }} />
      ) : null}
      <script dangerouslySetInnerHTML={{ __html: scripts }} />
    </>
  );
}
