import {
  IcBuilding,
  IcCalc,
  IcChart,
  IcKey,
  IcLayers,
  IcMap,
  IcShield,
  IcSpark,
  IcUsers,
} from "@/components/icons";
import type { ReactNode } from "react";

export type RailItem = {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  matchPrefix?: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
};

export const APP_RAIL_WIDTH = 56;

/**
 * Construye los ítems del rail según los addons habilitados para la cuenta.
 *
 * - **Cartografía / Insights / Calculadoras** son addons: aparecen `disabled`
 *   cuando la Subscription no los incluye, para que el cliente vea que existen.
 * - **Propiedades** es CORE y ya está operativo.
 * - **Mantenimiento** es un módulo CORE aún en construcción: se muestra
 *   `disabled` con la marca "· pronto" hasta que su fase lo habilite.
 *
 * El gating real de acceso vive en el server (route handlers + page server
 * components), no acá.
 */
export function buildRailItems(addons: {
  cartografia: boolean;
  insights: boolean;
  calculadoras: boolean;
}): RailItem[] {
  return [
    {
      id: "cartografia",
      label: addons.cartografia ? "Cartografía" : "Cartografía · addon",
      icon: <IcMap size={18} />,
      href: addons.cartografia ? "/cartografia" : undefined,
      matchPrefix: "/cartografia",
      disabled: !addons.cartografia,
    },
    {
      id: "propiedades",
      label: "Propiedades",
      icon: <IcBuilding size={18} />,
      href: "/propiedades",
      matchPrefix: "/propiedades",
    },
    {
      id: "rentas",
      label: "Rentas",
      icon: <IcKey size={18} />,
      href: "/rentas",
      matchPrefix: "/rentas",
    },
    {
      id: "clientes",
      label: "Clientes",
      icon: <IcUsers size={18} />,
      href: "/clientes",
      matchPrefix: "/clientes",
    },
    {
      id: "valuaciones",
      label: "Valuaciones",
      icon: <IcChart size={18} />,
      href: "/valuaciones",
      matchPrefix: "/valuaciones",
    },
    {
      id: "usuarios",
      label: "Usuarios",
      icon: <IcShield size={18} />,
      href: "/usuarios",
      matchPrefix: "/usuarios",
    },
    {
      id: "mantenimiento",
      label: "Mantenimiento · pronto",
      icon: <IcSpark size={18} />,
      disabled: true,
    },
    {
      id: "insights",
      label: addons.insights ? "Insights" : "Insights · addon",
      icon: <IcLayers size={18} />,
      disabled: !addons.insights,
    },
    {
      id: "calculadoras",
      label: addons.calculadoras ? "Calculadoras" : "Calculadoras · addon",
      icon: <IcCalc size={18} />,
      disabled: !addons.calculadoras,
    },
  ];
}
