import type { BlockEdge, BlockNode, SiteServerEndpoint } from "@/types/editor";
type Ctx = {
  vars: Record<string, unknown>;
  body: Record<string, unknown>;
  query: Record<string, string>;
  response: { status: number; body: unknown } | null;
};

function getOutgoing(
  nodeId: string,
  edges: BlockEdge[],
  handle = "default"
): string[] {
  return edges
    .filter(
      (e) =>
        e.source === nodeId &&
        (handle === "default" || e.sourceHandle === handle)
    )
    .map((e) => e.target);
}

function evalCond(left: string, op: string, right: string, ctx: Ctx): boolean {
  const l = ctx.vars[left] ?? left;
  const r = ctx.vars[right] ?? right;
  const ls = String(l);
  const rs = String(r);
  switch (op) {
    case "==":
      return ls == rs;
    case "!=":
      return ls != rs;
    case ">":
      return Number(l) > Number(r);
    case "<":
      return Number(l) < Number(r);
    case "includes":
      return ls.includes(rs);
    default:
      return false;
  }
}

function runChain(
  startIds: string[],
  nodes: BlockNode[],
  edges: BlockEdge[],
  ctx: Ctx,
  visited: Set<string>
): void {
  const map = new Map(nodes.map((n) => [n.id, n]));

  for (const id of startIds) {
    if (visited.has(id)) continue;
    visited.add(id);
    const node = map.get(id);
    if (!node) continue;
    const d = node.data;

    switch (node.type) {
      case "srv_get_body": {
        const field = d.field || "";
        ctx.vars[d.varName || field] =
          (ctx.body as Record<string, unknown>)?.[field] ?? null;
        break;
      }
      case "srv_get_query": {
        const param = d.param || "";
        ctx.vars[d.varName || param] = ctx.query[param] ?? "";
        break;
      }
      case "srv_set_var":
        ctx.vars[d.name || "x"] = d.value ?? "";
        break;
      case "srv_if": {
        const ok = evalCond(d.left || "", d.operator || "==", d.right || "", ctx);
        runChain(
          getOutgoing(id, edges, ok ? "true" : "false"),
          nodes,
          edges,
          ctx,
          new Set(visited)
        );
        continue;
      }
      case "srv_validate": {
        const field = d.field || "";
        const val = (ctx.body as Record<string, unknown>)?.[field];
        const ok =
          d.required === "yes"
            ? val !== undefined && val !== null && val !== ""
            : true;
        runChain(
          getOutgoing(id, edges, ok ? "true" : "false"),
          nodes,
          edges,
          ctx,
          new Set(visited)
        );
        continue;
      }
      case "srv_repeat": {
        const count = parseInt(d.count || "1", 10) || 1;
        for (let i = 0; i < count; i++) {
          ctx.vars["_i"] = i;
          runChain(getOutgoing(id, edges), nodes, edges, ctx, new Set(visited));
        }
        continue;
      }
      case "srv_foreach": {
        const arr = ctx.vars[d.arrayVar || "items"];
        const list = Array.isArray(arr) ? arr : [];
        for (const item of list) {
          ctx.vars[d.itemVar || "item"] = item;
          runChain(getOutgoing(id, edges), nodes, edges, ctx, new Set(visited));
        }
        continue;
      }
      case "srv_merge": {
        try {
          const tpl = JSON.parse(d.template || "{}");
          ctx.vars["_responseBody"] = { ...tpl, ...ctx.vars };
        } catch {
          ctx.vars["_responseBody"] = ctx.vars;
        }
        break;
      }
      case "srv_return": {
        try {
          const body = JSON.parse(d.bodyJson || "{}");
          ctx.response = {
            status: parseInt(d.status || "200", 10),
            body,
          };
        } catch {
          ctx.response = {
            status: 200,
            body: { ok: true, raw: d.bodyJson },
          };
        }
        return;
      }
      default:
        break;
    }

    if (ctx.response) return;
    runChain(
      getOutgoing(id, edges).filter((nid) => !visited.has(nid)),
      nodes,
      edges,
      ctx,
      visited
    );
  }
}

export function executeServerLogic(
  endpoint: SiteServerEndpoint,
  requestBody: unknown,
  queryParams: Record<string, string>
): { status: number; body: unknown } {
  const logic = endpoint.logic;
  if (!endpoint.useBlockLogic || !logic?.nodes?.length) {
    return executeStaticFallback(endpoint, requestBody);
  }

  const body =
    requestBody && typeof requestBody === "object"
      ? (requestBody as Record<string, unknown>)
      : {};

  const ctx: Ctx = {
    vars: { _body: body, _query: queryParams },
    body,
    query: queryParams,
    response: null,
  };

  const entries = logic.nodes.filter((n) => n.type === "srv_entry");
  const startIds =
    entries.length > 0
      ? entries.map((n) => n.id)
      : logic.nodes
          .filter((n) => !logic.edges.some((e) => e.target === n.id))
          .map((n) => n.id);

  runChain(startIds, logic.nodes, logic.edges, ctx, new Set());

  if (ctx.response) return ctx.response;

  if (ctx.vars["_responseBody"]) {
    return { status: 200, body: ctx.vars["_responseBody"] };
  }

  return executeStaticFallback(endpoint, requestBody);
}

export function executeStaticFallback(
  endpoint: SiteServerEndpoint,
  requestBody: unknown
): { status: number; body: unknown } {
  try {
    const staticResponse = JSON.parse(endpoint.responseJson || "{}");
    if (["POST", "PUT", "PATCH"].includes(endpoint.method)) {
      return {
        status: 200,
        body: { ok: true, echo: requestBody, data: staticResponse },
      };
    }
    return { status: 200, body: staticResponse };
  } catch {
    return { status: 200, body: { ok: true, message: endpoint.name } };
  }
}
