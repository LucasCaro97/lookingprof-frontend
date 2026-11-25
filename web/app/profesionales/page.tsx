import { Suspense } from "react";
import { FilterBar } from "@/components/filter-bar";
import { ProfessionalCard } from "@/components/professional-card";
import { firstQuery, searchProfessionals, toInt } from "@/lib/api";
import Link from "next/link";

export const metadata = {
  title: "Profesionales",
  description: "Buscá profesionales por oficio, provincia y ciudad.",
};

export default async function ProfesionalesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const professionId = toInt(firstQuery(params.professionId));
  const provinceId = toInt(firstQuery(params.provinceId));
  const cityId = toInt(firstQuery(params.cityId));
  const page = toInt(firstQuery(params.page)) ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Profesionales</h1>
        <p className="mt-3 text-slate-600">
          Filtrá por oficio y zona. Las fichas son públicas; el contacto se ve cuando estás logueado.
        </p>
      </div>
      <div className="mt-8">
        <FilterBar professionId={professionId} provinceId={provinceId} cityId={cityId} />
      </div>
      <Suspense fallback={<div className="mt-8 h-64 animate-pulse rounded-3xl bg-white" />}>
        <Results professionId={professionId} provinceId={provinceId} cityId={cityId} page={page} />
      </Suspense>
    </div>
  );
}

async function Results({
  professionId,
  provinceId,
  cityId,
  page,
}: {
  professionId?: number;
  provinceId?: number;
  cityId?: number;
  page: number;
}) {
  const data = await searchProfessionals({
    professionId,
    provinceId,
    cityId,
    page,
    size: 12,
  });

  if (data.content.length === 0) {
    return (
      <div className="mt-10 rounded-3xl bg-white p-10 text-center">
        <h2 className="text-2xl font-semibold text-brand">No hay resultados</h2>
        <p className="mt-2 text-slate-600">Probá con otros filtros o mirá el listado completo.</p>
      </div>
    );
  }

  const query = new URLSearchParams();
  if (professionId) query.set("professionId", String(professionId));
  if (provinceId) query.set("provinceId", String(provinceId));
  if (cityId) query.set("cityId", String(cityId));

  return (
    <div className="mt-8">
      <p className="mb-5 text-sm text-muted">{data.totalElements} profesionales disponibles</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.content.map((professional) => (
          <ProfessionalCard key={professional.idUser} professional={professional} />
        ))}
      </div>
      {data.totalPages > 1 ? (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: data.totalPages }, (_, index) => {
            const next = new URLSearchParams(query);
            if (index > 0) next.set("page", String(index));
            const href = next.toString() ? `/profesionales?${next}` : "/profesionales";
            return (
              <Link
                key={index}
                href={href}
                className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${
                  index === data.page ? "bg-brand text-white" : "bg-white text-ink"
                }`}
              >
                {index + 1}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
