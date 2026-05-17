/**
 * Helper para determinar el valor titular (principal) de una propiedad.
 *
 * Jerarquía establecida por el Bloque 1:
 * 1. Valor comercial (prioritario)
 * 2. Precio de compra (fallback)
 * 3. "Sin Valor Comercial" (si no hay ninguno de los anteriores)
 *
 * El valor fiscal NO debe usarse como valor titular — es información
 * secundaria que se muestra por separado en la sección de datos.
 */

export interface PropertyValueCents {
  commercialValueCents?: bigint | null;
  purchasePriceCents?: bigint | null;
  fiscalValueCents?: bigint | null;
}

export interface PropertyTitleValue {
  /** El valor en centavos a mostrar, null si no hay valor comercial */
  valueCents: bigint | null;
  /** true si no hay valor comercial ni precio de compra */
  noCommercialValue: boolean;
  /** Etiqueta descriptiva del origen del valor */
  sourceLabel: "comercial" | "precio de compra" | "sin valor comercial";
}

/**
 * Calcula el valor titular de una propiedad siguiendo la jerarquía comercial.
 */
export function getPropertyTitleValue(property: PropertyValueCents): PropertyTitleValue {
  // Prioridad 1: Valor comercial
  if (property.commercialValueCents != null) {
    return {
      valueCents: property.commercialValueCents,
      noCommercialValue: false,
      sourceLabel: "comercial",
    };
  }

  // Prioridad 2: Precio de compra
  if (property.purchasePriceCents != null) {
    return {
      valueCents: property.purchasePriceCents,
      noCommercialValue: false,
      sourceLabel: "precio de compra",
    };
  }

  // Sin valor comercial
  return {
    valueCents: null,
    noCommercialValue: true,
    sourceLabel: "sin valor comercial",
  };
}

/**
 * Formatea el valor titular para mostrar en UI.
 */
export function formatPropertyTitleValue(property: PropertyValueCents): string {
  const { valueCents, noCommercialValue } = getPropertyTitleValue(property);

  if (noCommercialValue) {
    return "Sin Valor Comercial";
  }

  if (valueCents == null) {
    return "—";
  }

  const pesos = Number(valueCents) / 100;
  if (pesos === 0) return "$0";

  const abs = Math.abs(pesos);
  if (abs >= 1_000_000) return `$${(pesos / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(pesos / 1_000).toFixed(0)}K`;

  return `$${pesos.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`;
}

/**
 * Formatea el valor titular en formato completo para detalles.
 */
export function formatPropertyTitleValueFull(property: PropertyValueCents): string {
  const { valueCents, noCommercialValue } = getPropertyTitleValue(property);

  if (noCommercialValue) {
    return "Sin Valor Comercial";
  }

  if (valueCents == null) {
    return "—";
  }

  const pesos = Number(valueCents) / 100;
  return pesos.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}