import { Suspense } from "react";
import { redirect } from "next/navigation";

import { requireContext } from "@/server/auth/context";
import { isGfStaff } from "@/server/auth/is-gf-staff";
import { dbBypass } from "@/server/db/scoped";

import { ComparablesTable } from "./comparables-table";
import { ComparableForm } from "./comparable-form";
import { CsvUploadForm } from "./csv-upload-form";

export const metadata = {
  title: "Comparables de Mercado | Admin",
};

type SearchParams = Promise<{
  colonia?: string;
  sector?: string;
  tipo?: string;
  page?: string;
}>;

type Props = {
  searchParams: SearchParams;
};

async function getComparables(params: {
  coloniaId?: string;
  sector?: string;
  tipo?: string;
  page: number;
}) {
  const pageSize = 20;
  const skip = (params.page - 1) * pageSize;

  const where: any = {
    deletedAt: null,
  };

  if (params.coloniaId) {
    where.coloniaId = params.coloniaId;
  }
  if (params.sector) {
    where.sectorNumber = parseInt(params.sector, 10);
  }
  if (params.tipo && params.tipo !== "all") {
    where.tipo = params.tipo;
  }

  const [comparables, total] = await Promise.all([
    dbBypass.comparable.findMany({
      where,
      orderBy: [
        { comparableDate: "desc" },
        { createdAt: "desc" },
      ],
      skip,
      take: pageSize,
    }),
    dbBypass.comparable.count({ where }),
  ]);

  return {
    comparables,
    pagination: {
      total,
      page: params.page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

async function getFilterOptions() {
  // Obtener colonias que tienen comparables
  const coloniasWithComparables = await dbBypass.$queryRaw<{
    colonia_id: string;
    colonia_nombre: string;
    count: string;
  }[]>`
    SELECT DISTINCT
      c."coloniaId" as colonia_id,
      col.nombre as colonia_nombre,
      COUNT(*) as count
    FROM propaily."Comparable" c
    LEFT JOIN public.colonias col ON col.id::text = c."coloniaId"
    WHERE c."deletedAt" IS NULL AND c."coloniaId" IS NOT NULL
    GROUP BY c."coloniaId", col.nombre
    ORDER BY col.nombre
  `;

  // Obtener tipos usados
  const tipos = await dbBypass.comparable.findMany({
    where: { deletedAt: null },
    select: { tipo: true },
    distinct: ["tipo"],
    orderBy: { tipo: "asc" },
  });

  return {
    colonias: coloniasWithComparables,
    tipos: tipos.map(t => t.tipo),
  };
}

export default async function ComparablesPage({ searchParams }: Props) {
  const ctx = await requireContext();
  if (!(await isGfStaff(ctx.user.id))) {
    redirect("/dashboard" as any);
  }

  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);

  const [data, filters] = await Promise.all([
    getComparables({
      coloniaId: params.colonia,
      sector: params.sector,
      tipo: params.tipo,
      page,
    }),
    getFilterOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-carbon">
            Comparables de Mercado
          </h1>
          <p className="text-sm text-slate mt-1">
            Gestión de inteligencia inmobiliaria para análisis de mercado
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de alta individual */}
        <div className="lg:col-span-1">
          <div className="bg-surface border rounded-lg p-4 space-y-4">
            <h2 className="font-medium text-carbon">Alta Individual</h2>
            <Suspense fallback={<div className="text-sm text-slate">Cargando...</div>}>
              <ComparableForm />
            </Suspense>
          </div>

          {/* Upload CSV */}
          <div className="bg-surface border rounded-lg p-4 space-y-4 mt-4">
            <h2 className="font-medium text-carbon">Carga Masiva CSV</h2>
            <CsvUploadForm />
          </div>
        </div>

        {/* Listado */}
        <div className="lg:col-span-2">
          <div className="bg-surface border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="font-medium text-carbon">
                Comparables Registrados
              </h2>
              <p className="text-xs text-slate mt-1">
                Total: {data.pagination.total} comparables
              </p>
            </div>

            <Suspense
              fallback={
                <div className="p-4 text-sm text-slate">Cargando comparables...</div>
              }
            >
              <ComparablesTable
                comparables={data.comparables}
                pagination={data.pagination}
                filters={filters}
                searchParams={params}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}