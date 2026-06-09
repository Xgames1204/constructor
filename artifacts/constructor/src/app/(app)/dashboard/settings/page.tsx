import { Link } from "wouter";
import { useTheme } from "next-themes";
import { Logo } from "@/components/ui/logo";
import { useAppSettings } from "@/components/providers";
import { t, type Locale } from "@/lib/i18n";
import { ArrowLeft, ExternalLink, RotateCcw } from "lucide-react";

const LOCALES: { id: Locale; label: string; flag: string }[] = [
  { id: "ru", label: "Русский",    flag: "🇷🇺" },
  { id: "en", label: "English",    flag: "🇬🇧" },
  { id: "uk", label: "Українська", flag: "🇺🇦" },
  { id: "de", label: "Deutsch",    flag: "🇩🇪" },
  { id: "es", label: "Español",    flag: "🇪🇸" },
  { id: "fr", label: "Français",   flag: "🇫🇷" },
  { id: "pl", label: "Polski",     flag: "🇵🇱" },
];

const SHORTCUTS: [string, Record<Locale, string>][] = [
  ["Ctrl + Z",            { ru: "Отменить",              en: "Undo",              uk: "Скасувати",        de: "Rückgängig",         es: "Deshacer",   fr: "Annuler",      pl: "Cofnij"             }],
  ["Ctrl + Y / ⇧Z",      { ru: "Повторить",             en: "Redo",              uk: "Повторити",        de: "Wiederholen",        es: "Rehacer",    fr: "Rétablir",     pl: "Ponów"              }],
  ["Ctrl + S",            { ru: "Сохранить",             en: "Save",              uk: "Зберегти",         de: "Speichern",          es: "Guardar",    fr: "Enregistrer",  pl: "Zapisz"             }],
  ["Ctrl + C / V",        { ru: "Копировать / Вставить", en: "Copy / Paste",      uk: "Копіювати / Вставити", de: "Kopieren / Einfügen", es: "Copiar / Pegar", fr: "Copier / Coller", pl: "Kopiuj / Wklej" }],
  ["Delete / Backspace",  { ru: "Удалить элемент",       en: "Delete element",    uk: "Видалити елемент", de: "Element löschen",    es: "Eliminar elemento", fr: "Supprimer l'élément", pl: "Usuń element" }],
  ["Escape",              { ru: "Снять выделение",       en: "Deselect",          uk: "Скасувати виділення", de: "Auswahl aufheben", es: "Deseleccionar", fr: "Désélectionner", pl: "Odznacz" }],
  ["Dbl-click tab",       { ru: "Переименовать страницу",en: "Rename page",       uk: "Перейменувати сторінку", de: "Seite umbenennen", es: "Renombrar página", fr: "Renommer la page", pl: "Zmień nazwę strony" }],
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-brand-600" : "bg-black/20 dark:bg-white/20"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-5">
      {children}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
      {label}
    </h2>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useAppSettings();
  const { theme, setTheme } = useTheme();
  const locale = settings.locale;
  const L = (key: Parameters<typeof t>[0]) => t(key, locale);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)] px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <Link href="/dashboard" className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Logo size={24} href="/dashboard" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10 space-y-6">
        <h1 className="text-2xl font-bold">{L("settings.title")}</h1>

        {/* ── Внешний вид ─────────────────────────────────────── */}
        <Card>
          <SectionLabel label={L("settings.appearance")} />

          {/* Язык */}
          <div>
            <p className="font-medium mb-2">{L("settings.language")}</p>
            <div className="flex flex-wrap gap-2">
              {LOCALES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => updateSettings({ locale: l.id })}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    settings.locale === l.id
                      ? "bg-brand-600 text-white"
                      : "border border-[var(--border)] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span>{l.flag}</span>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Тема */}
          <div>
            <p className="font-medium mb-2">{L("settings.theme")}</p>
            <div className="flex flex-wrap gap-2">
              {(["light", "dark", "system"] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    theme === id
                      ? "bg-brand-600 text-white"
                      : "border border-[var(--border)] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {L(`settings.theme.${id}` as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ── Редактор ─────────────────────────────────────────── */}
        <Card>
          <SectionLabel label={L("settings.editor.section")} />

          {/* Автосохранение */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{L("settings.autosave")}</p>
              <p className="text-xs text-[var(--muted)]">{L("settings.autosave.hint")}</p>
            </div>
            <Toggle
              checked={settings.autosave}
              onChange={(v) => updateSettings({ autosave: v })}
            />
          </div>

          {/* Интервал */}
          {settings.autosave && (
            <div>
              <p className="font-medium mb-1.5">{L("settings.autosave.interval")}</p>
              <p className="text-xs text-[var(--muted)] mb-2">{L("settings.autosave.interval.hint")}</p>
              <div className="flex gap-2">
                {([3, 10, 30] as const).map((sec) => (
                  <button
                    key={sec}
                    onClick={() => updateSettings({ autosaveInterval: sec })}
                    className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                      settings.autosaveInterval === sec
                        ? "bg-brand-600 text-white"
                        : "border border-[var(--border)] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Сетка */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{L("settings.grid")}</p>
              <p className="text-xs text-[var(--muted)]">{L("settings.grid.hint")}</p>
            </div>
            <Toggle
              checked={settings.showGrid}
              onChange={(v) => updateSettings({ showGrid: v })}
            />
          </div>

          {/* Привязка к сетке */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{L("settings.snap")}</p>
              <p className="text-xs text-[var(--muted)]">{L("settings.snap.hint")}</p>
            </div>
            <Toggle
              checked={settings.snapToGrid}
              onChange={(v) => updateSettings({ snapToGrid: v })}
            />
          </div>

          {/* Компактный режим */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{L("settings.compact")}</p>
              <p className="text-xs text-[var(--muted)]">{L("settings.compact.hint")}</p>
            </div>
            <Toggle
              checked={settings.compactMode}
              onChange={(v) => updateSettings({ compactMode: v })}
            />
          </div>

          {/* Подписи элементов */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{L("settings.labels")}</p>
              <p className="text-xs text-[var(--muted)]">{L("settings.labels.hint")}</p>
            </div>
            <Toggle
              checked={settings.showElementLabels}
              onChange={(v) => updateSettings({ showElementLabels: v })}
            />
          </div>

          {/* Позиция по умолчанию */}
          <div>
            <p className="font-medium mb-1">{L("settings.default.position")}</p>
            <p className="text-xs text-[var(--muted)] mb-2">{L("settings.default.position.hint")}</p>
            <div className="flex gap-2">
              {(["relative", "absolute"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSettings({ defaultPositionMode: mode })}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                    settings.defaultPositionMode === mode
                      ? "bg-brand-600 text-white"
                      : "border border-[var(--border)] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {L(`settings.default.position.${mode}` as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ── Горячие клавиши ───────────────────────────────────── */}
        <Card>
          <SectionLabel label={L("settings.shortcuts")} />
          <ul className="space-y-2.5 text-sm">
            {SHORTCUTS.map(([key, descs]) => (
              <li key={key} className="flex items-center gap-3">
                <kbd className="shrink-0 rounded bg-black/10 px-2 py-0.5 font-mono text-xs dark:bg-white/10">
                  {key}
                </kbd>
                <span className="text-[var(--muted)]">{descs[locale] ?? descs.en}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* ── О проекте ────────────────────────────────────────── */}
        <Card>
          <SectionLabel label={L("settings.about")} />
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">{L("settings.about.version")}</span>
              <span className="font-mono font-medium">1.1.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Stack</span>
              <span className="font-medium text-xs">React 19 + Vite + Drizzle + Express 5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">{L("settings.language")}</span>
              <span className="font-medium text-xs">{LOCALES.find(l => l.id === locale)?.label}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/dashboard/guide"
              className="flex items-center gap-2 text-sm text-brand-600 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {L("dashboard.guide")}
            </Link>
            <Link
              href="/dashboard/docs"
              className="flex items-center gap-2 text-sm text-brand-600 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {L("dashboard.docs")}
            </Link>
          </div>
        </Card>

        {/* ── Данные и сброс ───────────────────────────────────── */}
        <Card>
          <SectionLabel label={L("settings.data")} />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">{L("settings.reset")}</p>
              <p className="text-xs text-[var(--muted)]">{L("settings.reset.hint")}</p>
            </div>
            <button
              onClick={() => {
                if (confirm(L("settings.reset.hint") + "?")) resetSettings();
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {L("settings.reset")}
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
}
