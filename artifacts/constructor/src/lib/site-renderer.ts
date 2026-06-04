import type { CanvasElement, Page, ProjectData } from "@/types/editor";
import { generateScriptFromBlocks } from "./block-codegen";

function stylesToCss(styles: Record<string, string | undefined>): string {
  return Object.entries(styles)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => {
      const prop = k.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${prop}:${v}`;
    })
    .join(";");
}

interface RenderOpts {
  pages?: Page[];
  siteId?: string;
}

function renderElement(
  el: CanvasElement,
  elements: Record<string, CanvasElement>,
  opts?: RenderOpts
): string {
  if (el.hidden) return "";

  const style = stylesToCss({
    ...el.styles,
    position: el.positionMode === "flex" ? "relative" : el.positionMode,
  });

  const attrs = [
    `data-cid="${el.id}"`,
    `data-type="${el.type}"`,
    style ? `style="${style}"` : "",
    el.className ? `class="${el.className}"` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const childrenHtml = el.children
    .map((cid) => {
      const child = elements[cid];
      return child ? renderElement(child, elements, opts) : "";
    })
    .join("");

  switch (el.type) {
    case "text":
      return `<p ${attrs}>${el.content || "Текст"}</p>`;
    case "heading":
      return `<h2 ${attrs}>${el.content || "Заголовок"}</h2>`;
    case "button":
      return `<button type="button" ${attrs}>${el.content || "Кнопка"}</button>`;
    case "link": {
      let href = el.href || "#";
      if (el.navigateType === "page" && el.navigateTo && opts?.pages && opts?.siteId) {
        const target = opts.pages.find((p) => p.id === el.navigateTo);
        if (target) {
          href =
            target.slug === "home"
              ? `/site/${opts.siteId}`
              : `/site/${opts.siteId}/${target.slug}`;
        }
      }
      return `<a href="${href}" ${attrs}>${el.content || "Ссылка"}</a>`;
    }
    case "image":
      return `<img src="${el.src || "https://placehold.co/400x300"}" alt="${el.alt || ""}" ${attrs} />`;
    case "input":
      return `<input type="text" placeholder="${el.placeholder || ""}" ${attrs} />`;
    case "textarea":
      return `<textarea placeholder="${el.placeholder || ""}" ${attrs}>${el.content || ""}</textarea>`;
    case "video":
      return `<video src="${el.src || ""}" controls ${attrs}></video>`;
    case "divider":
      return `<hr ${attrs} />`;
    case "spacer":
      return `<div ${attrs} aria-hidden="true"></div>`;
    case "form":
      return `<form ${attrs}>${childrenHtml}</form>`;
    case "map":
      return `<iframe src="https://maps.google.com/maps?q=${encodeURIComponent(el.content || "Moscow")}&output=embed" ${attrs} loading="lazy"></iframe>`;
    case "embed":
      return `<iframe src="${el.src || ""}" ${attrs} loading="lazy"></iframe>`;
    case "slider":
      return `<div ${attrs} class="c-slider">${childrenHtml || '<div class="c-slide">Слайд 1</div>'}</div>`;
    case "list":
      return `<ul ${attrs}>${(el.content || "Пункт 1\nПункт 2").split("\n").map((i) => `<li>${i}</li>`).join("")}</ul>`;
    case "navbar":
    case "footer":
    case "section":
    case "container":
    case "card":
    case "tabs":
    case "accordion":
    case "table":
    default:
      return `<div ${attrs}>${childrenHtml}</div>`;
  }
}

function getPageData(data: ProjectData, slug: string) {
  const targetSlug = slug || "home";
  const page = data.pages?.find((p) => p.slug === targetSlug) ?? data.pages?.[0];
  if (page) return { elements: page.elements, rootIds: page.rootIds, scripts: page.scripts ?? [], globalScripts: page.globalScripts ?? [] };
  return { elements: data.elements, rootIds: data.rootIds, scripts: data.scripts, globalScripts: data.globalScripts };
}

export function renderProjectToHtml(data: ProjectData): string {
  const body = data.rootIds
    .map((id) => {
      const el = data.elements[id];
      return el ? renderElement(el, data.elements) : "";
    })
    .join("");

  const allScripts = [...data.globalScripts, ...data.scripts];
  const jsBlocks = allScripts
    .map((s) => generateScriptFromBlocks(s.nodes, s.edges))
    .join("\n");

  return `<!DOCTYPE html>
<html lang="${data.meta.lang || "ru"}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.meta.title || "Сайт"}</title>
  <meta name="description" content="${data.meta.description || ""}" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    img, video, iframe { max-width: 100%; }
    .c-hidden { display: none !important; }
    button { cursor: pointer; }
    input, textarea { font: inherit; }
  </style>
</head>
<body>
${body}
<script>
${jsBlocks}
</script>
</body>
</html>`;
}

export function renderProjectBody(
  data: ProjectData,
  siteId?: string | null
): {
  html: string;
  scripts: string;
  apiBootstrap: string;
} {
  return renderPageBody(data, siteId ?? "", "home");
}

export function renderPageBody(
  data: ProjectData,
  siteId: string,
  slug: string
): {
  html: string;
  scripts: string;
  apiBootstrap: string;
} {
  const page = getPageData(data, slug);
  const opts: RenderOpts = { pages: data.pages, siteId };

  const html = page.rootIds
    .map((id) => {
      const el = page.elements[id];
      return el ? renderElement(el, page.elements, opts) : "";
    })
    .join("");

  const allScripts = [...page.globalScripts, ...page.scripts];
  const scripts = allScripts
    .map((s) => generateScriptFromBlocks(s.nodes, s.edges))
    .join("\n");

  const apiBootstrap =
    siteId && data.server?.enabled
      ? `window.__CONSTRUCTOR_SITE_ID__=${JSON.stringify(siteId)};window.__CONSTRUCTOR_API_BASE__=${JSON.stringify(`/api/site-runtime/${siteId}`)};`
      : "";

  return { html, scripts, apiBootstrap };
}
