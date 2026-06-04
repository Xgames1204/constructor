

import { Link } from "wouter";
import { useTheme } from "next-themes";
import { Logo } from "@/components/ui/logo";
import { useAppSettings } from "@/components/providers";
import { t, type Locale } from "@/lib/i18n";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings } = useAppSettings();
  const { theme, setTheme } = useTheme();
  const locale = settings.locale;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)] px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <Link href="/dashboard" className="rounded-lg p-2 hover:bg-black/5">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Logo size={32} href="/dashboard" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-bold">{t("settings.title", locale)}</h1>

        <section className="mt-8 space-y-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <label className="font-medium">{t("settings.language", locale)}</label>
            <div className="mt-3 flex gap-3">
              {(["ru", "en"] as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => updateSettings({ locale: l })}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    settings.locale === l
                      ? "bg-brand-600 text-white"
                      : "border border-[var(--border)] hover:bg-black/5"
                  }`}
                >
                  {l === "ru" ? "Русский" : "English"}
                </button>
              ))}
            </div>
          </div>

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
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    theme === opt.id
                      ? "bg-brand-600 text-white"
                      : "border border-[var(--border)] hover:bg-black/5"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <label className="flex items-center justify-between">
              <span className="font-medium">{t("settings.autosave", locale)}</span>
              <input
                type="checkbox"
                checked={settings.autosave}
                onChange={(e) => updateSettings({ autosave: e.target.checked })}
                className="h-5 w-5 rounded accent-brand-600"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="font-medium">{t("settings.grid", locale)}</span>
              <input
                type="checkbox"
                checked={settings.showGrid}
                onChange={(e) => updateSettings({ showGrid: e.target.checked })}
                className="h-5 w-5 rounded accent-brand-600"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="font-medium">{t("settings.snap", locale)}</span>
              <input
                type="checkbox"
                checked={settings.snapToGrid}
                onChange={(e) => updateSettings({ snapToGrid: e.target.checked })}
                className="h-5 w-5 rounded accent-brand-600"
              />
            </label>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="font-medium">Горячие клавиши</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <li><kbd className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">Ctrl+Z</kbd> — отменить</li>
              <li><kbd className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">Ctrl+Y</kbd> — повторить</li>
              <li><kbd className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">Ctrl+S</kbd> — сохранить</li>
              <li><kbd className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">Ctrl+C / V</kbd> — копировать / вставить</li>
              <li><kbd className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">Delete</kbd> — удалить элемент</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
