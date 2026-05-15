/**
 * Portafolio Demo — dataset canónico de la PWA mobile.
 *
 * Fuente única de verdad para las 21 pantallas (Fase 1). El script
 * `scripts/demo-portfolio.ts` siembra exactamente estos datos en la DB bajo el
 * tag `DEMO_TAG`, de modo que la Fase 2 pueda cambiar a queries Prisma sin que
 * cambie lo que ve el usuario. Todo aquí es ficticio y borrable.
 */

/** Tag que marca las filas del Portafolio Demo en la DB (para poder borrarlas). */
export const DEMO_TAG = "PORTAFOLIO_DEMO";

export type Role = "owner" | "tenant" | "admin";

export type DemoUser = {
  name: string;
  email: string;
  account: string;
};

/** Cuenta demo + los 3 roles disponibles (para el selector y el switch). */
export const demoUser: DemoUser = {
  name: "Pablo Mendoza",
  email: "pablo@gfc.mx",
  account: "Familia Mendoza",
};

export const roles: {
  id: Role;
  name: string;
  desc: string;
  detail: string;
  tone: "violet" | "ok" | "warn";
}[] = [
  {
    id: "owner",
    name: "Propietario",
    desc: "Ve tu patrimonio y aprueba decisiones",
    detail: "Familia Mendoza · 4 propiedades",
    tone: "violet",
  },
  {
    id: "tenant",
    name: "Inquilino",
    desc: "Paga, reporta problemas, consulta tu contrato",
    detail: "Sofía M. · Casa Polanco 412",
    tone: "ok",
  },
  {
    id: "admin",
    name: "Operador GFC",
    desc: "Cobranza, mantenimiento y administración",
    detail: "Acceso administrador · 87 propiedades",
    tone: "warn",
  },
];

/* ───────────────────────── Propietario ─────────────────────── */

export const portfolio = {
  patrimonio: "$62.7M",
  patrimonioDelta: "+4.2% trimestre",
  rentaMes: "$58K",
  rentaMesNota: "3 de 4 cobrados",
};

export type PropertyStatus = "Rentada" | "Borrador" | "En revisión";

export type DemoProperty = {
  id: string;
  name: string;
  colony: string;
  value: string;
  status: PropertyStatus;
  statusTone: "ok" | "neutral" | "warn";
  area: string;
  rentMonth: string;
};

export const properties: DemoProperty[] = [
  {
    id: "casa-polanco-412",
    name: "Casa Polanco 412",
    colony: "Polanco V · CDMX",
    value: "$8.4M",
    status: "Rentada",
    statusTone: "ok",
    area: "218 m²",
    rentMonth: "$38K",
  },
  {
    id: "loft-condesa",
    name: "Loft Condesa",
    colony: "Condesa · CDMX",
    value: "$3.2M",
    status: "Borrador",
    statusTone: "neutral",
    area: "92 m²",
    rentMonth: "$19.5K",
  },
  {
    id: "edificio-roma-88",
    name: "Edificio Roma 88 · A-302",
    colony: "Roma Nte · CDMX",
    value: "$48.0M",
    status: "Rentada",
    statusTone: "ok",
    area: "1,420 m²",
    rentMonth: "$24.5K",
  },
  {
    id: "local-del-valle-12",
    name: "Local Del Valle 12",
    colony: "Del Valle · CDMX",
    value: "$6.1M",
    status: "En revisión",
    statusTone: "warn",
    area: "180 m²",
    rentMonth: "$32K",
  },
];

export type UpcomingPayment = {
  tenant: string;
  property: string;
  amount: string;
  date: string;
  status: "pendiente" | "pagado" | "vencido";
  tone: "violet" | "ok" | "bad";
};

export const upcomingPayments: UpcomingPayment[] = [
  {
    tenant: "Sofía Mendoza",
    property: "Casa Polanco 412",
    amount: "$38,000",
    date: "01 jun",
    status: "pendiente",
    tone: "violet",
  },
  {
    tenant: "Daniel Reyes",
    property: "Roma 88 · A-302",
    amount: "$24,500",
    date: "15 may",
    status: "pagado",
    tone: "ok",
  },
  {
    tenant: "Carlos y Mariana",
    property: "Loft Condesa",
    amount: "$19,500",
    date: "01 may",
    status: "vencido",
    tone: "bad",
  },
];

/* ───────────────────── Aprobaciones (owner) ────────────────── */

