"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfessions } from "@/lib/api";
import type { Profession } from "@/lib/types";
import { IconSearch } from "./icons";

export function HomeSearch() {
  const router = useRouter();
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [professionId, setProfessionId] = useState("");

  useEffect(() => {
    getProfessions().then(setProfessions);
  }, []);

  return (
    <form
      className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        const query = professionId ? `?professionId=${professionId}` : "";
        router.push(`/profesionales${query}`);
      }}
    >
      <label className="sr-only" htmlFor="home-profession">
        Oficio
      </label>
      <select
        id="home-profession"
        className="field flex-1 bg-white"
        value={professionId}
        onChange={(event) => setProfessionId(event.target.value)}
      >
        <option value="">Todos los oficios</option>
        {professions.map((profession) => (
          <option key={profession.idProfession} value={profession.idProfession}>
            {profession.nameProfession}
          </option>
        ))}
      </select>
      <button type="submit" className="btn-primary inline-flex items-center justify-center gap-2">
        <IconSearch className="h-4 w-4" />
        Buscar
      </button>
    </form>
  );
}
