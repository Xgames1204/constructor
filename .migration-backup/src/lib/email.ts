import nodemailer from "nodemailer";
import {
  buildVerificationEmailHtml,
  buildVerificationEmailText,
} from "./email-template";

const BRAND = "XEMENS Constructor";

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
}

export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<{ ok: boolean; devCode?: string; error?: string }> {
  if (!isSmtpConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[${BRAND}] Verification code for ${email}: ${code}`);
      return { ok: true, devCode: code };
    }
    return {
      ok: false,
      error:
        "Почта не настроена. Добавьте SMTP_* в .env (см. README → «Настройка почты»).",
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const from =
    process.env.SMTP_FROM || `XEMENS Constructor <${process.env.SMTP_USER}>`;

  await transporter.sendMail({
    from,
    to: email,
    subject: `${code} — ваш код · XEMENS Constructor`,
    text: buildVerificationEmailText(code),
    html: buildVerificationEmailHtml(code),
  });

  return { ok: true };
}