export type Approval = {
  id: string;
  kind: "renovacion" | "avaluo" | "mantenimiento";
  tag: string;
  tone: "violet" | "warn" | "info";
  title: string;
  detail: string;
  actor: string;
};

export const approvals: Approval[] = [
  {
    id: "renovacion-sofia",
    kind: "renovacion",
    tag: "Renovación",
    tone: "violet",
    title: "Renovación · Sofía Mendoza",
    detail: "Casa Polanco 412 · inquilina desde jun 2024",
    actor: "Sofía Mendoza",
  },
  {
    id: "avaluo-bbva",
    kind: "avaluo",
    tag: "Avalúo",
    tone: "warn",
    title: "Avalúo BBVA · Casa Polanco 412",
    detail: "Vence en 17 días · costo $4,800",
    actor: "BBVA Avalúos",
  },
  {
    id: "cotizacion-hidroplom",
    kind: "mantenimiento",
    tag: "Mantenimiento",
    tone: "info",
    title: "Cotización Hidroplom MX",
    detail: "Loft Condesa · fuga de tubería · $6,200",
    actor: "Carlos Reyes",
  },
];

/** Detalle de la propuesta de renovación (pantalla 11). */
export const renewalDetail = {
  id: "renovacion-sofia",
  tenant: "Sofía Mendoza",
  property: "Casa Polanco 412",
  term: "12 meses · jun 2026 → may 2027",
  expiresIn: "17 días",
  currentRent: "$38,000",
  currentSince: "desde jun 2024",
  proposedRent: "$40,500",
  proposedDelta: "+6.6% · INPC + 1.2pp",
  terms: [
    ["Depósito en garantía", "$40,500", "Igual a renta"],
    ["Plazo", "12 meses", "jun 26 → may 27"],
    ["Incremento mid-term", "INPC anual", "Cláusula 7"],
    ["Penalidad pago tardío", "5% / mes", "Sin cambio"],
  ] as const,
  tenantNote:
    "Pablo, gracias por estos dos años. Me encantaría quedarme. Solo te pediría considerar mantener la renta — he sido puntual y mantengo la casa impecable.",
  noteAge: "recibido vía Propaily · hace 2 días",
  docs: [
    ["Contrato renovación 2026 (borrador)", "4 pp · PDF"],
    ["Histórico de pagos", "24/24 puntuales · CSV"],
    ["Inspección visual mar-2026", "8 fotos"],
  ] as const,
};

/* ───────────────────── Detalle de propiedad ────────────────── */

export const propertyDetail = {
  id: "casa-polanco-412",
  name: "Casa Polanco 412",
  colony: "Polanco V Sección · CDMX",
  status: "Activa · rentada",
  value: "$8.4M",
  rentMonth: "$38K",
  area: "218m²",
  catastro: {
    lote: "04-12-178-3 · Polanco V",
    fiscal: "$5.18M",
    comercialM2: "$182K",
  },
  tenant: {
    name: "Sofía Mendoza",
    since: "Desde jun 2024 · $38,000/mes",
    contractWarning: "Contrato vence en 17 días",
  },
};

/* ───────────────────────── Inquilino ───────────────────────── */

export const tenantPayment = {
  amount: "$38,000",
  currency: "MXN",
  property: "Casa Polanco 412",
  dueLabel: "Vence en 17 días",
  dueDate: "Lunes 1 de junio · día de pago",
  dueMonth: "JUN",
  dueDay: "01",
  spei: [
    { label: "Banco", value: "BBVA México" },
    { label: "Cuenta CLABE", value: "012 180 0123 4567 8901", mono: true },
    { label: "Beneficiario", value: "Familia Mendoza" },
    { label: "Referencia", value: "POL412-001", mono: true, accent: true },
    { label: "Concepto", value: "Renta junio 2026" },
  ],
  history: [
    ["May 2026", "$38,000", "01 may", "pagado"],
    ["Abr 2026", "$38,000", "02 abr", "pagado-tarde"],
    ["Mar 2026", "$38,000", "01 mar", "pagado"],
  ] as const,
};

export const receipt = {
  folio: "PP-2026-014823",
  amount: "$38,000.00 MXN",
  concept: "Renta mayo 2026",
  reference: "POL412-001",
  paidAt: "14 may 2026 · 11:42",
  eta: "ETA 24 hrs",
  nextPayment: ["Tu siguiente pago: 1 jun 2026", "$38,000 · en 18 días"] as const,
};

