
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
  FileStack,
} from "lucide-react";

const Screenshot = ({ src, alt }: { src: string; alt: string }) => (
  <div className="overflow-hidden rounded-xl border border-[var(--border)] shadow-md">
    <img src={src} alt={alt} className="w-full object-cover" />
  </div>
);

const STEPS = [
  {
    id: "start",
    icon: BookOpen,
    title: "1. Начало работы",
    text: "Откройте сайт и нажмите «Начать бесплатно». После регистрации и входа в кабинете нажмите «Новый проект» — откроется редактор с пустым холстом.",
    visual: (
      <div className="space-y-3">
        <Screenshot src="/guide/screen-landing.jpg" alt="Главная страница Constructor" />
        <div className="grid grid-cols-2 gap-3">
          <Screenshot src="/guide/screen-login.jpg" alt="Экран входа" />
          <MockDashboard />
        </div>
      </div>
    ),
    tip: "Проекты сохраняются автоматически каждые N секунд (настраивается в Настройки → Редактор → Интервал автосохранения).",
  },
  {
    id: "elements",
    icon: MousePointer2,
    title: "2. Элементы и перетаскивание",
    text: "Слева вкладка «Блоки» — перетащите текст, кнопку, изображение или контейнер на серую область (холст). Кликните элемент, чтобы выделить его и открыть свойства справа. Перетаскивайте выделенный элемент мышью — позиция сохранится.",
    visual: <MockEditorLayout />,
    tip: "Для точного позиционирования включите «Привязка к сетке» в настройках. Если элемент «прыгает» назад — переключите позицию на absolute в панели «Позиция» справа.",
  },
  {
    id: "pages",
    icon: FileStack,
    title: "3. Несколько страниц",
    text: "Под шапкой редактора находится полоса страниц. Кликните вкладку страницы, чтобы переключиться на неё — холст перезагрузится. Нажмите «+ Страница» для создания новой. Дважды кликните на вкладку — поле станет редактируемым, можно переименовать страницу. При наведении появляется × для удаления. Чтобы кнопка или ссылка вела с одной страницы на другую — выделите элемент → в панели свойств справа откройте раздел «Навигация» → выберите «Страница сайта» и укажите нужную.",
    visual: (
      <div className="space-y-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="border-b border-[var(--border)] bg-black/5 dark:bg-white/5 flex items-center gap-1 px-3 py-0 text-xs overflow-x-auto">
            {["Главная", "О нас", "Контакты"].map((name, i) => (
              <div
                key={name}
                className={`shrink-0 cursor-pointer select-none px-3 py-2.5 border-b-2 font-medium transition ${
                  i === 0
                    ? "border-brand-500 text-brand-600"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {name}
              </div>
            ))}
            <div className="shrink-0 ml-2 rounded px-2 py-1 text-[var(--muted)] hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer">
              + Страница
            </div>
          </div>
          <div className="p-4 text-xs text-[var(--muted)] space-y-1">
            <p>• Активная страница: <strong className="text-[var(--foreground)]">Главная</strong></p>
            <p>• Дважды кликните на вкладку — переименовать</p>
            <p>• Наведите на вкладку — появится × для удаления</p>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs">
          <p className="font-medium mb-2 text-[var(--foreground)]">Ссылки между страницами</p>
          <div className="space-y-1 text-[var(--muted)]">
            <p>Выделите кнопку или ссылку на холсте</p>
            <p>→ Панель Свойства (справа) → <strong>Навигация</strong></p>
            <p>→ Выберите «Страница сайта» → укажите страницу</p>
            <p className="pt-1 text-brand-600 dark:text-brand-400">✓ При публикации адрес подставляется автоматически</p>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs">
          <p className="font-medium mb-1 text-[var(--foreground)]">URL страниц после публикации</p>
          <div className="space-y-0.5 text-[var(--muted)] font-mono">
            <p>/site/site_482910 <span className="not-italic">→ Главная</span></p>
            <p>/site/site_482910/about <span className="not-italic">→ О нас</span></p>
            <p>/site/site_482910/contacts <span className="not-italic">→ Контакты</span></p>
          </div>
        </div>
      </div>
    ),
    tip: "Slug в URL — это имя страницы, написанное латиницей в нижнем регистре (автоматически транслитерируется). Чтобы задать его вручную — переименуйте страницу латинскими символами.",
  },
  {
    id: "children",
    icon: Box,
    title: "4. Дочерние элементы в контейнере",
    text: "Контейнер — это аналог тега <div>: он группирует другие элементы внутри себя. Чтобы вложить элемент внутрь контейнера, перетащите его из палитры прямо на синюю рамку контейнера на холсте. Отпустите — элемент станет дочерним. Вы увидите это в панели «Слои»: он появится вложенным под контейнером.",
    visual: <MockContainerChildren />,
    tip: "Можно вкладывать контейнеры друг в друга сколько угодно. Для выравнивания дочерних элементов установите родителю display: flex в панели «Flex / Grid».",
  },
  {
    id: "styles",
    icon: Palette,
    title: "5. Стили и рамки",
    text: "Справа панель «Свойства»: меняйте текст, цвета, отступы, шрифты. Раздел «Границы» управляет рамкой вокруг элемента. Чтобы убрать рамку — нажмите пресет «none» или выберите стиль «Нет» в поле «Стиль границы». Кнопки «Копировать стили» и «Вставить стили» позволяют перенести оформление с одного элемента на другой.",
    visual: <MockBorderClear />,
    tip: "Выделите элемент → «Копировать стили» → выделите другой → «Вставить стили». Экономит время при создании однотипных блоков.",
  },
  {
    id: "layers",
    icon: Layers,
    title: "6. Слои",
    text: "Вкладка «Слои» показывает дерево страницы. Скрывайте элементы (иконка глаза), блокируйте от случайных правок (замок), переименовывайте блоки для удобства двойным кликом по имени. Вложенность в дереве точно отражает дочернюю структуру на холсте.",
    visual: (
      <div className="space-y-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs">
        <p className="font-medium text-[var(--foreground)]">▼ Страница</p>
        <div className="pl-3 space-y-1">
          <p className="flex items-center justify-between">
            <span>├ Заголовок</span>
            <span className="text-[var(--muted)]">👁 🔒</span>
          </p>
          <p className="flex items-center justify-between text-[var(--muted)]">
            <span>├ Кнопка <em>(скрыт)</em></span>
            <span>🔒</span>
          </p>
          <div>
            <p className="flex items-center justify-between">
              <span>▼ Контейнер</span>
              <span className="text-[var(--muted)]">👁 🔒</span>
            </p>
            <div className="pl-3 space-y-0.5 text-[var(--muted)]">
              <p>├ Текст</p>
              <p>└ Изображение</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "scripts",
    icon: Blocks,
    title: "7. Визуальные скрипты",
    text: "Вкладка «Скрипты» — редактор блоков как в Scratch. Выделите элемент на холсте, добавьте триггер «При клике» или «При загрузке», соедините с действиями: изменить цвет, размер, показать/скрыть, HTTP-запрос. Нажмите «Сохранить скрипт».",
    visual: <MockBlocksFlow />,
    tip: "Блоки «Изменить размер», «Изменить цвет», «Плавно изменить стиль» — интерактивность без написания кода.",
  },
  {
    id: "server",
    icon: Server,
    title: "8. Сервер сайта",
    text: "Вкладка «Сервер»: включите сервер, создайте endpoint (путь + метод + JSON-ответ). Опубликуйте сайт. В скриптах используйте блок «Запрос к серверу сайта» с тем же путём — например /data для GET-запроса.",
    visual: <MockServerPanel />,
    tip: "URL API появится после публикации: /api/site/SITEID/ваш-путь. Скопируйте его в блоке скриптов «HTTP-запрос».",
  },
  {
    id: "publish",
    icon: Upload,
    title: "9. Публикация",
    text: "Кнопка «Опубликовать» в шапке редактора. Сайт станет доступен по ссылке вида /site/site_123456. Можно экспортировать HTML-файл (кнопка со стрелкой вниз в шапке). После первой публикации кнопка-глаз открывает сайт в новой вкладке.",
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
          <div className="space-y-1 text-[var(--muted)] font-mono">
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
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Logo size={24} href="/dashboard" />
          </div>
          <Link
            href="/dashboard/docs"
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-black/5 dark:hover:bg-white/5"
          >
            Документация →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Logo size={28} href="/dashboard" />
            <h1 className="text-3xl font-bold">Руководство</h1>
          </div>
          <p className="text-[var(--muted)] max-w-2xl">
            Пошаговые инструкции с наглядными схемами интерфейса. Подходит для
            начинающих и для тех, кто хочет освоить страницы, сервер и скрипты.
          </p>
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

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center text-white">
            <h3 className="text-xl font-bold">Готовы попробовать?</h3>
            <p className="mt-2 opacity-90">Создайте проект и откройте редактор</p>
            <Link
              href="/dashboard"
              className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-brand-700 hover:bg-brand-50"
            >
              Перейти в кабинет
            </Link>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
            <h3 className="text-xl font-bold">Нужна справка?</h3>
            <p className="mt-2 text-[var(--muted)]">Детальное описание каждой кнопки и панели</p>
            <Link
              href="/dashboard/docs"
              className="mt-6 inline-block rounded-xl border border-brand-300 bg-brand-50 px-8 py-3 font-semibold text-brand-700 hover:bg-brand-100 dark:border-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
            >
              Документация
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
