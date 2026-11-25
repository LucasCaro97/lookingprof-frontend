"use client";

import { useState } from "react";
import { sendSupport } from "@/lib/api";

export default function SupportPage() {
  const [form, setForm] = useState({
    fromName: "",
    fromEmail: "",
    subject: "",
    text: "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    setError("");
    setStatus("");
    try {
      await sendSupport(form);
      setStatus("Mensaje enviado. Gracias por escribirnos.");
      setForm({ fromName: "", fromEmail: "", subject: "", text: "" });
    } catch {
      setError("No se pudo enviar el mensaje. Probá de nuevo más tarde.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl items-start gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Soporte</h1>
        <p className="mt-4 leading-7 text-slate-600">
          ¿Tenés una consulta sobre la plataforma? Escribinos y te respondemos por correo.
        </p>
      </div>
      <form onSubmit={submit} className="rounded-[2rem] bg-white p-8 shadow-sm">
        <label className="grid gap-1 text-sm font-medium">
          Nombre y apellido
          <input
            className="field"
            value={form.fromName}
            onChange={(event) => setForm({ ...form, fromName: event.target.value })}
            required
          />
        </label>
        <label className="mt-4 grid gap-1 text-sm font-medium">
          Correo electrónico
          <input
            className="field"
            type="email"
            value={form.fromEmail}
            onChange={(event) => setForm({ ...form, fromEmail: event.target.value })}
            required
          />
        </label>
        <label className="mt-4 grid gap-1 text-sm font-medium">
          Asunto
          <input
            className="field"
            value={form.subject}
            onChange={(event) => setForm({ ...form, subject: event.target.value })}
            required
          />
        </label>
        <label className="mt-4 grid gap-1 text-sm font-medium">
          Mensaje
          <textarea
            className="field min-h-32"
            value={form.text}
            onChange={(event) => setForm({ ...form, text: event.target.value })}
            required
          />
        </label>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {status ? <p className="mt-4 text-sm text-emerald-700">{status}</p> : null}
        <button type="submit" className="btn-primary mt-6 w-full" disabled={sending}>
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
