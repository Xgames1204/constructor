

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/ui/logo";

type Step = "form" | "verify";

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }
    if (data.devCode) setDevCode(data.devCode);
    setStep("verify");
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, name, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }
    // Сессия уже создана на сервере — сразу переходим в кабинет
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-constructor-charcoal to-neutral-900 p-12 text-white lg:flex">
        <Logo size={48} surface="dark" href="/" />
        <div>
          <h1 className="text-4xl font-bold">Создайте аккаунт</h1>
          <p className="mt-4 text-neutral-400">
            Подтверждение по email — 6-значный код для безопасности вашего аккаунта.
          </p>
        </div>
        <div className="flex justify-center py-8">
          <Logo size={120} showText={false} href={undefined} surface="dark" />
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size={40} href="/" />
          </div>
          <h2 className="text-2xl font-bold">Регистрация</h2>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-sm text-[var(--muted)]">или по email</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          {step === "form" ? (
            <form onSubmit={sendCode} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Имя</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Пароль (мин. 6)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {loading ? "Отправка..." : "Получить код"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-4">
              <p className="text-sm text-[var(--muted)]">
                Код отправлен на <strong>{email}</strong>. Проверьте «Входящие» и «Спам».
              </p>
              {devCode && (
                <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-900/30 dark:text-amber-100">
                  Dev-режим: ваш код <strong className="text-lg tracking-widest">{devCode}</strong>
                </p>
              )}
              <div>
                <label className="text-sm font-medium">6-значный код</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="000000"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {loading ? "Проверка..." : "Подтвердить и завершить"}
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-sm text-[var(--muted)] hover:underline"
              >
                Изменить email
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login" className="text-brand-600 hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
