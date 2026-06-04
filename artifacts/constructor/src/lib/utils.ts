import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSiteId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `site_${num}`;
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getPublishUrl(siteId: string): string {
  return `/site/${siteId}`;
}

import { DEFAULT_PROJECT_DATA, HOME_PAGE_ID, type Page, type ProjectData } from "@/types/editor";

const DEFAULT_ROOT_EL = () => ({
  id: "root", type: "section" as const, name: "Страница",
  children: [] as string[], parentId: null as null, positionMode: "relative" as const,
  styles: { minHeight: "100vh", width: "100%", backgroundColor: "#ffffff", position: "relative" },
});

export function parseProjectData(raw: string): ProjectData {
  try {
    const parsed = JSON.parse(raw) as ProjectData;
    if (parsed.elements && parsed.rootIds) {
      if (!parsed.server) parsed.server = { enabled: false, endpoints: [] };
      if (!Array.isArray(parsed.scripts)) parsed.scripts = [];
      if (!Array.isArray(parsed.globalScripts)) parsed.globalScripts = [];
      if (!parsed.meta) parsed.meta = { title: "Мой сайт", description: "", lang: "ru" };
      if (!parsed.settings) parsed.settings = { canvasWidth: 1200, gridSize: 8, snapToGrid: true };
      if (!parsed.elements.root) {
        parsed.elements.root = DEFAULT_ROOT_EL();
        if (!parsed.rootIds.includes("root")) parsed.rootIds.unshift("root");
      }

      // --- Multi-page migration ---
      if (!Array.isArray(parsed.pages) || parsed.pages.length === 0) {
        const homePage: Page = {
          id: HOME_PAGE_ID,
          name: "Главная",
          slug: "home",
          elements: JSON.parse(JSON.stringify(parsed.elements)),
          rootIds: [...parsed.rootIds],
          scripts: [...parsed.scripts],
          globalScripts: [...parsed.globalScripts],
        };
        parsed.pages = [homePage];
        parsed.currentPageId = HOME_PAGE_ID;
      }

      // Ensure currentPageId is valid
      if (!parsed.currentPageId || !parsed.pages.find((p) => p.id === parsed.currentPageId)) {
        parsed.currentPageId = parsed.pages[0].id;
      }

      // Ensure each page has scripts arrays
      for (const page of parsed.pages) {
        if (!Array.isArray(page.scripts)) page.scripts = [];
        if (!Array.isArray(page.globalScripts)) page.globalScripts = [];
        if (!page.elements?.root) {
          page.elements = { ...page.elements, root: DEFAULT_ROOT_EL() };
        }
        if (!Array.isArray(page.rootIds) || page.rootIds.length === 0) {
          page.rootIds = ["root"];
        }
      }

      // Sync data.elements / data.rootIds / data.scripts / data.globalScripts
      // to reflect the current page (the live editing view)
      const currentPage = parsed.pages.find((p) => p.id === parsed.currentPageId)!;
      parsed.elements = JSON.parse(JSON.stringify(currentPage.elements));
      parsed.rootIds = [...currentPage.rootIds];
      parsed.scripts = [...currentPage.scripts];
      parsed.globalScripts = [...currentPage.globalScripts];

      return parsed;
    }
  } catch {
    /* empty */
  }
  return JSON.parse(JSON.stringify(DEFAULT_PROJECT_DATA)) as ProjectData;
}
