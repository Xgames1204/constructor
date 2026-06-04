# Настройка email и Google OAuth для XEMENS Constructor

## 1. Реальная регистрация по email (6-значный код)

Добавьте в файл `.env` в корне проекта:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ваш@gmail.com
SMTP_PASS=пароль-приложения-google
SMTP_FROM="XEMENS Constructor <noreply@xemens.ru>"
```

### Gmail

1. Включите двухфакторную аутентификацию в Google-аккаунте.
2. [Пароли приложений](https://myaccount.google.com/apppasswords) → создайте пароль для «Почта».
3. `SMTP_PASS` — этот 16-символьный пароль (не основной пароль Gmail).

### Yandex

```env
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=ваш@yandex.ru
SMTP_PASS=пароль-приложения
```

### Mail.ru

```env
SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_SECURE=true
```

После изменения `.env` перезапустите сервер: `npm run dev`.

В **production** без SMTP регистрация вернёт ошибку «Почта не настроена».  
В **development** без SMTP код показывается на экране (только для тестов).

---

## 2. Вход через Google (OAuth 2.0) — бренд XEMENS

### Шаг 1: Google Cloud Console

1. Откройте [Google Cloud Console](https://console.cloud.google.com/).
2. Создайте проект, например **XEMENS Constructor**.
3. **APIs & Services** → **OAuth consent screen**:
   - User Type: **External** (или Internal для Google Workspace).
   - **App name:** `XEMENS Constructor`
   - **User support email:** ваш email.
   - **App logo:** загрузите `public/logo.png`.
   - **Application home page:** `https://ваш-домен.ru` (или `http://localhost:3000` для теста).
   - **Authorized domains:** `localhost` (для dev), ваш домен в prod.
   - Scopes: `email`, `profile`, `openid` (добавляются автоматически с Google provider).

### Шаг 2: Credentials

1. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**.
2. Type: **Web application**.
3. **Name:** `XEMENS Constructor Web`.
4. **Authorized JavaScript origins:**
   - `http://localhost:3000`
   - `https://ваш-домен.ru`
5. **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google`
   - `https://ваш-домен.ru/api/auth/callback/google`

### Шаг 3: `.env`

```env
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=длинная-случайная-строка-минимум-32-символа
```

Сгенерировать секрет:

```bash
openssl rand -base64 32
```

### Шаг 4: Проверка

1. Перезапустите `npm run dev`.
2. На странице регистрации / входа нажмите **«Войти через Google»**.
3. После успеха откроется личный кабинет.

> **Важно:** Google OAuth сразу создаёт аккаунт и входит — это нормально.  
> Регистрация **по email** требует код + отдельный вход паролем.
