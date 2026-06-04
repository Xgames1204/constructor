# XEMENS Constructor

Визуальный конструктор сайтов — drag & drop, глубокие стили, визуальное программирование блоками, публикация в один клик.

## Быстрый старт

```bash
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Если в системе нет Node.js, можно использовать локальную копию из `.node/bin` (см. ниже).

```bash
export PATH="$(pwd)/.node/bin:$PATH"
npm run dev
```

---

## Настройка почты (регистрация с кодом на email)

Без SMTP в **production** регистрация по email не отправит письмо.  
В **development** без SMTP код показывается на экране (только для тестов).

### 1. Добавьте переменные в `.env`

```env
# Обязательно для реальной почты
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ваш@gmail.com
SMTP_PASS=пароль-приложения
SMTP_FROM="XEMENS Constructor <noreply@xemens.ru>"

# Нужен для логотипа в письме (URL должен быть доступен из интернета)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

В production укажите реальный домен, например `https://constructor.xemens.ru`.

### 2. Gmail (рекомендуется для старта)

1. Включите [двухфакторную аутентификацию](https://myaccount.google.com/security).
2. Создайте [пароль приложения](https://myaccount.google.com/apppasswords) → «Почта».
3. В `.env`:
   - `SMTP_USER` — ваш `@gmail.com`
   - `SMTP_PASS` — 16-символьный пароль приложения (не основной пароль).

### 3. Yandex

```env
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=ваш@yandex.ru
SMTP_PASS=пароль-приложения
```

### 4. Mail.ru

```env
SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=ваш@mail.ru
SMTP_PASS=пароль-приложения
```

### 5. Проверка

1. Перезапустите сервер: `npm run dev`.
2. Откройте `/auth/register`, введите реальный email.
3. На почту придёт оформленное HTML-письмо с кодом (градиент, карточка, крупные цифры).
4. Введите 6 цифр на сайте → перейдите на **вход** → войдите с email и паролем.

Подробнее про Google OAuth: [docs/EMAIL_AND_GOOGLE.md](docs/EMAIL_AND_GOOGLE.md).

---

## Логотип (два файла, без CSS-инверсии)

Положите **два PNG с прозрачным фоном** в папку `public/`:

| Файл | Когда использовать |
|------|-------------------|
| `public/logo-light.png` | Светлый фон сайта — **тёмный** знак «C» |
| `public/logo-dark.png` | Тёмный фон / тёмная тема — **светлый** знак «C» |

Компонент `<Logo />` подставляет нужный файл автоматически:

- `surface="auto"` — по теме (светлая/тёмная)
- `surface="light"` — всегда `logo-light.png`
- `surface="dark"` — всегда `logo-dark.png` (синяя панель входа, CTA-блок)

Favicon: `src/app/icon.png` (можно скопировать из `logo-light.png`).

**Инверсия и фильтры не используются** — только ваши два изображения.

---

## Google OAuth (XEMENS)

1. [Google Cloud Console](https://console.cloud.google.com/) → проект **XEMENS Constructor**.
2. OAuth consent screen → название **XEMENS Constructor**, логотип `logo-light.png`.
3. Credentials → Redirect URI:  
   `http://localhost:3000/api/auth/callback/google`
4. В `.env`:

```env
GOOGLE_CLIENT_ID=....apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-....
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=случайная-строка-32+символов
```

---

## Возможности

- Лендинг, регистрация (email + Google), личный кабинет
- Редактор: 20+ элементов, позиционирование, стили с подсказками
- Визуальные скрипты (блоки → JavaScript), HTTP-запросы
- Публикация: `https://mydomainan.ru/site_123456`
- Экспорт HTML, Ctrl+Z/Y, автосохранение, RU/EN, темы

## Структура

```
src/app/           — страницы и API
src/components/    — UI, редактор
src/lib/           — auth, email, renderer
public/
  logo-light.png   — тёмный знак (светлый фон)
  logo-dark.png    — светлый знак (тёмный фон)
prisma/            — SQLite
```
