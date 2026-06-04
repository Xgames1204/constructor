"use client";

import { X } from "lucide-react";
import { getStyleGuide } from "@/lib/style-guides";
import { STYLE_FIELD_META } from "@/lib/style-field-meta";

interface PropertyHelpProps {
  fieldKey: string;
  onClose: () => void;
}

export function PropertyHelp({ fieldKey, onClose }: PropertyHelpProps) {
  const guide = getStyleGuide(fieldKey);
  const meta = STYLE_FIELD_META[fieldKey];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold">{guide.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-black/5"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {meta && (
          <p className="mt-2 text-sm text-brand-600 dark:text-brand-400">
            {meta.hint}
          </p>
        )}

        <div className="mt-4 rounded-xl bg-[var(--background)] p-4 text-sm leading-relaxed text-[var(--foreground)]">
          {guide.guide}
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Примеры значений
        </p>
        <ul className="mt-2 space-y-1.5">
          {guide.examples.map((ex) => (
            <li
              key={ex}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 font-mono text-xs"
            >
              {ex}
            </li>
          ))}
        </ul>

        {meta?.placeholder && (
          <p className="mt-4 text-xs text-[var(--muted)]">
            Подсказка в поле: <code className="rounded bg-black/5 px-1">{meta.placeholder}</code>
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
