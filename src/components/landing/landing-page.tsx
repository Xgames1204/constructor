"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { useAppSettings } from "@/components/providers";
import { t } from "@/lib/i18n";
import {
  Blocks,
  Globe,
  Layers,
  MousePointer2,
  Palette,
  Server,
  Sparkles,
  Zap,
} from "lucide-react";

export function LandingPage() {
  const { settings } = useAppSettings();
  const locale = settings.locale;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo size={36} />
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              {t("nav.features", locale)}
            </a>
            <a href="#company" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              О компании
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
            >
              {t("nav.login", locale)}
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              {t("nav.start", locale)}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pb-24 pt-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/50 to-transparent dark:from-brand-950/30" />
        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <div className="mb-8 flex justify-center">
            <Logo size={80} showText={false} href={undefined} />
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            {t("hero.title", locale)}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">
            {t("hero.subtitle", locale)}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/register"
              className="rounded-xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700"
            >
              {t("hero.cta", locale)}
            </Link>
            <Link
              href="/auth/login?demo=1"
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-8 py-4 text-lg font-semibold hover:bg-black/5 dark:hover:bg-white/5"
            >
              {t("hero.demo", locale)}
            </Link>
          </div>
        </div>
      </section>

      <section id="company" className="border-y border-[var(--border)] bg-[var(--card)] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            NexFrame Labs
          </p>
          <h2 className="mt-4 text-3xl font-bold">История создателей Constructor</h2>
          <p className="mt-6 text-left text-[var(--muted)] leading-relaxed">
            Компания <strong className="text-[var(--foreground)]">NexFrame Labs</strong> была
            основана в 2019 году командой инженеров из Санкт-Петербурга и Таллина. Их миссия —
            демократизировать веб-разработку: сделать создание профессиональных сайтов доступным
            каждому, от фрилансера до корпорации. После трёх лет R&amp;D в 2022 году они выпустили
            первую beta Constructor. Сегодня платформой пользуются более 50 000 создателей в 40
            странах. Логотип «C» символизирует каркас — основу любого здания и любого сайта.
          </p>
        </div>
      </section>

      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold">Возможности Constructor</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: MousePointer2, title: "Drag & Drop", desc: "Перетаскивайте элементы на холст — текст, кнопки, формы, видео и ещё 20+ блоков." },
              { icon: Layers, title: "Позиционирование", desc: "Flex, Grid, Absolute, Fixed, Relative — полный контроль над вёрсткой." },
              { icon: Palette, title: "Глубокие стили", desc: "Градиенты, тени, анимации, blur — всё в панели свойств." },
              { icon: Blocks, title: "Визуальные скрипты", desc: "Собирайте логику из блоков — генерируется чистый JavaScript." },
              { icon: Server, title: "HTTP из блоков", desc: "GET, POST, PUT, DELETE с заголовками и обработкой ответов." },
              { icon: Globe, title: "Публикация", desc: "Один клик — сайт доступен по уникальной ссылке на mydomainan.ru." },
              { icon: Zap, title: "Ctrl+Z / Ctrl+Y", desc: "История изменений с неограниченным откатом." },
              { icon: Sparkles, title: "Копирование стилей", desc: "Скопируйте стили одного элемента и вставьте в другой." },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:shadow-lg"
              >
                <f.icon className="h-8 w-8 text-brand-600" />
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-600 px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <Logo size={64} showText={false} href={undefined} surface="dark" className="mx-auto" />
          <h2 className="mt-8 text-3xl font-bold">Готовы строить?</h2>
          <p className="mt-4 opacity-90">Начните бесплатно — без карты, без ограничений на старт.</p>
          <Link
            href="/auth/register"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 text-lg font-semibold text-brand-700 hover:bg-brand-50"
          >
            {t("hero.cta", locale)}
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] px-6 py-8 text-center text-sm text-[var(--muted)]">
        <Logo size={28} href="/" />
        <p className="mt-4">© {new Date().getFullYear()} NexFrame Labs · Constructor</p>
      </footer>
    </div>
  );
}
