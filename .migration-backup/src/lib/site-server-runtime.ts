import type { ProjectData, SiteServerEndpoint } from "@/types/editor";
import {
  executeServerLogic,
  executeStaticFallback,
} from "./server-block-runtime";

export function normalizePath(path: string): string {
  return path.replace(/^\/+/, "").replace(/\/+$/, "") || "";
}

export function findEndpoint(
  data: ProjectData,
  method: string,
  pathSegments: string[]
): SiteServerEndpoint | null {
  const path = pathSegments.join("/");
  const endpoints = data.server?.endpoints ?? [];
  return (
    endpoints.find(
      (e) =>
        e.method === method &&
        normalizePath(e.path) === normalizePath(path)
    ) ?? null
  );
}

export function executeEndpoint(
  endpoint: SiteServerEndpoint,
  requestBody: unknown,
  queryParams: Record<string, string> = {}
): { status: number; body: unknown } {
  if (endpoint.useBlockLogic && endpoint.logic?.nodes?.length) {
    return executeServerLogic(endpoint, requestBody, queryParams);
  }
  return executeStaticFallback(endpoint, requestBody);
}

export function getSiteApiBase(siteId: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  return `${base}/api/site-runtime/${siteId}`;
}
