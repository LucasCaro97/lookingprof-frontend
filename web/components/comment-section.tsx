"use client";

import Link from "next/link";
import { useState } from "react";
import { createComment } from "@/lib/api";
import type { Comment } from "@/lib/types";
import { useAuth } from "./auth-provider";
import { StarRating } from "./star-rating";

export function CommentSection({
  professionalId,
  comments,
}: {
  professionalId: number;
  comments: Comment[];
}) {
  const { session } = useAuth();
  const [items, setItems] = useState(comments);
  const [description, setDescription] = useState("");
  const [qualification, setQualification] = useState(5);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    setSending(true);
    setError("");
    try {
      const created = await createComment(session.token, {
        description,
        qualification,
        userDestination: professionalId,
      });
      setItems((current) => [created, ...current]);
      setDescription("");
      setQualification(5);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo publicar el comentario");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-ink">Opiniones</h2>
        {session ? (
          <button type="button" className="btn-ghost" onClick={() => setOpen((value) => !value)}>
            {open ? "Cancelar" : "Dejar una opinión"}
          </button>
        ) : (
          <Link href="/ingresar" className="text-sm font-medium text-brand hover:underline">
            Ingresá para opinar
          </Link>
        )}
      </div>

      {open && session ? (
        <form onSubmit={submit} className="mt-5 space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
          <StarRating value={qualification} onChange={setQualification} />
          <label className="grid gap-1 text-sm font-medium text-ink">
            Comentario
            <textarea
              className="field min-h-28"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              minLength={4}
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="btn-primary" disabled={sending}>
            {sending ? "Publicando..." : "Publicar"}
          </button>
        </form>
      ) : null}

      <ul className="mt-6 space-y-4">
        {items.length === 0 ? (
          <li className="rounded-3xl bg-white p-6 text-sm text-muted">Aún no hay opiniones para este profesional.</li>
        ) : (
          items.map((comment, index) => (
            <li key={`${comment.userOrigin}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-ink">{comment.userOrigin}</p>
                <StarRating value={comment.qualification} size="sm" />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{comment.description}</p>
              {comment.createdAt ? (
                <p className="mt-2 text-xs text-muted">{comment.createdAt}</p>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
