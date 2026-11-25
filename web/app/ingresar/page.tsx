"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { IconEye, IconEyeOff } from "@/components/icons";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("El formato del correo no es válido.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setSending(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("No se pudo iniciar sesión. Verificá el API y tus datos.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div className="hidden lg:block">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Bienvenido de nuevo</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">Ingresá para contactar profesionales.</h1>
        <p className="mt-4 text-slate-600">
          Con tu cuenta ves teléfono, mail y podés dejar una valoración.
        </p>
      </div>
      <form onSubmit={submit} className="rounded-[2rem] bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-semibold text-ink">Iniciar sesión</h2>
        <div className="mt-6 space-y-4">
          <label className="grid gap-1 text-sm font-medium">
            Correo electrónico
            <input
              className="field"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Contraseña
            <span className="relative">
              <input
                className="field pr-12"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 text-muted"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
              </button>
            </span>
          </label>
        </div>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button type="submit" className="btn-primary mt-6 w-full" disabled={sending}>
          {sending ? "Ingresando..." : "Ingresar"}
        </button>
        <p className="mt-4 text-sm text-muted">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="font-semibold text-brand hover:underline">
            Registrate
          </Link>
        </p>
      </form>
    </div>
  );
}
