"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-3xl font-semibold text-ink">Algo salió mal</h1>
      <p className="mt-3 text-slate-600">Probá recargar la página. Si el API no está levantado, iniciá el backend en el puerto 8080.</p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        Reintentar
      </button>
    </div>
  );
}
