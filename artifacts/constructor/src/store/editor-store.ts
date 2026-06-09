import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  CanvasElement,
  ElementType,
  Page,
  PageScript,
  PositionMode,
  ProjectData,
  ViewportMode,
} from "@/types/editor";
import { DEFAULT_PROJECT_DATA } from "@/types/editor";
import { createElement } from "@/lib/element-factory";

function makeRootEl(): CanvasElement {
  return {
    id: "root", type: "section", name: "Страница",
    children: [], parentId: null, positionMode: "relative",
    styles: { minHeight: "100vh", width: "100%", backgroundColor: "#ffffff", position: "relative" },
  };
}

function syncCurrentPageIn(state: { data: ProjectData }) {
  const idx = state.data.pages.findIndex((p) => p.id === state.data.currentPageId);
  if (idx < 0) return;
  state.data.pages[idx].elements = JSON.parse(JSON.stringify(state.data.elements));
  state.data.pages[idx].rootIds = [...state.data.rootIds];
  state.data.pages[idx].scripts = JSON.parse(JSON.stringify(state.data.scripts));
  state.data.pages[idx].globalScripts = JSON.parse(JSON.stringify(state.data.globalScripts));
}

function loadPage(state: { data: ProjectData; selectedId: string | null }, page: Page) {
  state.data.elements = JSON.parse(JSON.stringify(page.elements));
  state.data.rootIds = [...page.rootIds];
  state.data.scripts = JSON.parse(JSON.stringify(page.scripts ?? []));
  state.data.globalScripts = JSON.parse(JSON.stringify(page.globalScripts ?? []));
  state.data.currentPageId = page.id;
  state.selectedId = null;
}

interface HistoryEntry {
  data: ProjectData;
  selectedId: string | null;
}

interface EditorState {
  projectId: string | null;
  projectName: string;
  data: ProjectData;
  selectedId: string | null;
  hoveredId: string | null;
  viewport: ViewportMode;
  panelTab: "elements" | "layers" | "blocks" | "server" | "settings";
  isDirty: boolean;
  isSaving: boolean;
  history: HistoryEntry[];
  historyIndex: number;
  clipboard: CanvasElement | null;
  copiedStyles: Record<string, string> | null;
  showGrid: boolean;
  blockTargetElementId: string | null;

  init: (projectId: string, name: string, data: ProjectData) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  select: (id: string | null) => void;
  hover: (id: string | null) => void;
  setViewport: (v: ViewportMode) => void;
  setPanelTab: (tab: EditorState["panelTab"]) => void;
  addElement: (type: ElementType, parentId?: string) => string;
  addElementAt: (type: ElementType, parentId: string, x: number, y: number) => string;
  updateElement: (id: string, patch: Partial<CanvasElement>) => void;
  updateStyle: (id: string, key: string, value: string) => void;
  setPositionMode: (id: string, mode: PositionMode) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  moveElement: (id: string, x: number, y: number) => void;
  reorderChild: (parentId: string, childId: string, index: number) => void;
  reparentElement: (id: string, newParentId: string) => void;
  copyElement: (id: string) => void;
  pasteElement: (parentId?: string) => void;
  copyStyles: (id: string) => void;
  pasteStyles: (id: string) => void;
  setProjectName: (name: string) => void;
  setMeta: (meta: Partial<ProjectData["meta"]>) => void;
  setDirty: (v: boolean) => void;
  setSaving: (v: boolean) => void;
  getData: () => ProjectData;
  setBlockTarget: (id: string | null) => void;
  updateBlocks: (script: PageScript) => void;
  getGlobalScript: () => PageScript;
  addPage: () => string;
  deletePage: (pageId: string) => void;
  renamePage: (pageId: string, name: string) => void;
  setPageSlug: (pageId: string, slug: string) => void;
  switchPage: (pageId: string) => void;
}

