"use client";

import { useEffect, useMemo, useState } from "react";
import { getCities, getProvinces } from "@/lib/api";
import type { City, Province } from "@/lib/types";

type LocationFieldsProps = {
  provinceId: string;
  cityId: string;
  onChange: (provinceId: string, cityId: string) => void;
  error?: string;
};

export function LocationFields({ provinceId, cityId, onChange, error }: LocationFieldsProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    Promise.all([getProvinces(), getCities()]).then(([nextProvinces, nextCities]) => {
      setProvinces(nextProvinces);
      setCities(nextCities);
    });
  }, []);

  const filteredCities = useMemo(
    () => cities.filter((city) => city.idProvince === Number(provinceId)),
    [cities, provinceId],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1 text-sm font-medium text-ink">
        Provincia
        <select
          className="field"
          value={provinceId}
          onChange={(event) => onChange(event.target.value, "")}
          required
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
        <select
          className="field"
          value={cityId}
          onChange={(event) => onChange(provinceId, event.target.value)}
          disabled={!provinceId}
          required
        >
          <option value="">Elegí una ciudad</option>
          {filteredCities.map((city) => (
            <option key={city.idCity} value={city.idCity}>
              {city.nameCity}
            </option>
          ))}
        </select>
      </label>
      {error ? <p className="sm:col-span-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
