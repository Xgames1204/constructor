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
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Левая панель ── */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-constructor-charcoal to-neutral-900 p-12 text-white lg:flex">
        <Logo size={32} surface="dark" href="/" />
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

      {/* ── Правая панель ── */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size={40} href="/" />
          </div>
          <h2 className="text-2xl font-bold">Регистрация</h2>

          {step === "form" && (
            <>
              {/* Кнопка Google */}
              <a
                href="/api/auth/google"
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-medium shadow-sm hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Зарегистрироваться через Google
              </a>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-sm text-[var(--muted)]">или по email</span>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>
            </>
          )}

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
