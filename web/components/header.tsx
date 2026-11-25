"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./auth-provider";
import { IconClose, IconMenu } from "./icons";

const publicLinks = [
  { href: "/", label: "Inicio" },
  { href: "/profesionales", label: "Profesionales" },
  { href: "/soporte", label: "Soporte" },
];

export function Header() {
  const router = useRouter();
  const { session, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = () => setOpen(false);
  const currentUser = mounted ? session : null;

  const handleLogout = () => {
    logout();
    close();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={close}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 text-sm font-black tracking-tight">
            LP
          </span>
          <span className="text-lg font-semibold tracking-tight">LookingProf</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium transition hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {currentUser ? (
            <>
              <Link
                href="/cuenta/perfil"
                className="rounded-full px-3 py-1.5 text-sm font-medium hover:bg-white/10"
              >
                Hola, {currentUser.firstName}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium hover:bg-white/10"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/ingresar" className="rounded-full px-3 py-1.5 text-sm font-medium hover:bg-white/10">
                Ingresar
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand hover:bg-sand"
              >
                Registrarme
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl hover:bg-white/10 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="rounded-xl px-3 py-2 text-sm hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            {currentUser ? (
              <>
                <Link href="/cuenta/perfil" onClick={close} className="rounded-xl px-3 py-2 text-sm hover:bg-white/10">
                  Mi perfil
                </Link>
                <button type="button" onClick={handleLogout} className="rounded-xl px-3 py-2 text-left text-sm hover:bg-white/10">
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/ingresar" onClick={close} className="rounded-xl px-3 py-2 text-sm hover:bg-white/10">
                  Ingresar
                </Link>
                <Link href="/registro" onClick={close} className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-brand">
                  Registrarme
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
