import { notFound } from "next/navigation";
import { CommentSection } from "@/components/comment-section";
import { ContactPanel } from "@/components/contact-panel";
import { Avatar } from "@/components/avatar";
import { IconMapPin } from "@/components/icons";
import { StarRating } from "@/components/star-rating";
import { ApiError, getComments, getProfessional } from "@/lib/api";
import type { Metadata } from "next";

type ProfessionalParams = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: ProfessionalParams): Promise<Metadata> {
  const { id } = await params;
  try {
    const professional = await getProfessional(Number(id));
    const name = `${professional.firstName} ${professional.lastName}`.trim();
    const oficio = professional.profession?.nameProfession;
    return {
      title: name,
      description: oficio
        ? `${name} · ${oficio} en ${professional.city?.nameCity ?? "Argentina"}`
        : `Perfil de ${name} en LookingProf`,
    };
  } catch {
    return { title: "Profesional" };
  }
}

export default async function ProfessionalPage({
  params,
}: ProfessionalParams) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  let professional;
  try {
    professional = await getProfessional(numericId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const comments = await getComments(numericId);
  const name = `${professional.firstName} ${professional.lastName}`.trim();
  const place = [professional.city?.nameCity, professional.province?.nameProvince]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-10">
          <div className="flex items-start gap-5">
            <Avatar name={name} image={professional.imageUrl} size="xl" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                {professional.profession?.nameProfession ?? "Profesional"}
              </p>
              <h1 className="mt-1 text-4xl font-semibold tracking-tight text-ink">{name}</h1>
              {place ? (
                <p className="mt-3 flex items-center gap-1 text-slate-600">
                  <IconMapPin className="h-4 w-4" />
                  {place}
                </p>
              ) : null}
              <div className="mt-3">
                <StarRating value={professional.qualification ?? 0} />
              </div>
            </div>
          </div>
          <h2 className="mt-10 text-lg font-semibold text-ink">Acerca de</h2>
          <p className="mt-3 leading-7 text-slate-600">
            {professional.description || "Este profesional todavía no cargó una descripción."}
          </p>
        </section>

        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">Contacto</h2>
          <p className="mt-1 mb-5 text-sm text-muted">
            El teléfono y el mail no se muestran de forma pública.
          </p>
          <ContactPanel professionalId={numericId} firstName={professional.firstName} />
        </aside>
      </div>

      <CommentSection professionalId={numericId} comments={comments} />
    </div>
  );
}
