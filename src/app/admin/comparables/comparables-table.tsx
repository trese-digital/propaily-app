"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Comparable } from "@prisma/client";

type ComparableWithColonia = Comparable & {
  // Aquí podrían ir JOINs futuros si necesitamos mostrar nombre de colonia
};

type FilterOptions = {
  colonias: {
    colonia_id: string;
    colonia_nombre: string;
    count: string;
  }[];
  tipos: string[];
};

type Props = {
  comparables: ComparableWithColonia[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: FilterOptions;
  searchParams: {
    colonia?: string;
    sector?: string;
    tipo?: string;
    page?: string;
  };
};

const formatCurrency = (cents: bigint) => {
  const mxn = Number(cents) / 100;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(mxn);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const TIPO_LABELS: Record<string, string> = {
  avaluo: "Avalúo",
  pagina_web: "Página Web",
  portal_inmobiliario: "Portal",
  valuacion_propaily: "Propaily",
  otro: "Otro",
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: "Casa",
  apartment: "Depto",
  land: "Terreno",
  commercial_space: "Comercial",
  office: "Oficina",
  warehouse: "Bodega",
  industrial: "Industrial",
  other: "Otro",
};

const LOCATION_STATUS_LABELS: Record<string, string> = {
  geolocalizado: "📍 Geo",
  colonia_manual: "📝 Manual",
  sin_ubicar: "❓ Sin ubicar",
};

export function ComparablesTable({
  comparables,
  pagination,
  filters,
  searchParams,
}: Props) {
  const router = useRouter();
  const currentParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(currentParams.toString());
    if (value === "" || value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.delete("page"); // Reset page when filtering
    router.push(`/admin/comparables?${newParams.toString()}` as any);
  };

  const goToPage = (page: number) => {
    const newParams = new URLSearchParams(currentParams.toString());
    newParams.set("page", page.toString());
    router.push(`/admin/comparables?${newParams.toString()}` as any);
  };

  return (
    <div>
      {/* Filtros */}
      <div className="p-4 border-b bg-gray-50 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-carbon mb-1">
              Colonia
            </label>
            <select
              value={searchParams.colonia ?? ""}
              onChange={(e) => updateFilter("colonia", e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todas las colonias</option>
              {filters.colonias.map((col) => (
                <option key={col.colonia_id} value={col.colonia_id}>
                  {col.colonia_nombre} ({col.count})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-carbon mb-1">
              Sector
            </label>
            <input
              type="number"
              value={searchParams.sector ?? ""}
              onChange={(e) => updateFilter("sector", e.target.value)}
              placeholder="Número de sector"
              className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-carbon mb-1">
              Tipo
            </label>
            <select
              value={searchParams.tipo ?? "all"}
              onChange={(e) => updateFilter("tipo", e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos los tipos</option>
              {filters.tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {TIPO_LABELS[tipo] ?? tipo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-carbon">Valor</th>
              <th className="px-4 py-3 text-left font-medium text-carbon">Fecha</th>
              <th className="px-4 py-3 text-left font-medium text-carbon">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-carbon">Inmueble</th>
              <th className="px-4 py-3 text-left font-medium text-carbon">Área</th>
              <th className="px-4 py-3 text-left font-medium text-carbon">Ubicación</th>
              <th className="px-4 py-3 text-left font-medium text-carbon">Fuente</th>
            </tr>
          </thead>
          <tbody>
            {comparables.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate">
                  No se encontraron comparables con los filtros actuales
                </td>
              </tr>
            ) : (
              comparables.map((comp) => (
                <tr key={comp.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(comp.valueCents)}
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {formatDate(comp.comparableDate)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {TIPO_LABELS[comp.tipo] ?? comp.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {PROPERTY_TYPE_LABELS[comp.propertyType] ?? comp.propertyType}
                  </td>
                  <td className="px-4 py-3 text-slate text-xs">
                    {comp.landAreaSqm || comp.builtAreaSqm ? (
                      <div>
                        {comp.landAreaSqm && (
                          <div>T: {Number(comp.landAreaSqm).toLocaleString()}m²</div>
                        )}
                        {comp.builtAreaSqm && (
                          <div>C: {Number(comp.builtAreaSqm).toLocaleString()}m²</div>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div>
                      <span title={comp.locationStatus}>
                        {LOCATION_STATUS_LABELS[comp.locationStatus] ?? comp.locationStatus}
                      </span>
                      {comp.sectorNumber && (
                        <div className="text-slate">S{comp.sectorNumber}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">
                    <div className="max-w-24 truncate" title={comp.source ?? "—"}>
                      {comp.source ?? "—"}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-slate">
            Página {pagination.page} de {pagination.totalPages} • {pagination.total} total
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Anterior
            </button>

            {/* Páginas numéricas - mostrar hasta 5 */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, pagination.page - 2) + i;
              if (pageNum > pagination.totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    pageNum === pagination.page
                      ? "bg-purple-600 text-white border-purple-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}