import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useSession, useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/ui/logo";
import { useAppSettings } from "@/components/providers";
import { t } from "@/lib/i18n";
import {
  ExternalLink,
  FolderOpen,
  Plus,
  Settings,
  Trash2,
  LogOut,
  BookOpen,
  FileText,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  published: boolean;
  siteId: string | null;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { signOut } = useAuth();
  const [, navigate] = useLocation();
  const { settings } = useAppSettings();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/projects", { credentials: "include" });
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const createProject = async () => {
    const res = await fetch("/api/projects", { method: "POST", credentials: "include" });
    const data = await res.json();
    if (data.project) navigate(`/editor/${data.project.id}`);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Удалить проект?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE", credentials: "include" });
    load();
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo size={28} href="/dashboard" />
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[var(--muted)] sm:block">
              {session?.user?.email}
            </span>
            <Link
              href="/dashboard/guide"
              className="flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">{t("dashboard.guide", settings.locale)}</span>
            </Link>
            <Link
              href="/dashboard/docs"
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{t("dashboard.docs", settings.locale)}</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10"
              title={t("settings.title", settings.locale)}
            >
              <Settings className="h-5 w-5" />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10"
              title="Выйти"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("dashboard.title", settings.locale)}</h1>
            <p className="mt-1 text-[var(--muted)]">
              Добро пожаловать, {session?.user?.name || "создатель"}!
            </p>
          </div>
          <button
            onClick={createProject}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
          >
            <Plus className="h-5 w-5" />
            {t("dashboard.new", settings.locale)}
          </button>
        </div>

        {loading ? (
          <div className="mt-12 text-center text-[var(--muted)]">Загрузка...</div>
        ) : projects.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <Logo size={80} showText={false} href={undefined} className="opacity-40" />
            <p className="mt-6 text-lg text-[var(--muted)]">
              {t("dashboard.empty", settings.locale)}
            </p>
            <button
              onClick={createProject}
              className="mt-6 rounded-xl bg-brand-600 px-6 py-3 text-white hover:bg-brand-700"
            >
              Создать первый проект
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <FolderOpen className="h-8 w-8 text-brand-600" />
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="rounded p-1 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-4 font-semibold">{p.name}</h3>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Обновлён {new Date(p.updatedAt).toLocaleDateString("ru")}
                </p>
                {p.published && p.siteId && (
                  <a
                    href={`/site/${p.siteId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 text-xs text-brand-600 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    /site/{p.siteId}
                  </a>
                )}
                <Link
                  href={`/editor/${p.id}`}
                  className="mt-4 block w-full rounded-lg border border-[var(--border)] py-2 text-center text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Открыть редактор
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
