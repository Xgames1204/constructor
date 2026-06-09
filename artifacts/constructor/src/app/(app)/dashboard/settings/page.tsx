

import { Link } from "wouter";
import { useTheme } from "next-themes";
import { Logo } from "@/components/ui/logo";
import { useAppSettings } from "@/components/providers";
import { t, type Locale } from "@/lib/i18n";
import { ArrowLeft, ExternalLink } from "lucide-react";

const LOCALES: { id: Locale; label: string; flag: string }[] = [
  { id: "ru", label: "Русский", flag: "🇷🇺" },
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "uk", label: "Українська", flag: "🇺🇦" },
];

export default function SettingsPage() {
  const { settings, updateSettings } = useAppSettings();
  const { theme, setTheme } = useTheme();
  const locale = settings.locale;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)] px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <Link href="/dashboard" className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Logo size={32} href="/dashboard" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10 space-y-6">
        <h1 className="text-2xl font-bold">{t("settings.title", locale)}</h1>

        {/* Язык */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <label className="font-medium">{t("settings.language", locale)}</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {LOCALES.map((l) => (
              <button
                key={l.id}
                onClick={() => updateSettings({ locale: l.id })}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
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
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <label className="font-medium">{t("settings.theme", locale)}</label>
          <div className="mt-3 flex flex-wrap gap-3">
            {[
              { id: "light", label: t("settings.theme.light", locale) },
              { id: "dark", label: t("settings.theme.dark", locale) },
              { id: "system", label: t("settings.theme.system", locale) },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  theme === opt.id
                    ? "bg-brand-600 text-white"
                    : "border border-[var(--border)] hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Редактор */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-[var(--muted)]">
            {locale === "ru" ? "Редактор" : locale === "uk" ? "Редактор" : "Editor"}
          </h2>

          <label className="flex items-start justify-between gap-4">
            <div>
              <span className="font-medium block">{t("settings.autosave", locale)}</span>
              <span className="text-xs text-[var(--muted)]">{t("settings.autosave.hint", locale)}</span>
            </div>
            <input
              type="checkbox"
              checked={settings.autosave}
              onChange={(e) => updateSettings({ autosave: e.target.checked })}
              className="h-5 w-5 mt-0.5 shrink-0 rounded accent-brand-600"
            />
          </label>

          <label className="flex items-start justify-between gap-4">
            <div>
              <span className="font-medium block">{t("settings.grid", locale)}</span>
              <span className="text-xs text-[var(--muted)]">{t("settings.grid.hint", locale)}</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showGrid}
              onChange={(e) => updateSettings({ showGrid: e.target.checked })}
              className="h-5 w-5 mt-0.5 shrink-0 rounded accent-brand-600"
            />
          </label>

          <label className="flex items-start justify-between gap-4">
            <div>
              <span className="font-medium block">{t("settings.snap", locale)}</span>
              <span className="text-xs text-[var(--muted)]">{t("settings.snap.hint", locale)}</span>
            </div>
            <input
              type="checkbox"
              checked={settings.snapToGrid}
              onChange={(e) => updateSettings({ snapToGrid: e.target.checked })}
              className="h-5 w-5 mt-0.5 shrink-0 rounded accent-brand-600"
            />
          </label>
        </div>

        {/* Горячие клавиши */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-[var(--muted)] mb-4">
            {t("settings.shortcuts", locale)}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {[
              ["Ctrl+Z", locale === "en" ? "Undo" : "Отменить"],
              ["Ctrl+Y / Ctrl+Shift+Z", locale === "en" ? "Redo" : locale === "uk" ? "Повторити" : "Повторить"],
              ["Ctrl+S", locale === "en" ? "Save" : locale === "uk" ? "Зберегти" : "Сохранить"],
              ["Ctrl+C / Ctrl+V", locale === "en" ? "Copy / Paste element" : locale === "uk" ? "Копіювати / Вставити елемент" : "Копировать / Вставить элемент"],
              ["Ctrl+D", locale === "en" ? "Duplicate element" : locale === "uk" ? "Дублювати елемент" : "Дублировать элемент"],
              ["Delete / Backspace", locale === "en" ? "Delete element" : locale === "uk" ? "Видалити елемент" : "Удалить элемент"],
              ["Escape", locale === "en" ? "Deselect / Close panel" : locale === "uk" ? "Скасувати виділення" : "Снять выделение"],
            ].map(([key, desc]) => (
              <li key={key} className="flex items-center gap-3">
                <kbd className="shrink-0 rounded bg-black/10 px-2 py-0.5 font-mono text-xs dark:bg-white/10">{key}</kbd>
                <span className="text-[var(--muted)]">{desc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* О проекте */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-[var(--muted)] mb-3">
            {t("settings.about", locale)}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">{t("settings.about.version", locale)}</span>
              <span className="font-mono font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Stack</span>
              <span className="font-medium text-xs">React 19 + Vite + Drizzle</span>
            </div>
          </div>
          <Link
            href="/dashboard/guide"
            className="mt-4 flex items-center gap-2 text-sm text-brand-600 hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {locale === "ru" ? "Открыть руководство" : locale === "uk" ? "Відкрити посібник" : "Open guide"}
          </Link>
        </div>
      </main>
    </div>
  );
}
