"use client";

import { useEditorStore } from "@/store/editor-store";
import { ChevronDown, ChevronRight, Eye, EyeOff, Lock } from "lucide-react";

function LayerItem({ id, depth = 0 }: { id: string; depth?: number }) {
  const { data, selectedId, select, updateElement } = useEditorStore();
  const el = data.elements[id];
  if (!el) return null;

  return (
    <div>
      <button
        onClick={() => select(id)}
        className={`flex w-full items-center gap-1 rounded px-2 py-1 text-left text-xs hover:bg-black/5 dark:hover:bg-white/5 ${
          selectedId === id ? "bg-brand-50 text-brand-700 dark:bg-brand-950/50" : ""
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {el.children.length > 0 ? (
          <ChevronDown className="h-3 w-3 shrink-0" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 opacity-30" />
        )}
        <span className="truncate flex-1">{el.name}</span>
        <span
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            updateElement(id, { hidden: !el.hidden });
          }}
          className="p-0.5"
        >
          {el.hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3 opacity-40" />}
        </span>
        <span
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            updateElement(id, { locked: !el.locked });
          }}
          className="p-0.5"
        >
          {el.locked && <Lock className="h-3 w-3 text-amber-500" />}
        </span>
      </button>
      {el.children.map((cid) => (
        <LayerItem key={cid} id={cid} depth={depth + 1} />
      ))}
    </div>
  );
}

export function LayersPanel() {
  const { data } = useEditorStore();

  return (
    <div className="p-2 text-sm">
      {data.rootIds.map((id) => (
        <LayerItem key={id} id={id} />
      ))}
    </div>
  );
}
