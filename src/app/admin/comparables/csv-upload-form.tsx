"use client";

import React, { useState } from "react";
import { uploadComparablesCsv, type CsvUploadResult } from "@/server/comparables/admin-actions";

export function CsvUploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<CsvUploadResult | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const file = formData.get("csvFile") as File;

    if (!file || file.size === 0) {
      setResult({ error: "Selecciona un archivo CSV" });
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setResult({ error: "El archivo debe tener extensión .csv" });
      return;
    }

    setIsUploading(true);
    setResult(null);

    try {
      const csvContent = await file.text();
      const uploadResult = await uploadComparablesCsv(csvContent);
      setResult(uploadResult);

      if (uploadResult.ok) {
        (event.target as HTMLFormElement).reset();
      }
    } catch (error) {
      setResult({ error: `Error al procesar archivo: ${error}` });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'valor', 'fecha', 'tipo', 'tipo_inmueble', 'm2_terreno', 'm2_construccion',
      'antiguedad_anios', 'uso_suelo', 'latitud', 'longitud', 'direccion', 'fuente', 'notas'
    ];

    const sampleRow = [
      '2500000', '2024-01-15', 'avaluo', 'house', '250', '180',
      '5', 'Habitacional', '21.1234567', '-101.6789012', 'Calle Ejemplo 123, León', 'Banco Nacional', 'Avalúo comercial'
    ];

    const csvContent = [
      headers.join(','),
      sampleRow.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla-comparables.csv';
    link.click();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-carbon mb-1">
            Archivo CSV
          </label>
          <input
            type="file"
            name="csvFile"
            accept=".csv"
            required
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ borderColor: 'rgba(7,11,31,0.2)' }}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {isUploading ? "Procesando..." : "Subir CSV"}
          </button>

          <button
            type="button"
            onClick={downloadTemplate}
            className="px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
          >
            📋 Plantilla
          </button>
        </div>
      </form>

      {/* Formato esperado */}
      <div className="text-xs text-slate">
        <p className="font-medium text-carbon mb-1">Formato CSV esperado:</p>
        <div className="bg-gray-50 p-2 rounded border font-mono text-[10px] overflow-x-auto">
          <div>valor,fecha,tipo,tipo_inmueble,m2_terreno,m2_construccion,</div>
          <div>antiguedad_anios,uso_suelo,latitud,longitud,direccion,fuente,notas</div>
        </div>
        <ul className="mt-2 space-y-1">
          <li>• <strong>tipo:</strong> avaluo | pagina_web | portal_inmobiliario | valuacion_propaily | otro</li>
          <li>• <strong>tipo_inmueble:</strong> house | apartment | land | commercial_space | office | warehouse | industrial | other</li>
          <li>• <strong>fecha:</strong> formato YYYY-MM-DD</li>
          <li>• <strong>valor:</strong> en pesos mexicanos sin comas</li>
        </ul>
      </div>

      {/* Resultados */}
      {result?.error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-700 font-medium">Error:</p>
          <p className="text-sm text-red-700">{result.error}</p>
          {result.errors && (
            <div className="mt-2">
              <p className="text-xs text-red-600 font-medium">Errores específicos:</p>
              <ul className="text-xs text-red-600 mt-1 space-y-1">
                {result.errors.map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {result?.ok && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm text-green-700">
            ✅ Procesamiento completado: <strong>{result.created}</strong> comparables creados
          </p>
          {result.errors && result.errors.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-yellow-700 font-medium">
                Advertencias ({result.errors.length} filas con errores):
              </p>
              <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                {result.errors.map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}