"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCities, getProfessions, getProvinces } from "@/lib/api";
import type { City, Profession, Province } from "@/lib/types";

type FilterBarProps = {
  professionId?: number;
  provinceId?: number;
  cityId?: number;
};

export function FilterBar({ professionId, provinceId, cityId }: FilterBarProps) {
  const router = useRouter();
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProfession, setSelectedProfession] = useState(professionId ? String(professionId) : "");
  const [selectedProvince, setSelectedProvince] = useState(provinceId ? String(provinceId) : "");
  const [selectedCity, setSelectedCity] = useState(cityId ? String(cityId) : "");

  useEffect(() => {
    setSelectedProfession(professionId ? String(professionId) : "");
    setSelectedProvince(provinceId ? String(provinceId) : "");
    setSelectedCity(cityId ? String(cityId) : "");
  }, [professionId, provinceId, cityId]);

  useEffect(() => {
    Promise.all([getProfessions(), getProvinces(), getCities()]).then(
      ([nextProfessions, nextProvinces, nextCities]) => {
        setProfessions(nextProfessions);
        setProvinces(nextProvinces);
        setCities(nextCities);
      },
    );
  }, []);

  const filteredCities = useMemo(() => {
    if (!selectedProvince) return [];
    return cities.filter((city) => city.idProvince === Number(selectedProvince));
  }, [cities, selectedProvince]);

  const apply = (profession: string, province: string, city: string) => {
    const params = new URLSearchParams();
    if (profession) params.set("professionId", profession);
    if (province) params.set("provinceId", province);
    if (city) params.set("cityId", city);
    const query = params.toString();
    router.push(query ? `/profesionales?${query}` : "/profesionales");
  };

  return (
    <form
      className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4"
      onSubmit={(event) => {
        event.preventDefault();
        apply(selectedProfession, selectedProvince, selectedCity);
      }}
    >
      <label className="grid gap-1 text-sm font-medium text-ink">
        Oficio
        <select
          className="field"
          value={selectedProfession}
          onChange={(event) => setSelectedProfession(event.target.value)}
        >
          <option value="">Todos</option>
          {professions.map((profession) => (
            <option key={profession.idProfession} value={profession.idProfession}>
              {profession.nameProfession}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium text-ink">
        Provincia
        <select
          className="field"
          value={selectedProvince}
          onChange={(event) => {
            setSelectedProvince(event.target.value);
            setSelectedCity("");
          }}
        >
          <option value="">Todas</option>
          {provinces.map((province) => (
            <option key={province.idProvince} value={province.idProvince}>
              {province.nameProvince}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium text-ink">
        Ciudad
        <select
          className="field"
          value={selectedCity}
          onChange={(event) => setSelectedCity(event.target.value)}
          disabled={!selectedProvince}
        >
          <option value="">Todas</option>
          {filteredCities.map((city) => (
            <option key={city.idCity} value={city.idCity}>
              {city.nameCity}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-end gap-2">
        <button type="submit" className="btn-primary flex-1">
          Filtrar
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setSelectedProfession("");
            setSelectedProvince("");
            setSelectedCity("");
            router.push("/profesionales");
          }}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
