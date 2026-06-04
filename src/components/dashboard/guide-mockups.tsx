/** Визуальные схемы интерфейса для гайда (не скриншоты — UI-макеты) */

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
            {["Текст", "Кнопка", "Изображение"].map((l) => (
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
        </div>
      </div>
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
