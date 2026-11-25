import Link from "next/link";
import type { Professional } from "@/lib/types";
import { Avatar } from "./avatar";
import { IconMapPin } from "./icons";
import { StarRating } from "./star-rating";

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const name = `${professional.firstName} ${professional.lastName}`.trim();
  const place = [professional.city?.nameCity, professional.province?.nameProvince]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <Avatar name={name} image={professional.imageUrl} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-ink">{name}</h3>
          <p className="text-sm font-medium text-brand">
            {professional.profession?.nameProfession ?? "Profesional"}
          </p>
          {place ? (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted">
              <IconMapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{place}</span>
            </p>
          ) : null}
        </div>
      </div>
      {professional.description ? (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {professional.description}
        </p>
      ) : (
        <p className="mt-4 text-sm italic text-slate-400">Todavía no cargó una descripción.</p>
      )}
      <div className="mt-5 flex items-center justify-between">
        <StarRating value={professional.qualification ?? 0} size="sm" />
        <Link
          href={`/profesional/${professional.idUser}`}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}
