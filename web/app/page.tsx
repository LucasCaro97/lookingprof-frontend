import { Suspense } from "react";
import Link from "next/link";
import { FeaturedProfessionals } from "@/components/featured-professionals";
import { HomeSearch } from "@/components/home-search";
import { IconCheck, IconMapPin, IconStar } from "@/components/icons";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#0a6a96,_transparent_42%),radial-gradient(circle_at_bottom_left,_#f3e4c8,_transparent_40%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Profesionales cerca tuyo
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Encontrá al profesional indicado, sin dar tantas vueltas.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              LookingProf te ayuda a descubrir oficios en tu ciudad, comparar valoraciones
              y contactar cuando estés listo. Simple, local y pensado para Argentina.
            </p>
            <HomeSearch />
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <IconStar className="h-4 w-4 text-accent" /> Valoraciones reales
              </span>
              <span className="inline-flex items-center gap-2">
                <IconMapPin className="h-4 w-4 text-brand" /> Por provincia y ciudad
              </span>
              <span className="inline-flex items-center gap-2">
                <IconCheck className="h-4 w-4 text-brand" /> Contacto cuando te registrás
              </span>
            </div>
          </div>
          <HeroPanel />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-ink">Profesionales destacados</h2>
            <p className="mt-2 text-slate-600">Los mejor valorados del momento.</p>
          </div>
          <Link href="/profesionales" className="hidden text-sm font-semibold text-brand hover:underline sm:block">
            Ver todos
          </Link>
        </div>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-white" />}>
          <FeaturedProfessionals />
        </Suspense>
      </section>
    </div>
  );
}

function HeroPanel() {
  const cards = [
    { title: "Nutricionista", place: "Posadas, Misiones" },
    { title: "Plomero", place: "Córdoba capital" },
    { title: "Electricista", place: "CABA" },
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-brand/10 blur-2xl" />
      <div className="relative space-y-4 rounded-[2rem] bg-brand p-6 text-white shadow-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-white/60">Búsqueda local</p>
        <h2 className="text-2xl font-semibold">Del oficio a la ficha, en un clic.</h2>
        <div className="space-y-3">
          {cards.map((card) => (
            <div key={card.title} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="font-medium">{card.title}</p>
              <p className="text-sm text-white/70">{card.place}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
