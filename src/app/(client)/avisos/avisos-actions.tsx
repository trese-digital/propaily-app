"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui";
import {
  marcarAvisoLeido,
  marcarTodosLeidos,
} from "@/server/notifications/actions";

export function MarkAllRead() {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="secondary"
      size="md"
      disabled={pending}
      onClick={() => startTransition(() => void marcarTodosLeidos())}
    >
      {pending ? "Marcando…" : "Marcar todo como leído"}
    </Button>
  );
}

export function MarkOneRead({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => void marcarAvisoLeido(id))}
      className="cursor-pointer text-[12px] font-medium text-ink-500 transition-colors hover:text-ink-800 disabled:opacity-50"
    >
      {pending ? "…" : "Marcar leído"}
    </button>
  );
}
