import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-xl font-semibold">LookingProf</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
            Encontrá profesionales cerca tuyo, compará valoraciones y contactalos cuando estés listo.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Explorar</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/profesionales" className="hover:text-white">
                Profesionales
              </Link>
            </li>
            <li>
              <Link href="/registro" className="hover:text-white">
                Ofrecer un servicio
              </Link>
            </li>
            <li>
              <Link href="/soporte" className="hover:text-white">
                Soporte
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Legal</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>Términos y condiciones</li>
            <li>Política de privacidad</li>
            <li>Accesibilidad</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © 2026 LookingProf. Todos los derechos reservados.
      </div>
    </footer>
  );
}
