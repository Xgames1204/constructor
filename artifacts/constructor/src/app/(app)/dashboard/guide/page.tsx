

import { Link } from "wouter";

import { Logo } from "@/components/ui/logo";
import {
  MockBlocksFlow,
  MockBorderClear,
  MockContainerChildren,
  MockDashboard,
  MockEditorLayout,
  MockServerPanel,
} from "@/components/dashboard/guide-mockups";
import {
  ArrowLeft,
  Blocks,
  BookOpen,
  Layers,
  MousePointer2,
  Palette,
  Server,
  Upload,
  Box,
  Paintbrush,
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
    id: "children",
    icon: Box,
    title: "3. Дочерние элементы в контейнере (div)",
    text: "Контейнер — это аналог тега <div>: он группирует другие элементы внутри себя. Чтобы вложить элемент внутрь контейнера, перетащите его из палитры прямо на синюю пунктирную рамку контейнера на холсте. Отпустите — элемент станет дочерним. Вы увидите это в панели «Слои»: он появится вложенным под контейнером.",
    visual: <MockContainerChildren />,
    tip: "Можно вкладывать контейнеры друг в друга сколько угодно. Для выравнивания дочерних элементов установите родителю display: flex в панели «Flex / Grid».",
  },
  {
    id: "styles",
    icon: Palette,
    title: "4. Стили и рамки",
    text: "Справа панель «Свойства»: меняйте текст, цвета, отступы, шрифты. Раздел «Границы» управляет рамкой вокруг элемента. Чтобы убрать рамку — нажмите пресет none или выберите стиль «Нет» в поле «Стиль границы». У каждого поля есть кнопка ⓘ — откроется подробная инструкция.",
    visual: <MockBorderClear />,
    tip: "Можно копировать стили с одного элемента и вставлять на другой кнопкой «Копировать стили».",
  },
  {
    id: "layers",
    icon: Layers,
    title: "5. Слои",
    text: "Вкладка «Слои» показывает дерево страницы. Скрывайте элементы (глаз), блокируйте от случайных правок (замок), переименовывайте блоки для удобства. Вложенность в дереве точно отражает дочернюю структуру на холсте.",
    visual: (
      <div className="space-y-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs">
        <p className="font-medium">▼ Страница</p>
        <p className="pl-3">├ Заголовок</p>
        <p className="pl-3 text-[var(--muted)]">├ Кнопка (скрыт)</p>
        <p className="pl-3">▼ Контейнер</p>
        <p className="pl-6">├ Текст</p>
        <p className="pl-6">└ Изображение</p>
      </div>
    ),
  },
  {
    id: "scripts",
    icon: Blocks,
    title: "6. Визуальные скрипты",
    text: "Вкладка «Скрипты» — редактор блоков как в Scratch. Добавьте триггер «При клике», соедините с действиями: изменить цвет, размер, показать/скрыть, HTTP-запрос. Нажмите «Сохранить скрипт».",
    visual: <MockBlocksFlow />,
    tip: "Блоки «Изменить размер», «Изменить цвет», «Плавно изменить стиль» — без написания кода.",
  },
  {
    id: "server",
    icon: Server,
    title: "7. Сервер сайта",
    text: "Вкладка «Сервер»: включите сервер, создайте endpoint (путь + метод + JSON-ответ). Опубликуйте сайт. В скриптах используйте блок «Запрос к серверу сайта» с тем же путём.",
    visual: <MockServerPanel />,
    tip: "URL API появится после публикации — скопируйте его в панели сервера.",
  },
  {
    id: "publish",
    icon: Upload,
    title: "8. Публикация",
    text: "Кнопка «Опубликовать» в шапке редактора. Сайт станет доступен по ссылке вида /site/site_123456. Можно экспортировать HTML-файл (иконка загрузки в шапке). Добавляйте дополнительные страницы через «+ Страница» под шапкой редактора — у каждой свой адрес.",
    visual: (
      <div className="space-y-3">
        <div className="rounded-xl bg-brand-600 p-4 text-center text-white">
          <p className="text-sm font-medium">Сайт опубликован!</p>
          <p className="mt-2 break-all text-xs opacity-90">
            /site/site_482910
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs">
          <p className="font-medium mb-1 text-[var(--foreground)]">Страницы сайта</p>
          <div className="space-y-1 text-[var(--muted)]">
            <p>/site/site_482910 → Главная</p>
            <p>/site/site_482910/about → О нас</p>
            <p>/site/site_482910/contacts → Контакты</p>
          </div>
        </div>
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
          <Logo size={72} href="/dashboard" />
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
              className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs hover:border-brand-400 transition-colors"
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
