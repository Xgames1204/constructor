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

import { DEFAULT_PROJECT_DATA, type ProjectData } from "@/types/editor";

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
        parsed.elements.root = {
          id: "root", type: "section", name: "Страница",
          children: [], parentId: null, positionMode: "relative",
          styles: { minHeight: "100vh", width: "100%", backgroundColor: "#ffffff", position: "relative" },
        };
        if (!parsed.rootIds.includes("root")) parsed.rootIds.unshift("root");
      }
      return parsed;
    }
  } catch {
    /* empty */
  }
  return JSON.parse(JSON.stringify(DEFAULT_PROJECT_DATA)) as ProjectData;
}
