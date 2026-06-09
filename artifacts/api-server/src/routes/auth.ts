import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { eq, and, desc } from "drizzle-orm";
import { db, usersTable, emailVerificationsTable, sessionsTable } from "@workspace/db";
import nodemailer from "nodemailer";

const router = Router();

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function sendVerificationEmail(email: string, code: string): Promise<{ ok: boolean; devCode?: string; error?: string }> {
  if (!isSmtpConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Constructor] Verification code for ${email}: ${code}`);
      return { ok: true, devCode: code };
    }
    return { ok: false, error: "Почта не настроена. Добавьте SMTP_* в переменные окружения." };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const from = process.env.SMTP_FROM || `XEMENS Constructor <${process.env.SMTP_USER}>`;
  await transporter.sendMail({
    from,
    to: email,
    subject: `${code} — ваш код · XEMENS Constructor`,
    text: `Ваш код подтверждения: ${code}\n\nКод действует 15 минут.`,
    html: `<h2>Код подтверждения</h2><p style="font-size:32px;letter-spacing:8px;font-weight:bold">${code}</p><p>Код действует 15 минут.</p>`,
  });

  return { ok: true };
}

router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: "Email и пароль (мин. 6 символов) обязательны" });
    }

    const existing = await db.query.usersTable.findFirst({ where: eq(usersTable.email, email) });
    if (existing?.emailVerified) {
      return res.status(400).json({ error: "Пользователь с таким email уже зарегистрирован" });
    }

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.delete(emailVerificationsTable).where(eq(emailVerificationsTable.email, email));
    await db.insert(emailVerificationsTable).values({ id: randomUUID(), email, code, expiresAt });

    const emailResult = await sendVerificationEmail(email, code);
    if (!emailResult.ok) {
      return res.status(503).json({ error: emailResult.error || "Не удалось отправить письмо" });
    }

    return res.json({
      ok: true,
      message: emailResult.devCode ? "Код для разработки (SMTP не настроен)" : "Код отправлен на ваш email",
      pendingEmail: email,
      pendingName: name || null,
      devCode: emailResult.devCode || null,
    });
  } catch (e) {
    req.log.error(e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email, code, name, password } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email и код обязательны" });
    }

    const verification = await db.query.emailVerificationsTable.findFirst({
      where: and(eq(emailVerificationsTable.email, email), eq(emailVerificationsTable.code, code)),
      orderBy: desc(emailVerificationsTable.createdAt),
    });

    if (!verification) {
      return res.status(400).json({ error: "Неверный код" });
    }
    if (verification.expiresAt < new Date()) {
      return res.status(400).json({ error: "Код истёк. Запросите новый." });
    }

    const hashed = await bcrypt.hash(password, 12);
    const existing = await db.query.usersTable.findFirst({ where: eq(usersTable.email, email) });

    let userId: string;
    if (existing) {
      await db.update(usersTable)
        .set({ name: name || existing.name, password: hashed, emailVerified: new Date(), updatedAt: new Date() })
        .where(eq(usersTable.id, existing.id));
      userId = existing.id;
    } else {
      userId = randomUUID();
      await db.insert(usersTable).values({
        id: userId,
        email,
        name: name || email.split("@")[0],
        password: hashed,
        emailVerified: new Date(),
      });
    }

    await db.delete(emailVerificationsTable).where(eq(emailVerificationsTable.email, email));

    // Автоматически создаём сессию — пользователь уже вошёл
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await db.insert(sessionsTable).values({ id: sessionId, userId, expiresAt });

    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, userId) });

    return res.json({
      ok: true,
      message: "Регистрация завершена.",
      user: user ? { id: user.id, email: user.email, name: user.name, image: user.image } : null,
    });
  } catch (e) {
    req.log.error(e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ error: "Email и пароль обязательны" });
    }

    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.email, email) });
    if (!user?.password || !user.emailVerified) {
      return res.status(401).json({ error: "Неверный email или пароль. Убедитесь, что email подтверждён." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Неверный email или пароль. Убедитесь, что email подтверждён." });
    }

    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await db.insert(sessionsTable).values({ id: sessionId, userId: user.id, expiresAt });

    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return res.json({
      user: { id: user.id, email: user.email, name: user.name, image: user.image },
    });
  } catch (e) {
    req.log.error(e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ── Google OAuth ─────────────────────────────────────────────────────────────

function getGoogleCallbackUrl(): string {
  if (process.env.GOOGLE_CALLBACK_URL) return process.env.GOOGLE_CALLBACK_URL;
  const replitDomain = process.env.REPLIT_DEV_DOMAIN;
  if (replitDomain) return `https://${replitDomain}/api/auth/google/callback`;
  return `http://localhost:5173/api/auth/google/callback`;
}

router.get("/google", (_req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.redirect("/auth/login?error=google_not_configured");
  }
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGoogleCallbackUrl(),
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });
  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

router.get("/google/callback", async (req, res) => {
  try {
    const { code, error } = req.query;

    if (error || !code) {
      return res.redirect("/auth/login?error=google_cancelled");
    }

    // Обмен кода на токен
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code as string,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: getGoogleCallbackUrl(),
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json() as { access_token?: string };

    if (!tokens.access_token) {
      return res.redirect("/auth/login?error=google_token");
    }

    // Получаем данные пользователя от Google
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser = await userInfoRes.json() as {
      email?: string; name?: string; picture?: string;
    };

    if (!googleUser.email) {
      return res.redirect("/auth/login?error=google_no_email");
    }

    // Найти или создать пользователя
    let user = await db.query.usersTable.findFirst({ where: eq(usersTable.email, googleUser.email) });

    if (!user) {
      const userId = randomUUID();
      await db.insert(usersTable).values({
        id: userId,
        email: googleUser.email,
        name: googleUser.name || googleUser.email.split("@")[0],
        image: googleUser.picture ?? null,
        emailVerified: new Date(),
      });
      user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, userId) });
    } else if (!user.emailVerified) {
      await db.update(usersTable)
        .set({ emailVerified: new Date(), image: googleUser.picture ?? user.image, updatedAt: new Date() })
        .where(eq(usersTable.id, user.id));
      user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, user.id) });
    }

    if (!user) {
      return res.redirect("/auth/login?error=google_user");
    }

    // Создаём сессию
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await db.insert(sessionsTable).values({ id: sessionId, userId: user.id, expiresAt });

    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return res.redirect("/dashboard");
  } catch (e) {
    req.log.error(e);
    return res.redirect("/auth/login?error=google_server");
  }
});

// ─────────────────────────────────────────────────────────────────────────────

router.post("/logout", async (req, res) => {
  try {
    const sessionId = req.cookies?.session_id;
    if (sessionId) {
      await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
    }
    res.clearCookie("session_id", { path: "/" });
    return res.json({ ok: true });
  } catch (e) {
    req.log.error(e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const sessionId = req.cookies?.session_id;
    if (!sessionId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const session = await db.query.sessionsTable.findFirst({
      where: eq(sessionsTable.id, sessionId),
    });

    if (!session || session.expiresAt < new Date()) {
      res.clearCookie("session_id", { path: "/" });
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, session.userId) });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.json({
      user: { id: user.id, email: user.email, name: user.name, image: user.image },
    });
  } catch (e) {
    req.log.error(e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