export const maintenanceCategories = [
  ["Plomería", "🚿"],
  ["Eléctrico", "⚡"],
  ["Pintura", "🎨"],
  ["Cerrajería", "🔑"],
  ["Limpieza", "🧹"],
  ["Jardín", "🌿"],
  ["Estruct.", "🏗️"],
  ["Otro", "…"],
] as const;

/* ─────────────────────────── Admin ─────────────────────────── */

export const adminToday = {
  operator: "Marcela Ortiz",
  dateLabel: "Hoy · jueves 14 may",
  summary: "12 tareas · 4 visitas",
  chips: [
    { label: "3 cobros", urgent: false },
    { label: "5 manten.", urgent: false },
    { label: "2 urgentes", urgent: true },
  ],
  route: {
    distance: "32 km · 2h 14min",
    firstStop: {
      title: "Casa Polanco 412 · 10:30",
      detail: "Cobro · Sofía M. · $38,000",
    },
  },
  urgent: [
    {
      tone: "bad" as const,
      title: "Renta vencida · Loft Condesa",
      detail: "Carlos · 14 días · $19,500",
      cta: "Llamar",
    },
    {
      tone: "warn" as const,
      title: "Fuga reportada · Roma 88",
      detail: "M-214 · sin asignar · 3h",
      cta: "Asignar",
    },
  ],
};

export const collections = {
  monthLabel: "May 2026 · 24 rentas · $584,500",
  collectedPct: 78,
  collectedLabel: "$455,500 · 78%",
  overdue: [
    {
      name: "Carlos y Mariana",
      property: "Loft Condesa",
      amount: "$19,500",
      days: 14,
      tone: "bad" as const,
      tel: "55 2188 4421",
    },
    {
      name: "Roberto Vega",
      property: "Local Del Valle 12",
      amount: "$32,000",
      days: 7,
      tone: "warn" as const,
      tel: "55 4119 2030",
    },
    {
      name: "Mariana López",
      property: "Casa Coyoacán 88",
      amount: "$26,000",
      days: 3,
      tone: "warn" as const,
      tel: "55 8920 1140",
    },
  ],
};

/* ───────────────────── Avisos (compartido) ─────────────────── */

import type { NotifItem } from "@/components/mobile/notif";

export const notificationsToday: NotifItem[] = [
  {
    id: "n-overdue-1",
    type: "overdue",
    t: "Renta vencida",
    body: "Carlos y Mariana · Loft Condesa · $19,500",
    time: "hace 8min",
    read: false,
  },
  {
    id: "n-docexp-1",
    type: "doc-exp",
    t: "Avalúo BBVA por expirar",
    body: "Casa Polanco 412 · en 17 días",
    time: "hace 32min",
    read: false,
  },
  {
    id: "n-mention-1",
    type: "mention",
    t: "Marcela te mencionó",
    body: '"Revisa por favor la propuesta de renovación de Sofía"',
    time: "hace 1h",
    read: false,
  },
];

export const notificationsYesterday: NotifItem[] = [
  {
    id: "n-payment-1",
    type: "payment",
    t: "5 pagos confirmados",
    body: "Sofía · Daniel · Carolina · Linda · Café Quinto",
    time: "18:00",
    read: true,
  },
  {
    id: "n-invite-1",
    type: "invite",
    t: "Andrea aceptó tu invitación",
    body: "Se unió a GFC como Operador",
    time: "14:32",
    read: true,
  },
  {
    id: "n-valuation-1",
    type: "valuation",
    t: "Catastro 2026 publicado",
    body: "Edificio Roma 88 · +3.1% fiscal",
    time: "09:14",
    read: true,
  },
];

/** Detalle del aviso `overdue` (pantalla 20). */
export const noticeDetail = {
  id: "n-overdue-1",
  title: "Loft Condesa · Carlos y Mariana",
  age: "hace 8 min · sistema",
  amount: "$19,500",
  overdueDays: "14 días",
  originalDate: "01 may 2026",
  penalty: "$975",
  history: [
    ["May 2026", "Vencido · sin pagar", "bad"],
    ["Abr 2026", "Pagado · 5 días tarde", "warn"],
    ["Mar 2026", "Pagado puntual", "ok"],
    ["Feb 2026", "Pagado puntual", "ok"],
  ] as const,
  actions: [
    ["Recordatorio enviado", "WhatsApp · 03 may", "ok"],
    ["Recordatorio enviado", "Correo · 08 may", "ok"],
    ["Llamada intentada", "12 may · sin respuesta", "warn"],
  ] as const,
};
