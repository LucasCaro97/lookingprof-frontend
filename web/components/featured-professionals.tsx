import { searchProfessionals } from "@/lib/api";
import { ProfessionalCard } from "./professional-card";

export async function FeaturedProfessionals() {
  const page = await searchProfessionals({ size: 6, page: 0 });

  if (page.content.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-600">
        Todavía no hay profesionales publicados, o el API no está levantado en{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">localhost:8080</code>.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {page.content.map((professional) => (
        <ProfessionalCard key={professional.idUser} professional={professional} />
      ))}
    </div>
  );
}