const MAX_HISTORY = 50;

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    projectId: null,
    projectName: "Новый сайт",
    data: DEFAULT_PROJECT_DATA,
    selectedId: null,
    hoveredId: null,
    viewport: "desktop",
    panelTab: "elements",
    isDirty: false,
    isSaving: false,
    history: [],
    historyIndex: -1,
    clipboard: null,
    copiedStyles: null,
    showGrid: true,
    blockTargetElementId: null,

    init: (projectId, name, data) => {
      set({
        projectId,
        projectName: name,
        data,
        selectedId: null,
        history: [{ data: JSON.parse(JSON.stringify(data)), selectedId: null }],
        historyIndex: 0,
        isDirty: false,
      });
    },

    pushHistory: () => {
      const { data, selectedId, history, historyIndex } = get();
      const entry: HistoryEntry = {
        data: JSON.parse(JSON.stringify(data)),
        selectedId,
      };
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(entry);
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      set({
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      });
    },

    undo: () => {
      const { historyIndex, history } = get();
      if (historyIndex <= 0) return;
      const prev = history[historyIndex - 1];
      set({
        historyIndex: historyIndex - 1,
        data: JSON.parse(JSON.stringify(prev.data)),
        selectedId: prev.selectedId,
        isDirty: true,
      });
    },

    redo: () => {
      const { historyIndex, history } = get();
      if (historyIndex >= history.length - 1) return;
      const next = history[historyIndex + 1];
      set({
        historyIndex: historyIndex + 1,
        data: JSON.parse(JSON.stringify(next.data)),
        selectedId: next.selectedId,
        isDirty: true,
      });
    },

    select: (id) => set({ selectedId: id }),
    hover: (id) => set({ hoveredId: id }),
    setViewport: (v) => set({ viewport: v }),
    setPanelTab: (tab) => set({ panelTab: tab }),

    addElement: (type, parentId) => {
      const el = createElement(type, parentId || "root");
      const targetParent = parentId || "root";
      set((state) => {
        state.data.elements[el.id] = el;
        const parent = state.data.elements[targetParent];
        if (parent) parent.children.push(el.id);
        state.selectedId = el.id;
      });
      get().pushHistory();
      return el.id;
    },

    addElementAt: (type, parentId, x, y) => {
      const el = createElement(type, parentId);
      const grid = get().data.settings?.gridSize || 8;
      const snapped = (v: number) => Math.round(v / grid) * grid;
      el.positionMode = "absolute";
      el.styles = {
        ...el.styles,
        position: "absolute",
        left: `${snapped(Math.max(0, x))}px`,
        top: `${snapped(Math.max(0, y))}px`,
      };
      set((state) => {
        state.data.elements[el.id] = el;
        const parent = state.data.elements[parentId];
        if (parent) parent.children.push(el.id);
        state.selectedId = el.id;
      });
      get().pushHistory();
      return el.id;
    },

    updateElement: (id, patch) => {
      set((state) => {
        Object.assign(state.data.elements[id], patch);
      });
      get().pushHistory();
    },

    updateStyle: (id, key, value) => {
      set((state) => {
        if (!state.data.elements[id].styles) {
          state.data.elements[id].styles = {};
        }
        state.data.elements[id].styles[key] = value;
      });
      get().pushHistory();
    },

    setPositionMode: (id, mode) => {
      set((state) => {
        state.data.elements[id].positionMode = mode;
        state.data.elements[id].styles.position = mode;
        if (mode === "absolute" || mode === "fixed") {
          if (!state.data.elements[id].styles.top)
            state.data.elements[id].styles.top = "20px";
          if (!state.data.elements[id].styles.left)
            state.data.elements[id].styles.left = "20px";
        }
      });
      get().pushHistory();
    },

    deleteElement: (id) => {
      if (id === "root") return;
      set((state) => {
        const el = state.data.elements[id];
        if (!el) return;
        if (el.parentId) {
          const parent = state.data.elements[el.parentId];
          if (parent) {
            parent.children = parent.children.filter((c) => c !== id);
          }
        }
        const removeRecursive = (eid: string) => {
          const e = state.data.elements[eid];
          if (!e) return;
          e.children.forEach(removeRecursive);
          delete state.data.elements[eid];
        };
        removeRecursive(id);
        if (state.selectedId === id) state.selectedId = null;
      });
      get().pushHistory();
    },

    duplicateElement: (id) => {
      const original = get().data.elements[id];
      if (!original || id === "root") return;
      const copy = createElement(original.type, original.parentId);
      copy.content = original.content;
      copy.src = original.src;
      copy.styles = { ...original.styles };
      copy.positionMode = original.positionMode;
      set((state) => {
        state.data.elements[copy.id] = copy;
        if (copy.parentId) {
          const parent = state.data.elements[copy.parentId];
          const idx = parent.children.indexOf(id);
          parent.children.splice(idx + 1, 0, copy.id);
        }
        state.selectedId = copy.id;
      });
      get().pushHistory();
    },

    moveElement: (id, x, y) => {
      set((state) => {
        const el = state.data.elements[id];
        if (!el) return;
        el.styles.left = `${x}px`;
        el.styles.top = `${y}px`;
        if (
          el.positionMode !== "absolute" &&
          el.positionMode !== "fixed"
        ) {
          el.positionMode = "absolute";
          el.styles.position = "absolute";
        }
      });
      get().pushHistory();
    },

    reorderChild: (parentId, childId, index) => {
      set((state) => {
        const parent = state.data.elements[parentId];
        if (!parent) return;
        parent.children = parent.children.filter((c) => c !== childId);
        parent.children.splice(index, 0, childId);
      });
      get().pushHistory();
    },

    reparentElement: (id, newParentId) => {
      if (id === "root" || id === newParentId) return;
      set((state) => {
        const el = state.data.elements[id];
        const newParent = state.data.elements[newParentId];
        if (!el || !newParent) return;
        if (el.parentId) {
          const oldParent = state.data.elements[el.parentId];
          if (oldParent) oldParent.children = oldParent.children.filter((c) => c !== id);
        } else {
          state.data.rootIds = state.data.rootIds.filter((rid) => rid !== id);
        }
        newParent.children.push(id);
        el.parentId = newParentId;
        el.positionMode = "relative";
        el.styles = { ...el.styles, position: "relative" };
        delete el.styles.left;
        delete el.styles.top;
      });
      get().pushHistory();
    },

    copyElement: (id) => {
      const el = get().data.elements[id];
      if (el && id !== "root") set({ clipboard: JSON.parse(JSON.stringify(el)) });
    },

    pasteElement: (parentId) => {
      const { clipboard } = get();
      if (!clipboard) return;
      const el = createElement(clipboard.type, parentId || clipboard.parentId || "root");
      el.content = clipboard.content;
      el.src = clipboard.src;
      el.styles = { ...clipboard.styles };
      set((state) => {
        state.data.elements[el.id] = el;
        const pid = parentId || "root";
        state.data.elements[pid]?.children.push(el.id);
        state.selectedId = el.id;
      });
      get().pushHistory();
    },

    copyStyles: (id) => {
      const el = get().data.elements[id];
      if (el) {
        set({
          copiedStyles: JSON.parse(JSON.stringify(el.styles)) as Record<
            string,
            string
          >,
        });
      }
    },

    pasteStyles: (id) => {
      const { copiedStyles } = get();
      if (!copiedStyles) return;
      set((state) => {
        state.data.elements[id].styles = {
          ...state.data.elements[id].styles,
          ...copiedStyles,
        };
      });
      get().pushHistory();
    },

    setProjectName: (name) => set({ projectName: name, isDirty: true }),
    setMeta: (meta) => {
      set((state) => {
        state.data.meta = { ...state.data.meta, ...meta };
      });
      get().pushHistory();
    },
    setDirty: (v) => set({ isDirty: v }),
    setSaving: (v) => set({ isSaving: v }),
    getData: () => {
      const { data } = get();
      if (!data.pages?.length) return data;
      const updatedPages = data.pages.map((p) =>
        p.id === data.currentPageId
          ? { ...p, elements: data.elements, rootIds: data.rootIds, scripts: data.scripts, globalScripts: data.globalScripts }
          : p
      );
      return { ...data, pages: updatedPages };
    },
    setBlockTarget: (id) => set({ blockTargetElementId: id }),

    updateBlocks: (script) => {
      set((state) => {
        if (!Array.isArray(state.data.globalScripts)) state.data.globalScripts = [];
        const idx = state.data.globalScripts.findIndex(
          (s) => s.elementId === script.elementId
        );
        if (idx >= 0) state.data.globalScripts[idx] = script;
        else state.data.globalScripts.push(script);
      });
      get().pushHistory();
    },

    getGlobalScript: () => {
      const { data, blockTargetElementId } = get();
      const target = blockTargetElementId || "global";
      const scripts = Array.isArray(data.globalScripts) ? data.globalScripts : [];
      let script = scripts.find((s) => s.elementId === target);
      if (!script) {
        script = { elementId: target, nodes: [], edges: [] };
      }
      return script;
    },

    addPage: () => {
      const id = `page_${Date.now()}`;
      const slug = `page-${id.slice(-6)}`;
      const newPage: Page = {
        id,
        name: "Новая страница",
        slug,
        elements: { root: makeRootEl() },
        rootIds: ["root"],
        scripts: [],
        globalScripts: [],
      };
      set((state) => {
        syncCurrentPageIn(state);
        state.data.pages.push(newPage);
        loadPage(state, newPage);
      });
      get().pushHistory();
      return id;
    },

    deletePage: (pageId) => {
      const { data } = get();
      if (data.pages.length <= 1) return;
      set((state) => {
        const idx = state.data.pages.findIndex((p) => p.id === pageId);
        if (idx < 0) return;
        state.data.pages.splice(idx, 1);
        if (state.data.currentPageId === pageId) {
          const next = state.data.pages[Math.max(0, idx - 1)];
          loadPage(state, next);
        }
      });
      get().pushHistory();
    },

    renamePage: (pageId, name) => {
      set((state) => {
        const page = state.data.pages.find((p) => p.id === pageId);
        if (page) page.name = name;
      });
      set({ isDirty: true });
    },

    setPageSlug: (pageId, slug) => {
      set((state) => {
        const page = state.data.pages.find((p) => p.id === pageId);
        if (page) page.slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
      });
      get().pushHistory();
    },

    switchPage: (pageId) => {
      const { data } = get();
      if (pageId === data.currentPageId) return;
      const newPage = data.pages.find((p) => p.id === pageId);
      if (!newPage) return;
      set((state) => {
        syncCurrentPageIn(state);
        const target = state.data.pages.find((p) => p.id === pageId)!;
        loadPage(state, target);
      });
    },
  }))
);
