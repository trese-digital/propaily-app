/**
 * Capa de datos de la PWA mobile — Fase 2a (owner + operador con datos reales).
 *
 * Las pantallas Server Component llaman estas funciones; devuelven objetos con
 * la MISMA forma que `src/features/mobile/demo-data.ts`, así el cableado de las
 * pantallas es un cambio de import. Todo va por `withAppScope` → RLS scopea por
 * ManagementCompany (+ Client si el usuario es family office).
 *
 * Las pantallas de inquilino (12-16) siguen en demo-data: los inquilinos aún no
 * tienen login (ver memoria pwa-mobile-fase1 → Fase 2b).
 */
import type { NotifItem, NotifType } from "@/components/mobile/notif";
import { appScope, requireContext, type AppContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";
import { getPropertyCoverUrl } from "@/server/properties/cover-photo";

/* ───────────────────────── Formateadores ───────────────────────── */

const numFmt = new Intl.NumberFormat("es-MX");
const dayFmt = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short" });

/** "$8.4M" / "$58K" / "$1,200" — compacto para KPIs. */
function mxnShort(cents: bigint | null | undefined): string {
  if (cents == null) return "—";
  const pesos = Number(cents) / 100;
  const abs = Math.abs(pesos);
  if (abs >= 1_000_000) return `$${(pesos / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${Math.round(pesos / 1_000)}K`;
  return `$${numFmt.format(Math.round(pesos))}`;
}

/** "$38,000" — monto completo. */
function mxnFull(cents: bigint | null | undefined): string {
  if (cents == null) return "—";
  return `$${numFmt.format(Math.round(Number(cents) / 100))}`;
}

function relativeTime(d: Date): string {
  const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin}min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `hace ${diffH}h`;
  const diffD = Math.round(diffH / 24);
  if (diffD === 1) return "ayer";
  return `hace ${diffD}d`;
}

const STATUS_LABEL: Record<string, string> = {
  active: "Activa",
  available: "Disponible",
  rented: "Rentada",
  for_sale: "En venta",
  under_construction: "En construcción",
  maintenance: "Mantenimiento",
  reserved: "Reservada",
  inactive: "Inactiva",
};

type StatusTone = "ok" | "warn" | "bad" | "violet" | "neutral" | "info";

function statusTone(status: string): StatusTone {
  if (status === "active" || status === "rented") return "ok";
  if (status === "available") return "info";
  if (status === "reserved") return "violet";
  if (status === "inactive") return "neutral";
  return "warn";
}

/* ───────────────────────── Rol del usuario ─────────────────────── */

export type MobileRole = "owner" | "operator";

/** Operador GF (accessScope "gf") → operator; family office → owner. */
export async function resolveMobileRole(): Promise<{
  ctx: AppContext;
  role: MobileRole;
}> {
  const ctx = await requireContext();
  return { ctx, role: ctx.accessScope === "gf" ? "operator" : "owner" };
}

/* ───────────────────────── Home propietario ────────────────────── */

