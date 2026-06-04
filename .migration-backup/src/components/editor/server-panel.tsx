"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useEditorStore } from "@/store/editor-store";
import type { SiteServerEndpoint } from "@/types/editor";
import { VisualBlockEditor } from "@/components/blocks/visual-block-editor";
import { SERVER_LOGIC_BLOCKS } from "@/lib/block-catalog";
import { Plus, Server, Trash2, Copy, Blocks, Settings2 } from "lucide-react";

export function ServerPanel({ siteId }: { siteId?: string | null }) {
  const data = useEditorStore((s) => s.data);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const [copied, setCopied] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<"settings" | "logic">("logic");

  const server = data.server ?? { enabled: false, endpoints: [] };
  const selected = server.endpoints.find((e) => e.id === selectedId);

  const updateServer = (patch: Partial<typeof server>) => {
    useEditorStore.setState((state) => {
      state.data.server = { ...state.data.server!, ...server, ...patch };
    });
    pushHistory();
  };

  const addEndpoint = () => {
    const ep: SiteServerEndpoint = {
      id: uuid(),
      name: "Новый API",
      path: "api/hello",
      method: "GET",
      responseJson: JSON.stringify({ ok: true, message: "Hello" }, null, 2),
      useBlockLogic: true,
      logic: {
        elementId: uuid(),
        nodes: [
          {
            id: uuid(),
            type: "srv_entry",
            position: { x: 80, y: 40 },
            data: {},
          },
        ],
        edges: [],
      },
    };
    updateServer({ endpoints: [...server.endpoints, ep] });
    setSelectedId(ep.id);
    setSubTab("logic");
  };

  const updateEndpoint = (id: string, patch: Partial<SiteServerEndpoint>) => {
    updateServer({
      endpoints: server.endpoints.map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    });
  };

  const baseUrl =
    siteId && typeof window !== "undefined"
      ? `${window.location.origin}/api/site-runtime/${siteId}`
      : siteId
        ? `/api/site-runtime/${siteId}`
        : null;

  return (
    <div className="flex h-full min-h-[400px] flex-col text-sm">
      <div className="border-b border-[var(--border)] p-3">
        <div className="flex items-center gap-2 text-brand-600">
          <Server className="h-5 w-5" />
          <span className="font-semibold">Сервер сайта</span>
        </div>
        <label className="mt-3 flex items-center justify-between">
          <span className="text-xs">Включить сервер</span>
          <input
            type="checkbox"
            checked={server.enabled}
            onChange={(e) => updateServer({ enabled: e.target.checked })}
            className="h-4 w-4 accent-brand-600"
          />
        </label>
        {baseUrl && (
          <code className="mt-2 block break-all rounded bg-slate-800 px-2 py-1 text-[10px] text-sky-300">
            {baseUrl}
          </code>
        )}
      </div>

      <div className="flex gap-1 border-b border-[var(--border)] p-2">
        {server.endpoints.map((ep) => (
          <button
            key={ep.id}
            type="button"
            onClick={() => setSelectedId(ep.id)}
            className={`max-w-[100px] truncate rounded px-2 py-1 text-[10px] ${
              selectedId === ep.id
                ? "bg-brand-600 text-white"
                : "bg-[var(--background)] hover:bg-black/5"
            }`}
          >
            {ep.name}
          </button>
        ))}
        <button
          type="button"
          onClick={addEndpoint}
          className="rounded border border-dashed border-brand-400 px-2 text-brand-600"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {!selected ? (
        <p className="p-4 text-center text-xs text-[var(--muted)]">
          Создайте endpoint. Логику соберите блоками — без кода.
        </p>
      ) : (
        <>
          <div className="flex border-b border-[var(--border)]">
            <button
              type="button"
              onClick={() => setSubTab("logic")}
              className={`flex flex-1 items-center justify-center gap-1 py-2 text-[10px] ${
                subTab === "logic" ? "border-b-2 border-brand-600 text-brand-600" : ""
              }`}
            >
              <Blocks className="h-3 w-3" />
              Логика блоками
            </button>
            <button
              type="button"
              onClick={() => setSubTab("settings")}
              className={`flex flex-1 items-center justify-center gap-1 py-2 text-[10px] ${
                subTab === "settings" ? "border-b-2 border-brand-600 text-brand-600" : ""
              }`}
            >
              <Settings2 className="h-3 w-3" />
              URL и JSON
            </button>
          </div>

          {subTab === "logic" ? (
            <div className="min-h-[360px] flex-1">
              <label className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-2 text-xs">
                <input
                  type="checkbox"
                  checked={selected.useBlockLogic !== false}
                  onChange={(e) =>
                    updateEndpoint(selected.id, { useBlockLogic: e.target.checked })
                  }
                />
                Использовать блоки (не только статичный JSON)
              </label>
              <VisualBlockEditor
                scriptKey={`srv-${selected.id}`}
                definitions={SERVER_LOGIC_BLOCKS}
                getScript={() =>
                  selected.logic ?? {
                    elementId: selected.id,
                    nodes: [],
                    edges: [],
                  }
                }
                onSave={(script) =>
                  updateEndpoint(selected.id, {
                    logic: script,
                    useBlockLogic: true,
                  })
                }
                saveLabel="Сохранить логику сервера"
                hint="Начните с «Запрос пришёл». Завершите блоком «Ответить JSON». Условия и циклы — как в скриптах страницы."
              />
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto p-3">
              <input
                value={selected.name}
                onChange={(e) =>
                  updateEndpoint(selected.id, { name: e.target.value })
                }
                className="w-full rounded border border-[var(--border)] bg-[var(--card)] px-2 py-1.5 text-xs font-semibold"
              />
              <div className="flex gap-2">
                <select
                  value={selected.method}
                  onChange={(e) =>
                    updateEndpoint(selected.id, {
                      method: e.target.value as SiteServerEndpoint["method"],
                    })
                  }
                  className="rounded border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-xs"
                >
                  {["GET", "POST", "PUT", "DELETE", "PATCH"].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <input
                  value={selected.path}
                  onChange={(e) =>
                    updateEndpoint(selected.id, { path: e.target.value })
                  }
                  className="min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--card)] px-2 py-1 font-mono text-xs"
                />
              </div>
              <textarea
                value={selected.responseJson}
                onChange={(e) =>
                  updateEndpoint(selected.id, { responseJson: e.target.value })
                }
                rows={6}
                className="w-full rounded border border-[var(--border)] bg-[var(--card)] p-2 font-mono text-[10px]"
              />
              <p className="text-[10px] text-[var(--muted)]">
                Запасной JSON, если логика блоков выключена.
              </p>
              <button
                type="button"
                onClick={() => {
                  updateServer({
                    endpoints: server.endpoints.filter((e) => e.id !== selected.id),
                  });
                  setSelectedId(null);
                }}
                className="flex w-full items-center justify-center gap-1 rounded border border-red-200 py-2 text-xs text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Удалить endpoint
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
