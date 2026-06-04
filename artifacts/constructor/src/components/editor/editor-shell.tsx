

import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Logo } from "@/components/ui/logo";
import { ElementPalette } from "./element-palette";
import { CanvasElementView } from "./canvas-element";
import { PropertiesPanel } from "./properties-panel";
import { LayersPanel } from "./layers-panel";
import { ServerPanel } from "./server-panel";
import { BlockEditor } from "@/components/blocks/block-editor";
import { useEditorStore } from "@/store/editor-store";
import { useAppSettings } from "@/components/providers";
import { t } from "@/lib/i18n";
import { getPublishUrl, parseProjectData } from "@/lib/utils";
import { renderProjectToHtml } from "@/lib/site-renderer";
import type { ElementType } from "@/types/editor";
import {
  Blocks,
  Download,
  Eye,
  Layers,
  Monitor,
  Redo2,
  Save,
  Smartphone,
  Tablet,
  Undo2,
  Upload,
  Box,
  Server,
} from "lucide-react";

function CanvasDropZone() {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-drop" });
  const { data, viewport, showGrid } = useEditorStore();
  const { settings } = useAppSettings();

  const width =
    viewport === "desktop" ? 1200 : viewport === "tablet" ? 768 : 375;

  return (
    <div
      ref={setNodeRef}
      className={`mx-auto min-h-[600px] transition-shadow ${
        isOver ? "ring-2 ring-brand-400" : ""
      } ${settings.showGrid && showGrid ? "canvas-grid" : ""}`}
      style={{ width: `${width}px`, maxWidth: "100%" }}
      onClick={() => useEditorStore.getState().select(null)}
    >
      {data.rootIds.map((id) => (
        <CanvasElementView key={id} elementId={id} />
      ))}
    </div>
  );
}

