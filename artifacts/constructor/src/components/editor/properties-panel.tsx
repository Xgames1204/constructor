"use client";

import { useRef, useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import type { PositionMode } from "@/types/editor";
import {
  STYLE_FIELD_META,
  POSITION_MODE_HINTS,
} from "@/lib/style-field-meta";
import { PropertyHelp } from "./property-help";
import { ChevronDown, Copy, HelpCircle, Paintbrush } from "lucide-react";

const STYLE_GROUPS = [
  {
    title: "Размеры",
    keys: ["width", "height", "minWidth", "maxWidth", "minHeight", "maxHeight"],
  },
  {
    title: "Отступы",
    keys: [
      "margin",
      "marginTop",
      "marginRight",
      "marginBottom",
      "marginLeft",
      "padding",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
    ],
  },
  {
    title: "Фон",
    keys: [
      "backgroundColor",
      "background",
      "backgroundImage",
      "backgroundSize",
      "backgroundPosition",
    ],
  },
  {
    title: "Текст",
    keys: [
      "color",
      "fontFamily",
      "fontSize",
      "fontWeight",
      "fontStyle",
      "lineHeight",
      "letterSpacing",
      "textAlign",
      "textDecoration",
      "textShadow",
    ],
  },
  {
    title: "Границы",
    keys: [
      "border",
      "borderWidth",
      "borderStyle",
      "borderColor",
      "borderRadius",
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius",
    ],
  },
  {
    title: "Flex / Grid",
    keys: [
      "display",
      "flexDirection",
      "flexWrap",
      "justifyContent",
      "alignItems",
      "gap",
      "gridTemplateColumns",
      "gridTemplateRows",
    ],
  },
  {
    title: "Позиция",
    keys: ["top", "left", "right", "bottom", "zIndex"],
  },
  {
    title: "Эффекты",
    keys: [
      "boxShadow",
      "opacity",
      "filter",
      "backdropFilter",
      "transform",
      "transition",
      "animation",
      "animationDuration",
      "animationDelay",
      "cursor",
      "overflow",
    ],
  },
];

const POSITION_MODES: PositionMode[] = [
  "relative",
  "absolute",
  "fixed",
  "flex",
  "grid",
];

const INPUT_CLS =
  "w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-1.5 text-xs font-mono outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors";

function StyleFieldInput({
  fieldKey,
  value,
  onChange,
  onHelp,
}: {
  fieldKey: string;
  value: string;
  onChange: (v: string) => void;
  onHelp: () => void;
}) {
  const meta = STYLE_FIELD_META[fieldKey] ?? {
    label: fieldKey,
    hint: "CSS-свойство",
    placeholder: "",
  };
  const colorRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-2">
      <div className="flex items-start justify-between gap-1">
        <label className="text-xs font-medium text-[var(--foreground)]">
          {meta.label}
        </label>
        <button
          type="button"
          onClick={onHelp}
          title="Подробная инструкция"
          className="shrink-0 rounded p-0.5 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40"
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-0.5 text-[10px] leading-snug text-[var(--muted)]">
        {meta.hint}
      </p>

      {meta.type === "select" && meta.options ? (
        <div className="relative mt-1.5">
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--card)] py-1.5 pl-2.5 pr-7 text-xs outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors"
          >
            <option value="">— не задано —</option>
            {meta.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
        </div>
      ) : meta.type === "color" ? (
        <div className="mt-1.5 flex items-center gap-1.5">
          {/* Цветной квадрат — кликает на скрытый input type=color */}
          <button
            type="button"
            onClick={() => colorRef.current?.click()}
            title="Открыть выбор цвета"
            className="h-7 w-7 shrink-0 rounded-md border-2 border-[var(--border)] shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            style={{ backgroundColor: value || "#000000" }}
          />
          <input
            ref={colorRef}
            type="color"
            value={value?.startsWith("#") && value.length >= 4 ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={meta.placeholder || "#000000 / rgba(...)"}
            className={`${INPUT_CLS} flex-1`}
          />
        </div>
      ) : (
        <>
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={meta.placeholder || "например: 16px"}
            className={`mt-1.5 ${INPUT_CLS}`}
          />
          {meta.presets && meta.presets.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {meta.presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onChange(p)}
                  className={`rounded px-1.5 py-0.5 text-[10px] transition-colors ${
                    value === p
                      ? "bg-brand-600 text-white"
                      : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:border-brand-400 hover:text-brand-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function PropertiesPanel() {
  const [helpKey, setHelpKey] = useState<string | null>(null);
  const el = useEditorStore((s) =>
    s.selectedId ? s.data.elements[s.selectedId] : null
  );
  const updateElement = useEditorStore((s) => s.updateElement);
  const updateStyle = useEditorStore((s) => s.updateStyle);
  const setPositionMode = useEditorStore((s) => s.setPositionMode);
  const copyStyles = useEditorStore((s) => s.copyStyles);
  const pasteStyles = useEditorStore((s) => s.pasteStyles);
  const copiedStyles = useEditorStore((s) => s.copiedStyles);
  const deleteElement = useEditorStore((s) => s.deleteElement);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);

  if (!el || el.id === "root") {
    return (
      <div className="p-4 text-sm text-[var(--muted)]">
        Выберите элемент на холсте — справа появятся понятные настройки с подсказками.
      </div>
    );
  }

  return (
    <>
      {helpKey && (
        <PropertyHelp fieldKey={helpKey} onClose={() => setHelpKey(null)} />
      )}
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-[var(--border)] p-3">
        <label className="text-[10px] font-medium uppercase text-[var(--muted)]">
          Имя в слоях
        </label>
        <input
          value={el.name}
          onChange={(e) => updateElement(el.id, { name: e.target.value })}
          className="mt-0.5 w-full rounded border border-[var(--border)] bg-transparent px-2 py-1 text-sm font-medium"
        />
        <p className="mt-1 text-xs text-[var(--muted)]">Тип: {el.type}</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {(el.type === "text" ||
          el.type === "heading" ||
          el.type === "button" ||
          el.type === "link") && (
          <div className="rounded-lg border border-[var(--border)] p-2">
            <label className="text-xs font-medium">Текст на странице</label>
            <p className="text-[10px] text-[var(--muted)]">
              То, что увидит посетитель сайта
            </p>
            <textarea
              value={el.content || ""}
              onChange={(e) => updateElement(el.id, { content: e.target.value })}
              className="mt-1.5 w-full rounded border border-[var(--border)] bg-[var(--card)] px-2 py-1.5 text-sm"
              rows={2}
              placeholder="Введите текст..."
            />
          </div>
        )}

        {(el.type === "image" || el.type === "video" || el.type === "embed") && (
          <div className="rounded-lg border border-[var(--border)] p-2">
            <label className="text-xs font-medium">Ссылка на файл</label>
            <p className="text-[10px] text-[var(--muted)]">
              Полный URL, например https://example.com/image.jpg
            </p>
            <input
              value={el.src || ""}
              onChange={(e) => updateElement(el.id, { src: e.target.value })}
              className="mt-1.5 w-full rounded border border-[var(--border)] bg-[var(--card)] px-2 py-1.5 text-sm"
              placeholder="https://..."
            />
          </div>
        )}

        <div className="rounded-lg border border-[var(--border)] p-2">
          <label className="text-xs font-medium">Как расположен блок</label>
          <p className="mb-2 text-[10px] text-[var(--muted)]">
            Выберите способ позиционирования на странице
          </p>
          <div className="flex flex-wrap gap-1">
            {POSITION_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                title={POSITION_MODE_HINTS[mode]}
                onClick={() => setPositionMode(el.id, mode)}
                className={`rounded px-2 py-1 text-xs capitalize ${
                  el.positionMode === mode
                    ? "bg-brand-600 text-white"
                    : "border border-[var(--border)] hover:bg-black/5"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-brand-600 dark:text-brand-400">
            {POSITION_MODE_HINTS[el.positionMode]}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => copyStyles(el.id)}
            className="flex flex-1 items-center justify-center gap-1 rounded border border-[var(--border)] py-1.5 text-xs hover:bg-black/5"
          >
            <Copy className="h-3 w-3" /> Копировать стили
          </button>
          <button
            type="button"
            onClick={() => pasteStyles(el.id)}
            disabled={!copiedStyles}
            className="flex flex-1 items-center justify-center gap-1 rounded border border-[var(--border)] py-1.5 text-xs hover:bg-black/5 disabled:opacity-40"
          >
            <Paintbrush className="h-3 w-3" /> Вставить
          </button>
        </div>

        {STYLE_GROUPS.map((group) => (
          <details key={group.title} className="group">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              {group.title}
            </summary>
            <div className="mt-2 space-y-2">
              {group.keys.map((key) => (
                <StyleFieldInput
                  key={key}
                  fieldKey={key}
                  value={el.styles[key] || ""}
                  onChange={(v) => updateStyle(el.id, key, v)}
                  onHelp={() => setHelpKey(key)}
                />
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className="flex gap-2 border-t border-[var(--border)] p-3">
        <button
          type="button"
          onClick={() => duplicateElement(el.id)}
          className="flex-1 rounded border border-[var(--border)] py-1.5 text-xs hover:bg-black/5"
        >
          Дублировать
        </button>
        <button
          type="button"
          onClick={() => deleteElement(el.id)}
          className="flex-1 rounded border border-red-200 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
        >
          Удалить
        </button>
      </div>
    </div>
    </>
  );
}
