import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVerificationCode } from "@/lib/utils";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Email и пароль (мин. 6 символов) обязательны" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing?.emailVerified) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже зарегистрирован" },
        { status: 400 }
      );
    }

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.emailVerification.deleteMany({ where: { email } });
    await prisma.emailVerification.create({
      data: { email, code, expiresAt },
    });

    const emailResult = await sendVerificationEmail(email, code);

    if (!emailResult.ok) {
      return NextResponse.json(
        { error: emailResult.error || "Не удалось отправить письмо" },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: emailResult.devCode
        ? "Код для разработки (SMTP не настроен)"
        : "Код отправлен на ваш email",
      pendingEmail: email,
      pendingName: name,
      devCode: emailResult.devCode,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