export async function getOwnerHome(ctx: AppContext) {
  const data = await withAppScope(appScope(ctx), async (tx) => {
    const [valueAgg, properties, valuationRequests] = await Promise.all([
      tx.property.aggregate({
        where: { deletedAt: null },
        _sum: { currentValueCents: true, fiscalValueCents: true },
      }),
      tx.property.findMany({
        where: { deletedAt: null },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          name: true,
          address: true,
          city: true,
          landAreaSqm: true,
          builtAreaSqm: true,
          currentValueCents: true,
          fiscalValueCents: true,
          operationalStatus: true,
          coverPhotoStorageKey: true,
          leases: {
            where: { status: "active", deletedAt: null },
            select: { monthlyRentCents: true, tenantName: true },
            take: 1,
          },
        },
      }),
      tx.valuationRequest.count({
        where: { status: { in: ["pending", "in_progress"] } },
      }),
    ]);

    // Pagos de los próximos 30 días.
    const in30 = new Date();
    in30.setDate(in30.getDate() + 30);
    const payments = await tx.rentPayment.findMany({
      where: {
        deletedAt: null,
        status: { in: ["pending", "proof_uploaded", "overdue"] },
        dueDate: { lte: in30 },
      },
      orderBy: { dueDate: "asc" },
      take: 6,
      select: {
        amountCents: true,
        dueDate: true,
        status: true,
        lease: { select: { tenantName: true, property: { select: { name: true } } } },
      },
    });
    return { valueAgg, properties, valuationRequests, payments };
  });

  const patrimonioCents =
    data.valueAgg._sum.currentValueCents ??
    data.valueAgg._sum.fiscalValueCents ??
    0n;

  let rentaCents = 0n;
  for (const p of data.properties) {
    if (p.leases[0]) rentaCents += p.leases[0].monthlyRentCents;
  }
  const rentedCount = data.properties.filter((p) => p.leases[0]).length;

  const properties = await Promise.all(
    data.properties.map(async (p) => ({
      id: p.id,
      name: p.name,
      colony: [p.address, p.city].filter(Boolean).join(" · ") || "Sin ubicación",
      value: mxnShort(p.currentValueCents ?? p.fiscalValueCents),
      status: STATUS_LABEL[p.operationalStatus] ?? p.operationalStatus,
      statusTone: statusTone(p.operationalStatus),
      area: p.builtAreaSqm ?? p.landAreaSqm
        ? `${numFmt.format(Math.round(Number(p.builtAreaSqm ?? p.landAreaSqm)))} m²`
        : "—",
      rentMonth: p.leases[0] ? mxnShort(p.leases[0].monthlyRentCents) : "—",
      coverPhotoUrl: p.coverPhotoStorageKey ? await getPropertyCoverUrl(p.coverPhotoStorageKey) : null,
    }))
  );

  const upcomingPayments = data.payments.map((r) => {
    const tone =
      r.status === "overdue"
        ? ("bad" as const)
        : r.status === "proof_uploaded"
          ? ("ok" as const)
          : ("violet" as const);
    const label =
      r.status === "overdue"
        ? "vencido"
        : r.status === "proof_uploaded"
          ? "en revisión"
          : "pendiente";
    return {
      tenant: r.lease.tenantName,
      property: r.lease.property?.name ?? "—",
      amount: mxnFull(r.amountCents),
      date: dayFmt.format(r.dueDate),
      status: label,
      tone,
    };
  });

  return {
    portfolio: {
      patrimonio: mxnShort(patrimonioCents),
      patrimonioDelta: `${data.properties.length} propiedades`,
      rentaMes: mxnShort(rentaCents),
      rentaMesNota: `${rentedCount} rentada${rentedCount === 1 ? "" : "s"}`,
    },
    properties,
    upcomingPayments,
    approvalCount: data.valuationRequests,
  };
}

/* ───────────────────── Detalle de propiedad ────────────────────── */

export async function getPropertyDetailData(ctx: AppContext, id: string) {
  const p = await withAppScope(appScope(ctx), (tx) =>
    tx.property.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        operationalStatus: true,
        landAreaSqm: true,
        builtAreaSqm: true,
        currentValueCents: true,
        fiscalValueCents: true,
        commercialValueCents: true,
        cartoPredioId: true,
        coverPhotoStorageKey: true,
        leases: {
          where: { status: "active", deletedAt: null },
          orderBy: { startDate: "desc" },
          take: 1,
          select: {
            tenantName: true,
            monthlyRentCents: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    }),
  );
  if (!p) return null;

  const lease = p.leases[0];
  const area = p.builtAreaSqm ?? p.landAreaSqm;
  const coverPhotoUrl = p.coverPhotoStorageKey ? await getPropertyCoverUrl(p.coverPhotoStorageKey) : null;

  return {
    id: p.id,
    name: p.name,
    colony:
      [p.address, p.city, p.state].filter(Boolean).join(" · ") ||
      "Sin ubicación",
    status: `${STATUS_LABEL[p.operationalStatus] ?? p.operationalStatus}`,
    statusTone: statusTone(p.operationalStatus),
    value: mxnShort(p.currentValueCents ?? p.fiscalValueCents),
    rentMonth: lease ? mxnShort(lease.monthlyRentCents) : "—",
    area: area ? `${numFmt.format(Math.round(Number(area)))}m²` : "—",
    coverPhotoUrl,
    catastro: {
      linked: p.cartoPredioId != null,
      fiscal: mxnShort(p.fiscalValueCents),
      comercialM2: mxnShort(p.commercialValueCents),
    },
    tenant: lease
      ? {
          name: lease.tenantName,
          since: `Desde ${dayFmt.format(lease.startDate)} · ${mxnFull(lease.monthlyRentCents)}/mes`,
          endDate: lease.endDate,
        }
      : null,
  };
}

/* ─────────────────────── Aprobaciones (owner) ──────────────────── */

