

import { Link } from "wouter";

import { Logo } from "@/components/ui/logo";
import {
  MockBlocksFlow,
  MockDashboard,
  MockEditorLayout,
  MockServerPanel,
} from "@/components/dashboard/guide-mockups";
import {
  ArrowLeft,
  Blocks,
  HelpCircle,
  Layers,
  MousePointer2,
  Palette,
  Server,
  Upload,
  BookOpen,
} from "lucide-react";

const STEPS = [
  {
    id: "start",
    icon: BookOpen,
    title: "1. Начало работы",
    text: "После входа откройте «Мои проекты» и нажмите «Новый проект». Откроется редактор с пустой страницей — это ваш холст.",
    visual: <MockDashboard />,
    tip: "Проекты сохраняются автоматически каждые 3 секунды (можно отключить в настройках).",
  },
  {
    id: "elements",
    icon: MousePointer2,
    title: "2. Элементы и перетаскивание",
    text: "Слева вкладка «Блоки» — перетащите текст, кнопку, изображение или контейнер на серую область (холст). Кликните элемент, чтобы выделить его. Перетаскивайте выделенный элемент мышью — позиция сохранится (для точности включите «Привязка к сетке» в настройках).",
    visual: <MockEditorLayout />,
    tip: "Если элемент «прыгает» назад — переключите позиционирование на absolute в панели справа.",
  },
  {
    id: "styles",
    icon: Palette,
    title: "3. Стили и подсказки",
    text: "Справа панель «Свойства»: меняйте текст, цвета, отступы, шрифты. У каждого поля есть кнопка ⓘ — откроется подробная инструкция с примерами значений.",
    visual: (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Ширина</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <HelpCircle className="h-5 w-5" />
          </span>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Пример: 100%, 320px, auto — подсказка объяснит подробнее
        </p>
      </div>
    ),
    tip: "Можно копировать стили с одного элемента и вставлять на другой.",
  },
  {
    id: "layers",
    icon: Layers,
    title: "4. Слои",
    text: "Вкладка «Слои» показывает дерево страницы. Скрывайте элементы (глаз), блокируйте от случайных правок (замок), переименовывайте блоки для удобства.",
    visual: (
      <div className="space-y-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs">
        <p className="font-medium">▼ Страница</p>
        <p className="pl-3">├ Заголовок</p>
        <p className="pl-3 text-[var(--muted)]">├ Кнопка (скрыт)</p>
        <p className="pl-3">└ Контейнер</p>
      </div>
    ),
  },
  {
    id: "scripts",
    icon: Blocks,
    title: "5. Визуальные скрипты",
    text: "Вкладка «Скрипты» — редактор блоков как в Scratch. Добавьте триггер «При клике», соедините с действиями: изменить цвет, размер, показать/скрыть, HTTP-запрос. Нажмите «Сохранить скрипт».",
    visual: <MockBlocksFlow />,
    tip: "Блоки «Изменить размер», «Изменить цвет», «Плавно изменить стиль» — без написания кода.",
  },
  {
    id: "server",
    icon: Server,
    title: "6. Сервер сайта",
    text: "Вкладка «Сервер»: включите сервер, создайте endpoint (путь + метод + JSON-ответ). Опубликуйте сайт. В скриптах используйте блок «Запрос к серверу сайта» с тем же путём.",
    visual: <MockServerPanel />,
    tip: "URL API появится после публикации — скопируйте его в панели сервера.",
  },
  {
    id: "publish",
    icon: Upload,
    title: "7. Публикация",
    text: "Кнопка «Опубликовать» в шапке редактора. Сайт станет доступен по ссылке вида /site/site_123456. Можно экспортировать HTML-файл (иконка загрузки в шапке).",
    visual: (
      <div className="rounded-xl bg-brand-600 p-4 text-center text-white">
        <p className="text-sm font-medium">Сайт опубликован!</p>
        <p className="mt-2 break-all text-xs opacity-90">
          https://mydomainan.ru/site_482910
        </p>
      </div>
    ),
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-4 px-6">
          <Link
            href="/dashboard"
            className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Logo size={32} href="/dashboard" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-6">
          <img
            src="/logo-light.png"
            alt="Constructor"
            width={72}
            height={72}
            className="dark:hidden"
          />
          <img
            src="/logo-dark.png"
            alt=""
            width={72}
            height={72}
            className="hidden dark:block"
          />
          <div>
            <h1 className="text-3xl font-bold">Руководство по Constructor</h1>
            <p className="mt-2 text-[var(--muted)]">
              Пошаговые инструкции с наглядными схемами интерфейса. Подходит для
              начинающих и для тех, кто хочет освоить сервер и скрипты.
            </p>
          </div>
        </div>

        <nav className="mt-10 flex flex-wrap gap-2">
          {STEPS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs hover:border-brand-400"
            >
              {s.title.replace(/^\d+\.\s/, "")}
            </a>
          ))}
        </nav>

        <div className="mt-12 space-y-16">
          {STEPS.map((step) => (
            <section
              key={step.id}
              id={step.id}
              className="scroll-mt-24 border-b border-[var(--border)] pb-16 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/50">
                  <step.icon className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold">{step.title}</h2>
              </div>
              <p className="mt-4 leading-relaxed text-[var(--foreground)]">
                {step.text}
              </p>
              <div className="mt-6">{step.visual}</div>
              {step.tip && (
                <p className="mt-4 rounded-lg border border-brand-200 bg-brand-50/50 px-4 py-3 text-sm text-brand-800 dark:border-brand-800 dark:bg-brand-950/30 dark:text-brand-200">
                  💡 {step.tip}
                </p>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center text-white">
          <h3 className="text-xl font-bold">Готовы попробовать?</h3>
          <p className="mt-2 opacity-90">Создайте проект и откройте редактор</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-brand-700 hover:bg-brand-50"
          >
            Перейти в кабинет
          </Link>
        </div>
      </main>
    </div>
  );
}
