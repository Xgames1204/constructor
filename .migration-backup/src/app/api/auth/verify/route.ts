import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code, name, password } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email и код обязательны" },
        { status: 400 }
      );
    }

    const verification = await prisma.emailVerification.findFirst({
      where: { email, code },
      orderBy: { createdAt: "desc" },
    });

    if (!verification) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }

    if (verification.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Код истёк. Запросите новый." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
        password: hashed,
        emailVerified: new Date(),
      },
      create: {
        email,
        name: name || email.split("@")[0],
        password: hashed,
        emailVerified: new Date(),
      },
    });

    await prisma.emailVerification.deleteMany({ where: { email } });

    return NextResponse.json({
      ok: true,
      message: "Регистрация завершена. Войдите в аккаунт.",
      userId: user.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
