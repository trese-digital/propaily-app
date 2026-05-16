import { Card, Skeleton, SkeletonRow } from "@/components/ui";

/**
 * Estado de carga genérico del portal. Next.js lo muestra mientras el Server
 * Component de la ruta resuelve sus queries. Cubre todas las rutas de
 * `(client)` salvo que una declare su propio `loading.tsx`.
 */
export default function ClientLoading() {
  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-6 px-8 py-7">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-2.5 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3 w-80" />
      </header>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex flex-col gap-2.5 p-4">
            <Skeleton className="h-2 w-20" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-2 w-24" />
          </Card>
        ))}
      </div>

      <Card className="flex flex-col gap-3.5 p-4">
        <Skeleton className="h-3 w-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </Card>
    </section>
  );
}
