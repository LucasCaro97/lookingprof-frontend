"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./auth-provider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !session) router.replace("/ingresar");
  }, [ready, session, router]);

  if (!ready) {
    return <div className="mx-auto h-80 max-w-3xl animate-pulse rounded-3xl bg-white" />;
  }
  if (!session) return null;
  return children;
}