export async function getApprovalsData(ctx: AppContext) {
  const data = await withAppScope(appScope(ctx), async (tx) => {
    const in60 = new Date();
    in60.setDate(in60.getDate() + 60);
    const [requests, expiringLeases] = await Promise.all([
      tx.valuationRequest.findMany({
        where: { status: { in: ["pending", "in_progress"] } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          notes: true,
          createdAt: true,
          property: { select: { name: true } },
        },
      }),
      tx.lease.findMany({
        where: {
          status: "active",
          deletedAt: null,
          endDate: { lte: in60 },
        },
        orderBy: { endDate: "asc" },
        take: 10,
        select: {
          id: true,
          tenantName: true,
          endDate: true,
          monthlyRentCents: true,
          property: { select: { name: true } },
        },
      }),
    ]);
    return { requests, expiringLeases };
  });

  const approvals = [
    ...data.expiringLeases.map((l) => ({
      id: `lease_${l.id}`,
      kind: "renovacion" as const,
      tag: "Renovación",
      tone: "violet" as const,
      title: `Renovación · ${l.tenantName}`,
      detail: `${l.property?.name ?? "—"} · vence ${dayFmt.format(l.endDate)}`,
      actor: l.tenantName,
    })),
    ...data.requests.map((r) => ({
      id: `vr_${r.id}`,
      kind: "avaluo" as const,
      tag: "Avalúo",
      tone: "warn" as const,
      title: `Solicitud de avalúo · ${r.property?.name ?? "—"}`,
      detail: r.notes?.slice(0, 80) ?? "Sin notas",
      actor: r.property?.name ?? "—",
    })),
  ];
  return { approvals };
}

export async function getApprovalDetailData(ctx: AppContext, rawId: string) {
  const [kind, id] = rawId.split("_", 2);
  if (kind === "lease" && id) {
    const l = await withAppScope(appScope(ctx), (tx) =>
      tx.lease.findFirst({
        where: { id },
        select: {
          tenantName: true,
          monthlyRentCents: true,
          startDate: true,
          endDate: true,
          notes: true,
          property: { select: { name: true } },
        },
      }),
    );
    if (!l) return null;
    return {
      kind: "renovacion" as const,
      title: `Renovación · ${l.tenantName}`,
      property: l.property?.name ?? "—",
      badge: `Vence ${dayFmt.format(l.endDate)}`,
      rows: [
        ["Inquilino", l.tenantName],
        ["Renta actual", mxnFull(l.monthlyRentCents)],
        ["Inicio del contrato", dayFmt.format(l.startDate)],
        ["Vencimiento", dayFmt.format(l.endDate)],
      ] as [string, string][],
      note: l.notes ?? null,
    };
  }
  if (kind === "vr" && id) {
    const r = await withAppScope(appScope(ctx), (tx) =>
      tx.valuationRequest.findFirst({
        where: { id },
        select: {
          status: true,
          notes: true,
          response: true,
          createdAt: true,
          property: { select: { name: true } },
        },
      }),
    );
    if (!r) return null;
    return {
      kind: "avaluo" as const,
      title: `Solicitud de avalúo`,
      property: r.property?.name ?? "—",
      badge: `Solicitada ${dayFmt.format(r.createdAt)}`,
      rows: [
        ["Propiedad", r.property?.name ?? "—"],
        ["Estatus", r.status],
        ["Solicitada", dayFmt.format(r.createdAt)],
      ] as [string, string][],
      note: r.response ?? r.notes ?? null,
    };
  }
  return null;
}

/* ─────────────────────────── Operador ──────────────────────────── */

export async function getOperatorToday(ctx: AppContext) {
  const data = await withAppScope(appScope(ctx), async (tx) => {
    const now = new Date();
    const [openTasks, openMaintenance, overduePayments, urgentTasks] =
      await Promise.all([
        tx.task.count({
          where: { deletedAt: null, status: { in: ["pending", "in_progress"] } },
        }),
        tx.maintenanceRequest.count({
          where: { deletedAt: null, status: { notIn: ["completed"] } },
        }),
        tx.rentPayment.count({
          where: {
            deletedAt: null,
            status: { in: ["pending", "overdue"] },
            dueDate: { lt: now },
          },
        }),
        tx.task.findMany({
          where: {
            deletedAt: null,
            status: { in: ["pending", "in_progress"] },
            priority: { in: ["high", "urgent"] },
          },
          orderBy: { dueAt: "asc" },
          take: 4,
          select: {
            id: true,
            title: true,
            priority: true,
            dueAt: true,
            property: { select: { name: true } },
          },
        }),
      ]);
    return { openTasks, openMaintenance, overduePayments, urgentTasks };
  });

  return {
    operator: ctx.user.name ?? "Operador",
    company: ctx.membership.managementCompanyName,
    counts: {
      tasks: data.openTasks,
      maintenance: data.openMaintenance,
      overdue: data.overduePayments,
    },
    urgent: data.urgentTasks.map((t) => ({
      id: t.id,
      tone: t.priority === "urgent" ? ("bad" as const) : ("warn" as const),
      title: t.title,
      detail: t.property?.name ?? "Sin propiedad",
    })),
  };
}

