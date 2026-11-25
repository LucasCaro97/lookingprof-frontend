"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getContact, whatsappUrl } from "@/lib/api";
import type { ContactInfo } from "@/lib/types";
import { useAuth } from "./auth-provider";
import { IconMail, IconPhone, IconWhatsApp } from "./icons";

export function ContactPanel({ professionalId, firstName }: { professionalId: number; firstName: string }) {
  const { session, ready } = useAuth();
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      setContact(null);
      return;
    }
    getContact(professionalId, session.token)
      .then(setContact)
      .catch(() => setError("No pudimos cargar el contacto."));
  }, [professionalId, session]);

  if (!ready) {
    return <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />;
  }

  if (!session) {
    return (
      <div className="rounded-2xl bg-sand/70 p-5">
        <p className="font-semibold text-ink">Contacto disponible para usuarios registrados</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Creá una cuenta o ingresá para ver el teléfono y el correo de {firstName}.
        </p>
        <div className="mt-4 flex gap-2">
          <Link href="/ingresar" className="btn-primary">
            Ingresar
          </Link>
          <Link href="/registro" className="btn-ghost">
            Registrarme
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  const wa = whatsappUrl(contact?.phone);

  return (
    <div className="space-y-3">
      {contact?.phone ? (
        <a href={`tel:${contact.phone}`} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm hover:bg-slate-100">
          <IconPhone className="h-5 w-5 text-brand" />
          {contact.phone}
        </a>
      ) : (
        <p className="text-sm text-muted">Todavía no cargó un teléfono.</p>
      )}
      {contact?.email ? (
        <a href={`mailto:${contact.email}`} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm hover:bg-slate-100">
          <IconMail className="h-5 w-5 text-brand" />
          {contact.email}
        </a>
      ) : null}
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:brightness-95"
        >
          <IconWhatsApp className="h-5 w-5" />
          Escribir por WhatsApp
        </a>
      ) : null}
    </div>
  );
}