export function EditorShell({ projectId }: { projectId: string }) {
  const {
    projectName,
    setProjectName,
    isDirty,
    isSaving,
    setSaving,
    setDirty,
    getData,
    addElement,
    undo,
    redo,
    copyElement,
    pasteElement,
    deleteElement,
    selectedId,
    panelTab,
    setPanelTab,
    viewport,
    setViewport,
    init,
    moveElement,
  } = useEditorStore();

  const { settings } = useAppSettings();
  const [activeDrag, setActiveDrag] = useState<string | null>(null);
  const [publishUrl, setPublishUrl] = useState<string | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [siteId, setSiteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.project) {
          const data = parseProjectData(d.project.data);
          init(projectId, d.project.name, data);
          setSiteId(d.project.siteId ?? null);
          if (d.project.siteId) {
            setPublishUrl(getPublishUrl(d.project.siteId));
          }
        }
        setLoaded(true);
      });
  }, [projectId, init]);

  const save = useCallback(async () => {
    setSaving(true);
    await fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: projectName,
        data: JSON.stringify(getData()),
      }),
    });
    setSaving(false);
    setDirty(false);
  }, [projectId, projectName, getData, setSaving, setDirty]);

  useEffect(() => {
    if (!settings.autosave || !isDirty || !loaded) return;
    const t = setTimeout(save, 3000);
    return () => clearTimeout(t);
  }, [isDirty, settings.autosave, save, loaded]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
        }
        if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
        if (e.key === "s") {
          e.preventDefault();
          save();
        }
        if (e.key === "c" && selectedId) {
          e.preventDefault();
          copyElement(selectedId);
        }
        if (e.key === "v") {
          e.preventDefault();
          pasteElement(selectedId || "root");
        }
      }
      if (e.key === "Delete" && selectedId) {
        deleteElement(selectedId);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, save, copyElement, pasteElement, deleteElement, selectedId]);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveDrag(String(e.active.id));
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDrag(null);
    const { active, over, delta } = e;
    const activeData = active.data.current;

    if (activeData?.fromPalette && activeData?.type) {
      if (over) addElement(activeData.type as ElementType, "root");
      return;
    }

    const elementId = (activeData?.elementId as string) || String(active.id);
    if (elementId.startsWith("palette-") || elementId === "root") return;

    const el = useEditorStore.getState().data.elements[elementId];
    if (!el || el.locked || (delta.x === 0 && delta.y === 0)) return;

    const parsePx = (v?: string) => {
      if (!v) return 0;
      const n = parseFloat(v);
      return Number.isNaN(n) ? 0 : n;
    };

    let left = parsePx(el.styles.left) + delta.x;
    let top = parsePx(el.styles.top) + delta.y;

    if (settings.snapToGrid) {
      const grid = useEditorStore.getState().data.settings.gridSize || 8;
      left = Math.round(left / grid) * grid;
      top = Math.round(top / grid) * grid;
    }

    moveElement(elementId, Math.round(left), Math.round(top));
  };

  const publish = async () => {
    await save();
    const res = await fetch(`/api/projects/${projectId}/publish`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.url) {
      setPublishUrl(data.url);
      setSiteId(data.siteId ?? siteId);
      setShowPublish(true);
    }
  };

  const exportHtml = () => {
    const html = renderProjectToHtml(getData());
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${projectName || "site"}.html`;
    a.click();
  };

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Logo size={48} showText={false} href={undefined} />
        <span className="ml-3 text-[var(--muted)]">Загрузка редактора...</span>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen flex-col bg-[var(--background)]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4">
          <div className="flex items-center gap-4">
            <Logo size={28} href="/dashboard" />
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="rounded border border-transparent bg-transparent px-2 py-1 text-sm font-medium hover:border-[var(--border)] focus:border-brand-500 focus:outline-none"
            />
            {isDirty && (
              <span className="text-xs text-amber-600">Не сохранено</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {[
              { mode: "desktop" as const, icon: Monitor },
              { mode: "tablet" as const, icon: Tablet },
              { mode: "mobile" as const, icon: Smartphone },
            ].map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewport(mode)}
                className={`rounded p-2 ${
                  viewport === mode
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-900/50"
                    : "hover:bg-black/5"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={undo} className="rounded p-2 hover:bg-black/5" title={t("editor.undo", settings.locale)}>
              <Undo2 className="h-4 w-4" />
            </button>
            <button onClick={redo} className="rounded p-2 hover:bg-black/5" title={t("editor.redo", settings.locale)}>
              <Redo2 className="h-4 w-4" />
            </button>
            <button onClick={exportHtml} className="rounded p-2 hover:bg-black/5" title="Экспорт HTML">
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={save}
              disabled={isSaving}
              className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-black/5"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "..." : t("editor.save", settings.locale)}
            </button>
            <button
              onClick={publish}
              className="flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Upload className="h-4 w-4" />
              {t("editor.publish", settings.locale)}
            </button>
            {publishUrl && (
              <Link
                href={publishUrl}
                target="_blank"
                className="rounded p-2 hover:bg-black/5"
                title="Просмотр"
              >
                <Eye className="h-4 w-4" />
              </Link>
            )}
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside
            className={`flex shrink-0 flex-col border-r border-[var(--border)] bg-[var(--card)] ${
              panelTab === "blocks" || panelTab === "server" ? "w-[420px]" : "w-64"
            }`}
          >
            <div className="flex border-b border-[var(--border)]">
              {[
                { id: "elements" as const, icon: Box, label: "Блоки" },
                { id: "layers" as const, icon: Layers, label: "Слои" },
                { id: "blocks" as const, icon: Blocks, label: "Скрипты" },
                { id: "server" as const, icon: Server, label: "Сервер" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPanelTab(tab.id)}
                  className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] ${
                    panelTab === tab.id
                      ? "border-b-2 border-brand-600 text-brand-600"
                      : "text-[var(--muted)]"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto">
              {panelTab === "elements" && <ElementPalette />}
              {panelTab === "layers" && <LayersPanel />}
              {panelTab === "blocks" ? <BlockEditor /> : null}
              {panelTab === "server" && (
                <ServerPanel siteId={siteId} />
              )}
            </div>
          </aside>

          <main className="flex-1 overflow-auto bg-slate-100 p-8 dark:bg-slate-950">
            <CanvasDropZone />
          </main>

          <aside className="w-72 shrink-0 overflow-hidden border-l border-[var(--border)] bg-[var(--card)]">
            <PropertiesPanel />
          </aside>
        </div>
      </div>

      <DragOverlay>
        {activeDrag?.startsWith("palette-") && (
          <div className="rounded-lg border border-brand-400 bg-[var(--card)] px-4 py-2 text-sm shadow-xl">
            Перетащите на холст
          </div>
        )}
      </DragOverlay>

      {showPublish && publishUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[var(--card)] p-6 shadow-2xl">
            <h3 className="text-lg font-bold">Сайт опубликован!</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Ваш сайт доступен по ссылке:
            </p>
            <a
              href={publishUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block break-all text-brand-600 hover:underline"
            >
              {publishUrl}
            </a>
            <button
              onClick={() => setShowPublish(false)}
              className="mt-6 w-full rounded-xl bg-brand-600 py-2.5 text-white hover:bg-brand-700"
            >
              Отлично
            </button>
          </div>
        </div>
      )}
    </DndContext>
  );
}
