import { useEffect, useState } from "react";
import { useParams } from "wouter";

export default function PublishedSitePage() {
  const { siteId } = useParams<{ siteId: string }>();
  const [html, setHtml] = useState("");
  const [scripts, setScripts] = useState("");
  const [apiBootstrap, setApiBootstrap] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/site/${siteId}`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        // rawData comes from the API; render it client-side
        if (data.data) {
          import("@/lib/site-renderer").then(({ renderProjectBody }) => {
            import("@/lib/utils").then(({ parseProjectData }) => {
              const projectData = parseProjectData(data.data);
              const rendered = renderProjectBody(projectData, data.siteId || "");
              setHtml(rendered.html);
              setScripts(rendered.scripts);
              setApiBootstrap(rendered.apiBootstrap || "");
            });
          });
        } else {
          setHtml(data.html || "");
          setScripts(data.scripts || "");
          setApiBootstrap(data.apiBootstrap || "");
        }
      });
  }, [siteId]);

  if (notFound) {
    return (
      <div style={{ padding: 48, textAlign: "center", fontFamily: "system-ui" }}>
        <h1>404</h1>
        <p>Сайт не найден или не опубликован.</p>
        <a href="/">Constructor</a>
      </div>
    );
  }

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
      {apiBootstrap ? <script dangerouslySetInnerHTML={{ __html: apiBootstrap }} /> : null}
      <script dangerouslySetInnerHTML={{ __html: scripts }} />
    </>
  );
}
