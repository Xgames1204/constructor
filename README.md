# XEMENS Constructor

Визуальный конструктор сайтов без кода. Drag-and-drop редактор с многостраничностью, блочными скриптами, публикацией и встроенным сервером.

---

## Быстрый старт

```bash
# Установить зависимости
pnpm install

# Запустить API-сервер (порт 8080)
pnpm --filter @workspace/api-server run dev

# Запустить фронтенд
pnpm --filter @workspace/constructor run dev

# Применить схему БД (только первый раз / после изменений схемы)
pnpm --filter @workspace/db run push
```

Откройте http://localhost:5173 (или адрес из `PORT`).

---

## Необходимые переменные окружения

| Переменная      | Описание                          | Пример                                           |
|-----------------|-----------------------------------|--------------------------------------------------|
| `DATABASE_URL`  | Строка подключения к PostgreSQL   | `postgresql://user:pass@host:5432/db`            |
| `PORT`          | Порт для каждого сервиса (Replit) | Задаётся платформой автоматически                |

Дополнительно (опционально):
| `SESSION_SECRET` | Секрет для сессий | Случайная строка 32+ символов |
| `SMTP_*`         | SMTP для email-верификации | Без него работает dev-режим (код в ответе API) |

---

## Структура проекта

```
.
├── artifacts/
│   ├── constructor/          # React-фронтенд (Vite)
│   │   └── src/
│   │       ├── App.tsx                  # Wouter роутер
│   │       ├── components/
│   │       │   ├── editor/
│   │       │   │   ├── editor-shell.tsx # Главный UI редактора
│   │       │   │   ├── canvas-element.tsx  # Элементы на холсте, DnD
│   │       │   │   ├── properties-panel.tsx
│   │       │   │   ├── layers-panel.tsx
│   │       │   │   └── pages-bar.tsx    # Полоса переключения страниц
│   │       │   ├── landing/
│   │       │   ├── dashboard/
│   │       │   ├── providers.tsx        # AppSettings + ThemeProvider
│   │       │   └── ui/
│   │       ├── store/
│   │       │   └── editor-store.ts      # Zustand + immer: весь стейт редактора
│   │       ├── lib/
│   │       │   ├── i18n.ts              # 7 языков: ru en uk de es fr pl
│   │       │   ├── auth-context.tsx
│   │       │   └── site-renderer.ts    # JSON → HTML для публичных сайтов
│   │       └── app/(app)/
│   │           ├── dashboard/
│   │           │   ├── page.tsx         # Список проектов
│   │           │   ├── guide/page.tsx   # Пошаговое руководство
│   │           │   ├── docs/page.tsx    # Справочник кнопок
│   │           │   └── settings/page.tsx
│   │           ├── editor/[projectId]/page.tsx
│   │           └── auth/
│   └── api-server/           # Express 5 API
│       └── src/
│           ├── index.ts
│           └── routes/
│               ├── auth.ts       # register / verify / login / logout / me
│               └── projects.ts   # CRUD + publish + /site/:siteId runtime
├── lib/
│   └── db/
│       └── src/
│           └── schema/           # Drizzle ORM: users, sessions, projects…
├── package.json                  # pnpm workspaces root
└── pnpm-workspace.yaml
```

---

## Стек

| Слой       | Технология                                      |
|------------|-------------------------------------------------|
| Фронтенд   | React 19, Vite, Tailwind v4, Wouter             |
| Стейт      | Zustand + immer                                 |
| DnD        | @dnd-kit/core + @dnd-kit/sortable               |
| Скрипты    | @xyflow/react (визуальный редактор блоков)      |
| API        | Express 5, cookie-parser, express-session       |
| База данных| PostgreSQL + Drizzle ORM                        |
| Авторизация| bcrypt + cookie-сессии (без JWT, без NextAuth)  |
| UI-иконки  | lucide-react                                    |
| Тема       | next-themes (light / dark / system)             |
| Языки      | Встроенный i18n: RU, EN, UK, DE, ES, FR, PL     |

---

## Основные возможности

