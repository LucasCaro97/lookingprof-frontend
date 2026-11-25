"use client";

import { useEffect, useMemo, useState } from "react";
import { getCities, getProfessions, getProvinces, getProfessional, updateProfile } from "@/lib/api";
import type { City, Profession, Province, UserProfile } from "@/lib/types";
import { useAuth } from "./auth-provider";
import { Avatar } from "./avatar";

export function ProfileForm() {
  const { session, ready } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [professionId, setProfessionId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const preview = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session) return;
    Promise.all([
      getProfessional(session.id, session.token),
      getProfessions(),
      getProvinces(),
      getCities(),
    ])
      .then(([nextProfile, nextProfessions, nextProvinces, nextCities]) => {
        const user = nextProfile as UserProfile;
        setProfile(user);
        setPhone(user.phone ?? "");
        setDescription(user.description ?? "");
        setProvinceId(user.province ? String(user.province.idProvince) : "");
        setCityId(user.city ? String(user.city.idCity) : "");
        setProfessionId(user.profession ? String(user.profession.idProfession) : "");
        setProfessions(nextProfessions);
        setProvinces(nextProvinces);
        setCities(nextCities);
      })
      .catch(() => setError("No pudimos cargar tu perfil."));
  }, [session]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const filteredCities = useMemo(
    () => cities.filter((city) => city.idProvince === Number(provinceId)),
    [cities, provinceId],
  );

  if (!ready) return <div className="h-80 animate-pulse rounded-3xl bg-white" />;
  if (!session) return null;
  if (!profile && !error) return <div className="h-80 animate-pulse rounded-3xl bg-white" />;

  const isProfessional = session.role === "PROFESSIONAL" || session.role === "ADMIN";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setStatus("");
    try {
      await updateProfile(session.id, session.token, {
        phone,
        description,
        province: provinceId ? Number(provinceId) : undefined,
        city: cityId ? Number(cityId) : undefined,
        profession: professionId ? Number(professionId) : undefined,
        image,
      });
      setStatus("Perfil actualizado.");
      setImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-4">
        <Avatar
          name={`${session.firstName} ${session.lastName}`}
          image={preview ?? profile?.imageUrl}
          size="lg"
        />
        <div>
          <h1 className="text-2xl font-semibold text-ink">
            {session.firstName} {session.lastName}
          </h1>
          <p className="text-sm text-muted">{session.email}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-brand">{session.role ?? "USER"}</p>
        </div>
      </div>

      <label className="grid gap-1 text-sm font-medium text-ink">
        Foto de perfil
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          className="text-sm"
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-ink">
        Teléfono
        <input className="field" value={phone} onChange={(event) => setPhone(event.target.value)} />
      </label>

      {isProfessional ? (
        <label className="grid gap-1 text-sm font-medium text-ink">
          Oficio
          <select className="field" value={professionId} onChange={(event) => setProfessionId(event.target.value)}>
            <option value="">Elegí un oficio</option>
            {professions.map((profession) => (
              <option key={profession.idProfession} value={profession.idProfession}>
                {profession.nameProfession}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-ink">
          Provincia
          <select
            className="field"
            value={provinceId}
            onChange={(event) => {
              setProvinceId(event.target.value);
              setCityId("");
            }}
          >
            <option value="">Elegí una provincia</option>
            {provinces.map((province) => (
              <option key={province.idProvince} value={province.idProvince}>
                {province.nameProvince}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-ink">
          Ciudad
          <select className="field" value={cityId} onChange={(event) => setCityId(event.target.value)} disabled={!provinceId}>
            <option value="">Elegí una ciudad</option>
            {filteredCities.map((city) => (
              <option key={city.idCity} value={city.idCity}>
                {city.nameCity}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-1 text-sm font-medium text-ink">
        Acerca de vos
        <textarea
          className="field min-h-32"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {status ? <p className="text-sm text-emerald-700">{status}</p> : null}

      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
