/** Визуальные схемы интерфейса для гайда (UI-макеты, имитирующие интерфейс редактора) */

export function MockEditorLayout() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-slate-100 text-[10px] shadow-lg dark:bg-slate-900">
      <div className="flex h-8 items-center gap-2 border-b border-[var(--border)] bg-[var(--card)] px-3">
        <div className="h-3 w-3 rounded-full bg-red-400" />
        <div className="h-3 w-3 rounded-full bg-amber-400" />
        <div className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-2 text-[var(--muted)]">Редактор — Мой сайт</span>
      </div>
      <div className="flex h-48">
        <div className="w-20 shrink-0 border-r border-[var(--border)] bg-[var(--card)] p-2">
          <div className="mb-1 rounded bg-brand-100 px-1 py-0.5 text-brand-700 dark:bg-brand-900/50">
            Блоки
          </div>
          <div className="space-y-1">
            {["Текст", "Кнопка", "Изображение", "Контейнер"].map((l) => (
              <div
                key={l}
                className="truncate rounded border border-[var(--border)] bg-[var(--background)] px-1 py-0.5"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center bg-slate-200/80 p-4 dark:bg-slate-800/80">
          <div className="w-full max-w-[140px] rounded-lg border-2 border-dashed border-brand-400 bg-white p-3 shadow dark:bg-slate-950">
            <div className="h-2 w-16 rounded bg-slate-300" />
            <div className="mt-2 h-6 rounded bg-brand-500" />
          </div>
        </div>
        <div className="w-24 shrink-0 border-l border-[var(--border)] bg-[var(--card)] p-2">
          <p className="font-semibold text-[var(--foreground)]">Свойства</p>
          <div className="mt-2 h-4 rounded bg-[var(--background)]" />
          <div className="mt-1 h-4 rounded bg-[var(--background)]" />
          <div className="mt-1 h-4 w-3/4 rounded bg-[var(--background)]" />
        </div>
      </div>
    </div>
  );
}

export function MockContainerChildren() {
  return (
    <div className="space-y-4">
      {/* Шаг 1: перетащить Контейнер */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden text-[10px] shadow">
        <div className="bg-[var(--card)] border-b border-[var(--border)] px-3 py-1.5 font-medium text-[var(--muted)] flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-white font-bold text-[9px]">1</span>
          Перетащите «Контейнер» на холст
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900">
          {/* Палитра */}
          <div className="w-20 shrink-0 border-r border-[var(--border)] bg-[var(--card)] p-2 space-y-1">
            {["Текст", "Кнопка"].map((l) => (
              <div key={l} className="truncate rounded border border-[var(--border)] bg-[var(--background)] px-1 py-0.5">{l}</div>
            ))}
            <div className="truncate rounded border-2 border-brand-500 bg-brand-50 px-1 py-0.5 font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              Контейнер ✦
            </div>
          </div>
          {/* Холст */}
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="w-full max-w-[120px] rounded-lg border-2 border-dashed border-slate-300 bg-white p-2 dark:bg-slate-950">
              <p className="text-center text-[var(--muted)]">пусто</p>
            </div>
          </div>
        </div>
      </div>

      {/* Шаг 2: перетащить дочерний элемент */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden text-[10px] shadow">
        <div className="bg-[var(--card)] border-b border-[var(--border)] px-3 py-1.5 font-medium text-[var(--muted)] flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-white font-bold text-[9px]">2</span>
          Перетащите «Текст» прямо на контейнер
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900">
          <div className="w-20 shrink-0 border-r border-[var(--border)] bg-[var(--card)] p-2 space-y-1">
            <div className="truncate rounded border-2 border-brand-500 bg-brand-50 px-1 py-0.5 font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              Текст ✦
            </div>
            {["Кнопка", "Контейнер"].map((l) => (
              <div key={l} className="truncate rounded border border-[var(--border)] bg-[var(--background)] px-1 py-0.5">{l}</div>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="w-full max-w-[120px] rounded-lg border-2 border-dashed border-brand-400 bg-white p-2 ring-2 ring-brand-400/30 dark:bg-slate-950">
              <p className="text-brand-600 font-medium">↓ бросьте сюда</p>
            </div>
          </div>
        </div>
      </div>

      {/* Шаг 3: результат */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden text-[10px] shadow">
        <div className="bg-[var(--card)] border-b border-[var(--border)] px-3 py-1.5 font-medium text-[var(--muted)] flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white font-bold text-[9px]">✓</span>
          Элемент стал дочерним (видно в панели «Слои»)
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900">
          {/* Слои */}
          <div className="w-28 shrink-0 border-r border-[var(--border)] bg-[var(--card)] p-2 space-y-0.5">
            <p className="font-semibold text-[var(--foreground)]">Слои</p>
            <div className="flex items-center gap-1 rounded bg-[var(--background)] px-1 py-0.5">
              <span>▼</span> Контейнер
            </div>
            <div className="ml-3 flex items-center gap-1 rounded bg-brand-50 border border-brand-200 px-1 py-0.5 text-brand-700 dark:bg-brand-900/30 dark:border-brand-800 dark:text-brand-300">
              └ Текст
            </div>
          </div>
          {/* Холст */}
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="w-full max-w-[120px] rounded-lg border-2 border-dashed border-slate-300 bg-white p-2 dark:bg-slate-950">
              <p className="font-medium text-slate-700 dark:text-slate-200">Новый текст</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MockBorderClear() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs space-y-3">
      <p className="font-semibold text-[var(--foreground)]">Панель «Границы»</p>
      <div className="space-y-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Граница (все стороны)</span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {["none", "1px solid #e2e8f0", "2px solid #0c8ce9"].map((p) => (
              <span
                key={p}
                className={`rounded px-1.5 py-0.5 text-[9px] border ${
                  p === "none"
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-2">
          <span className="font-medium">Стиль границы</span>
          <div className="mt-1 rounded border border-[var(--border)] bg-[var(--card)] px-2 py-1">
            Нет ▾
          </div>
        </div>
      </div>
      <p className="text-[var(--muted)] leading-snug">
        Нажмите пресет <strong>none</strong> или выберите «Нет» в стиле — рамка исчезнет
      </p>
    </div>
  );
}

export function MockBlocksFlow() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-slate-50 p-6 dark:bg-slate-900">
      <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
        <div className="rounded-lg border-2 border-amber-400 bg-[var(--card)] px-4 py-2 text-center font-medium text-amber-600">
          При клике
        </div>
        <div className="h-4 w-0.5 bg-brand-400" />
        <div className="rounded-lg border-2 border-blue-500 bg-[var(--card)] px-4 py-2 text-center font-medium text-blue-600">
          Изменить цвет
        </div>
        <div className="h-4 w-0.5 bg-brand-400" />
        <div className="rounded-lg border-2 border-violet-500 bg-[var(--card)] px-4 py-2 text-center font-medium text-violet-600">
          HTTP-запрос
        </div>
      </div>
    </div>
  );
}

export function MockServerPanel() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs">
      <p className="font-semibold text-brand-600">Сервер сайта ✓</p>
      <code className="mt-2 block rounded bg-[var(--background)] p-2 text-[10px] text-[var(--muted)]">
        GET /api/site-runtime/site_123456/api/hello
      </code>
      <div className="mt-3 rounded-lg border border-dashed border-brand-300 p-3 text-[var(--muted)]">
        Ответ: {"{ \"message\": \"Hello\" }"}
      </div>
    </div>
  );
}

export function MockDashboard() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
        >
          <div className="h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900/40" />
          <p className="mt-2 font-medium">Проект {i}</p>
          <p className="text-[10px] text-[var(--muted)]">Открыть редактор →</p>
        </div>
      ))}
    </div>
  );
}