### Редактор
- **Drag-and-drop** перетаскивание блоков из палитры на холст
- **Вложенные элементы**: перетащить блок в контейнер → он становится дочерним
- **Многостраничность**: вкладки страниц под шапкой, переключение без перезагрузки
- **Ссылки между страницами**: Свойства → Навигация → Страница сайта
- **Undo / Redo**: история до 50 действий (Ctrl+Z / Ctrl+Y)
- **Автосохранение**: каждые 3 / 10 / 30 с (настраивается)
- **Экспорт HTML**: готовый файл с встроенными стилями и скриптами

### Визуальные скрипты
- Триггеры: «При клике», «При загрузке», «По таймеру»
- Действия: изменить стиль, плавно изменить стиль, показать/скрыть, HTTP-запрос

### Публикация
- Сайт → `/site/:siteId` (каждая страница → `/site/:siteId/slug`)
- Встроенный сервер: статические JSON-endpoints `/api/site/:siteId/…`
- Скрипт «Запрос к серверу сайта» обращается к этим endpoints без CORS

### Настройки (localStorage)
- Язык интерфейса: 7 языков
- Тема: светлая / тёмная / системная
- Автосохранение + интервал (3 / 10 / 30 с)
- Привязка к сетке, показ сетки
- Компактный интерфейс
- Подписи элементов
- Позиция по умолчанию (relative / absolute)

---

## API-маршруты

| Метод   | Путь                          | Описание                              |
|---------|-------------------------------|---------------------------------------|
| POST    | `/api/auth/register`          | Регистрация + email-верификация       |
| POST    | `/api/auth/verify`            | Подтверждение кода                    |
| POST    | `/api/auth/login`             | Вход                                  |
| POST    | `/api/auth/logout`            | Выход                                 |
| GET     | `/api/auth/me`                | Текущий пользователь                  |
| GET     | `/api/projects`               | Список проектов                       |
| POST    | `/api/projects`               | Создать проект                        |
| GET     | `/api/projects/:id`           | Данные проекта                        |
| PUT     | `/api/projects/:id`           | Сохранить проект                      |
| DELETE  | `/api/projects/:id`           | Удалить проект                        |
| POST    | `/api/projects/:id/publish`   | Опубликовать                          |
| GET     | `/api/site/:siteId`           | Данные опубликованного сайта (JSON)   |
| ANY     | `/api/site/:siteId/*`         | Пользовательские endpoints сервера    |

---

## Авторизация

- Пароль хешируется через **bcrypt** (cost 10)
- Сессия — строка в PostgreSQL-таблице `sessions` + cookie `connect.sid`
- Email-верификация: без SMTP → `devCode` возвращается прямо в теле ответа API
- Нет JWT, нет NextAuth, нет OAuth (намеренно — упрощённая архитектура)

---

## Схема БД (Drizzle)

```
users           id, email, passwordHash, name, verified, createdAt
sessions        id, userId, expiresAt, createdAt
emailVerifications  id, userId, code, expiresAt
projects        id, userId, name, data(jsonb), published, siteId, updatedAt
```

---

## Команды разработки

```bash
pnpm run typecheck          # TypeScript проверка всего монорепо
pnpm run build              # Сборка всех пакетов
pnpm --filter @workspace/db run push    # Синхронизировать схему с БД
pnpm --filter @workspace/db run studio  # Drizzle Studio (браузерный UI для БД)
```

---

## Горячие клавиши редактора

| Сочетание               | Действие                      |
|-------------------------|-------------------------------|
| `Ctrl+Z`                | Отменить                      |
| `Ctrl+Y` / `Ctrl+⇧Z`   | Повторить                     |
| `Ctrl+S`                | Сохранить                     |
| `Ctrl+C` / `Ctrl+V`    | Копировать / Вставить элемент |
| `Ctrl+D`                | Дублировать элемент           |
| `Delete` / `Backspace`  | Удалить элемент               |
| `Escape`                | Снять выделение               |
| Дважды кликнуть на вкладке | Переименовать страницу     |

---

## Лицензия

MIT — свободное использование, изменение и распространение.