export async function getCollectionsData(ctx: AppContext) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const data = await withAppScope(appScope(ctx), async (tx) => {
    const [monthAgg, collectedAgg, overdue] = await Promise.all([
      tx.rentPayment.aggregate({
        where: { deletedAt: null, dueDate: { gte: monthStart, lte: monthEnd } },
        _sum: { amountCents: true },
        _count: true,
      }),
      tx.rentPayment.aggregate({
        where: {
          deletedAt: null,
          dueDate: { gte: monthStart, lte: monthEnd },
          status: { in: ["confirmed", "proof_uploaded"] },
        },
        _sum: { amountCents: true },
      }),
      tx.rentPayment.findMany({
        where: {
          deletedAt: null,
          status: { in: ["pending", "overdue"] },
          dueDate: { lt: now },
        },
        orderBy: { dueDate: "asc" },
        take: 20,
        select: {
          id: true,
          amountCents: true,
          dueDate: true,
          lease: {
            select: {
              tenantName: true,
              tenantEmail: true,
              property: { select: { name: true } },
            },
          },
        },
      }),
    ]);
    return { monthAgg, collectedAgg, overdue };
  });

  const totalCents = data.monthAgg._sum.amountCents ?? 0n;
  const collectedCents = data.collectedAgg._sum.amountCents ?? 0n;
  const pct =
    totalCents > 0n
      ? Math.round((Number(collectedCents) / Number(totalCents)) * 100)
      : 0;

  return {
    monthLabel: `${data.monthAgg._count} rentas · ${mxnFull(totalCents)}`,
    collectedPct: pct,
    collectedLabel: `${mxnFull(collectedCents)} · ${pct}%`,
    overdue: data.overdue.map((r) => {
      const days = Math.max(
        1,
        Math.round((now.getTime() - r.dueDate.getTime()) / 86_400_000),
      );
      return {
        name: r.lease.tenantName,
        property: r.lease.property?.name ?? "—",
        amount: mxnFull(r.amountCents),
        days,
        tone: days > 10 ? ("bad" as const) : ("warn" as const),
        tel: r.lease.tenantEmail ?? "sin contacto",
      };
    }),
  };
}

/* ──────────────────────── Avisos (compartido) ──────────────────── */

const NOTIF_TYPE_MAP: Record<string, NotifType> = {
  document_expiring: "doc-exp",
  lease_expiring: "doc-exp",
  task_assigned: "task",
  invitation: "invite",
  valuation_request_updated: "valuation",
  document_approval_updated: "approval",
  rent_payment_updated: "payment",
  maintenance_updated: "maintenance",
};

function toNotifItem(n: {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: Date | null;
  createdAt: Date;
}): NotifItem {
  return {
    id: n.id,
    type: NOTIF_TYPE_MAP[n.type] ?? "task",
    t: n.title,
    body: n.body,
    time: relativeTime(n.createdAt),
    read: n.readAt != null,
  };
}

export async function getNotificationsData(ctx: AppContext) {
  const rows = await withAppScope(appScope(ctx), (tx) =>
    tx.notification.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: "desc" },
      take: 40,
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        readAt: true,
        createdAt: true,
      },
    }),
  );

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const today: NotifItem[] = [];
  const earlier: NotifItem[] = [];
  for (const n of rows) {
    (n.createdAt >= startOfToday ? today : earlier).push(toNotifItem(n));
  }
  return {
    today,
    earlier,
    total: rows.length,
    unread: rows.filter((n) => n.readAt == null).length,
  };
}

export async function getNoticeDetailData(ctx: AppContext, id: string) {
  const n = await withAppScope(appScope(ctx), (tx) =>
    tx.notification.findFirst({
      where: { id, userId: ctx.user.id },
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        readAt: true,
        createdAt: true,
      },
    }),
  );
  if (!n) return null;
  return {
    item: toNotifItem(n),
    createdAtLabel: dayFmt.format(n.createdAt),
  };
}
