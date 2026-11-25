"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { IconEye, IconEyeOff } from "@/components/icons";
import { LocationFields } from "@/components/location-fields";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER" as "USER" | "PROFESSIONAL",
    provinceId: "",
    cityId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!form.provinceId || !form.cityId) {
      setError("Seleccioná provincia y ciudad.");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setSending(true);
    try {
      await register({
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        role: form.role,
        provinceId: Number(form.provinceId),
        cityId: Number(form.cityId),
      });
      router.push(form.role === "PROFESSIONAL" ? "/cuenta/perfil" : "/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("Ese correo ya está registrado.");
      } else {
        setError("No se pudo completar el registro. Revisá los datos o el API.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <form onSubmit={submit} className="rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-ink">Crear cuenta</h1>
        <p className="mt-2 text-sm text-muted">Elegí si querés contratar o ofrecer un oficio.</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => update("role", "USER")}
            className={`rounded-2xl border p-4 text-left ${
              form.role === "USER" ? "border-brand bg-brand/5" : "border-slate-200"
            }`}
          >
            <p className="font-semibold">Quiero contratar</p>
            <p className="mt-1 text-sm text-muted">Busco profesionales.</p>
          </button>
          <button
            type="button"
            onClick={() => update("role", "PROFESSIONAL")}
            className={`rounded-2xl border p-4 text-left ${
              form.role === "PROFESSIONAL" ? "border-brand bg-brand/5" : "border-slate-200"
            }`}
          >
            <p className="font-semibold">Soy profesional</p>
            <p className="mt-1 text-sm text-muted">Quiero aparecer en búsquedas.</p>
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">
            Nombre
            <input className="field" value={form.firstName} onChange={(event) => update("firstName", event.target.value)} required />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Apellido
            <input className="field" value={form.lastName} onChange={(event) => update("lastName", event.target.value)} required />
          </label>
        </div>
        <label className="mt-4 grid gap-1 text-sm font-medium">
          Correo electrónico
          <input className="field" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} required />
        </label>
        <label className="mt-4 grid gap-1 text-sm font-medium">
          Contraseña
          <span className="relative">
            <input
              className="field pr-12"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => update("password", event.target.value)}
              minLength={8}
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

        <div className="mt-4">
          <LocationFields
            provinceId={form.provinceId}
            cityId={form.cityId}
            onChange={(provinceId, cityId) =>
              setForm((current) => ({ ...current, provinceId, cityId }))
            }
          />
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button type="submit" className="btn-primary mt-6 w-full" disabled={sending}>
          {sending ? "Creando cuenta..." : "Registrarme"}
        </button>
        <p className="mt-4 text-sm text-muted">
          ¿Ya tenés cuenta?{" "}
          <Link href="/ingresar" className="font-semibold text-brand hover:underline">
            Ingresá
          </Link>
        </p>
      </form>
    </div>
  );
}
