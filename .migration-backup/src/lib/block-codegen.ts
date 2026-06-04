import type { BlockEdge, BlockNode } from "@/types/editor";
import { getBlockDef } from "./block-definitions";

function escapeStr(s: string): string {
  return JSON.stringify(s);
}

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

function generateNodeChain(
  startIds: string[],
  nodes: BlockNode[],
  edges: BlockEdge[],
  visited: Set<string>,
  indent: string
): string {
  let code = "";
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  for (const id of startIds) {
    if (visited.has(id)) continue;
    visited.add(id);
    const node = nodeMap.get(id);
    if (!node) continue;
    const d = node.data;
    const def = getBlockDef(node.type);

    switch (node.type) {
      case "set_style":
        code += `${indent}const el_${d.elementId} = document.querySelector('[data-cid="${d.elementId}"]');\n`;
        code += `${indent}if (el_${d.elementId}) el_${d.elementId}.style.${d.property || "color"} = ${escapeStr(d.value || "")};\n`;
        break;
      case "show_element":
        code += `${indent}{ const el = document.querySelector('[data-cid="${d.elementId}"]'); if (el) el.style.display = '';\n${indent}  el?.classList.remove('c-hidden'); }\n`;
        break;
      case "hide_element":
        code += `${indent}{ const el = document.querySelector('[data-cid="${d.elementId}"]'); if (el) { el.style.display = 'none'; el.classList.add('c-hidden'); } }\n`;
        break;
      case "toggle_class":
        code += `${indent}document.querySelector('[data-cid="${d.elementId}"]')?.classList.toggle(${escapeStr(d.className || "")});\n`;
        break;
      case "set_text":
        code += `${indent}{ const el = document.querySelector('[data-cid="${d.elementId}"]'); if (el) el.textContent = ${escapeStr(d.text || "")}; }\n`;
        break;
      case "navigate":
        code += `${indent}window.open(${escapeStr(d.url || "/")}, ${escapeStr(d.target || "_self")});\n`;
        break;
      case "alert":
        code += `${indent}alert(${escapeStr(d.message || "")});\n`;
        break;
      case "console_log":
        code += `${indent}console.log(${escapeStr(d.message || "")});\n`;
        break;
      case "create_variable":
        code += `${indent}let ${d.name || "myVar"} = ${d.value || "null"};\n`;
        break;
      case "set_variable":
        code += `${indent}${d.name || "myVar"} = ${d.value || "null"};\n`;
        break;
      case "set_timeout":
        code += `${indent}setTimeout(() => {\n`;
        code += generateNodeChain(
          getOutgoing(id, edges),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}}, ${d.delay || "1000"});\n`;
        continue;
      case "set_interval":
        code += `${indent}setInterval(() => {\n`;
        code += generateNodeChain(
          getOutgoing(id, edges),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}}, ${d.interval || "1000"});\n`;
        continue;
      case "if_condition": {
        const op = d.operator || "==";
        let cond = "";
        if (op === "includes") {
          cond = `String(${d.left || ""}).includes(String(${d.right || ""}))`;
        } else {
          cond = `${d.left || "true"} ${op} ${d.right || "false"}`;
        }
        code += `${indent}if (${cond}) {\n`;
        code += generateNodeChain(
          getOutgoing(id, edges, "true"),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}} else {\n`;
        code += generateNodeChain(
          getOutgoing(id, edges, "false"),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}}\n`;
        continue;
      }
      case "repeat": {
        const count = d.count || "3";
        code += `${indent}for (let _i = 0; _i < ${count}; _i++) {\n`;
        code += generateNodeChain(
          getOutgoing(id, edges),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}}\n`;
        continue;
      }
      case "for_each":
        code += `${indent}(${d.arrayVar || "[]"} || []).forEach((${d.itemVar || "item"}) => {\n`;
        code += generateNodeChain(
          getOutgoing(id, edges),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}});\n`;
        continue;
      case "http_request":
        code += `${indent}try {\n`;
        code += `${indent}  const _res = await fetch(${escapeStr(d.url || "")}, {\n`;
        code += `${indent}    method: ${escapeStr(d.method || "GET")},\n`;
        code += `${indent}    headers: JSON.parse(${escapeStr(d.headers || "{}")}),\n`;
        if (["POST", "PUT", "PATCH"].includes(d.method || "")) {
          code += `${indent}    body: JSON.stringify(JSON.parse(${escapeStr(d.body || "{}")})),\n`;
        }
        code += `${indent}  });\n`;
        code += `${indent}  let ${d.responseVar || "response"} = await _res.json().catch(() => _res.text());\n`;
        code += generateNodeChain(
          getOutgoing(id, edges, "success"),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}} catch (_err) {\n`;
        code += generateNodeChain(
          getOutgoing(id, edges, "error"),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}}\n`;
        continue;
      case "parse_json":
        code += `${indent}try {\n`;
        code += `${indent}  const _parsed = typeof ${d.sourceVar} === 'string' ? JSON.parse(${d.sourceVar}) : ${d.sourceVar};\n`;
        code += `${indent}  ${d.targetVar || "result"} = ${d.path ? `_parsed?.${d.path.split(".").join("?.")}` : "_parsed"};\n`;
        code += `${indent}} catch(e) { console.error(e); }\n`;
        break;
      case "site_api_request":
        code += `${indent}try {\n`;
        code += `${indent}  const _apiBase = window.__CONSTRUCTOR_API_BASE__ || '';\n`;
        code += `${indent}  const _apiUrl = _apiBase + '/' + ${escapeStr((d.path || "").replace(/^\//, ""))};\n`;
        code += `${indent}  const _apiRes = await fetch(_apiUrl, {\n`;
        code += `${indent}    method: ${escapeStr(d.method || "GET")},\n`;
        code += `${indent}    headers: { 'Content-Type': 'application/json' },\n`;
        if (["POST", "PUT", "PATCH"].includes(d.method || "")) {
          code += `${indent}    body: JSON.stringify(JSON.parse(${escapeStr(d.body || "{}")})),\n`;
        }
        code += `${indent}  });\n`;
        code += `${indent}  let ${d.responseVar || "apiData"} = await _apiRes.json();\n`;
        code += generateNodeChain(
          getOutgoing(id, edges, "success"),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}} catch (_apiErr) {\n`;
        code += generateNodeChain(
          getOutgoing(id, edges, "error"),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}}\n`;
        continue;
      case "set_color":
        code += `${indent}{ const el = document.querySelector('[data-cid="${d.elementId}"]'); if (el) el.style.color = ${escapeStr(d.color || "#000")}; }\n`;
        break;
      case "set_background":
        code += `${indent}{ const el = document.querySelector('[data-cid="${d.elementId}"]'); if (el) el.style.backgroundColor = ${escapeStr(d.color || "#fff")}; }\n`;
        break;
      case "set_size":
        code += `${indent}{ const el = document.querySelector('[data-cid="${d.elementId}"]'); if (el) { el.style.width = ${escapeStr(d.width || "auto")}; el.style.height = ${escapeStr(d.height || "auto")}; } }\n`;
        break;
      case "set_opacity":
        code += `${indent}{ const el = document.querySelector('[data-cid="${d.elementId}"]'); if (el) el.style.opacity = ${escapeStr(d.opacity || "1")}; }\n`;
        break;
      case "add_class":
        code += `${indent}document.querySelector('[data-cid="${d.elementId}"]')?.classList.add(${escapeStr(d.className || "")});\n`;
        break;
      case "remove_class":
        code += `${indent}document.querySelector('[data-cid="${d.elementId}"]')?.classList.remove(${escapeStr(d.className || "")});\n`;
        break;
      case "scroll_to":
        code += `${indent}document.querySelector('[data-cid="${d.elementId}"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });\n`;
        break;
      case "animate_style": {
        const prop = d.property || "opacity";
        const val = d.value || "1";
        const dur = d.duration || "300";
        code += `${indent}{ const el = document.querySelector('[data-cid="${d.elementId}"]'); if (el) { el.style.transition = ${escapeStr(prop)} ${dur}ms ease'; el.style.${prop} = ${escapeStr(val)}; } }\n`;
        break;
      }
      case "get_input_value":
        code += `${indent}let ${d.variable || "inputVal"} = document.querySelector('[data-cid="${d.elementId}"]')?.value ?? '';\n`;
        break;
      case "set_transform":
        code += `${indent}{ const el = document.querySelector('[data-cid="${d.elementId}"]'); if (el) el.style.transform = ${escapeStr(d.transform || "none")}; }\n`;
        break;
      case "compare_vars": {
        const op = d.operator || "==";
        code += `${indent}if (${d.varA || "a"} ${op} ${d.varB || "b"}) {\n`;
        code += generateNodeChain(
          getOutgoing(id, edges, "true"),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}} else {\n`;
        code += generateNodeChain(
          getOutgoing(id, edges, "false"),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}}\n`;
        continue;
      }
      case "while_loop":
        code += `${indent}while (${d.condition || "true"}) {\n`;
        code += generateNodeChain(
          getOutgoing(id, edges),
          nodes,
          edges,
          new Set(visited),
          indent + "  "
        );
        code += `${indent}}\n`;
        continue;
      case "wait_ms":
        code += `${indent}await new Promise(r => setTimeout(r, ${d.ms || "500"}));\n`;
        break;
      case "math_op":
        code += `${indent}let ${d.target || "result"} = ${d.expression || "0"};\n`;
        break;
      case "stop":
        return code;
      default:
        if (def) {
          code += `${indent}// ${def.label}\n`;
        }
    }

    const next = getOutgoing(id, edges).filter((nid) => !visited.has(nid));
    code += generateNodeChain(next, nodes, edges, visited, indent);
  }

  return code;
}

export function generateScriptFromBlocks(
  nodes: BlockNode[],
  edges: BlockEdge[]
): string {
  const triggers = nodes.filter((n) =>
    [
      "on_click",
      "on_hover",
      "on_load",
      "on_submit",
      "on_keypress",
      "on_double_click",
    ].includes(n.type)
  );

  let script = "(function() {\n";

  for (const trigger of triggers) {
    const d = trigger.data;
    let attach = "";

    switch (trigger.type) {
      case "on_click":
        attach = `document.querySelector('[data-cid="${d.elementId}"]')?.addEventListener('click', async (e) => {\n`;
        break;
      case "on_hover":
        attach = `document.querySelector('[data-cid="${d.elementId}"]')?.addEventListener('mouseenter', async (e) => {\n`;
        break;
      case "on_load":
        attach = `document.addEventListener('DOMContentLoaded', async () => {\n`;
        break;
      case "on_submit":
        attach = `document.querySelector('[data-cid="${d.elementId}"]')?.addEventListener('submit', async (e) => { e.preventDefault();\n`;
        break;
      case "on_keypress":
        attach = `document.addEventListener('keydown', async (e) => { if (e.key !== ${escapeStr(d.key || "Enter")}) return;\n`;
        break;
      case "on_double_click":
        attach = `document.querySelector('[data-cid="${d.elementId}"]')?.addEventListener('dblclick', async (e) => {\n`;
        break;
    }

    const body = generateNodeChain(
      getOutgoing(trigger.id, edges),
      nodes,
      edges,
      new Set(),
      "  "
    );

    script += attach + body + "});\n";
  }

  script += "})();\n";
  return script;
}
