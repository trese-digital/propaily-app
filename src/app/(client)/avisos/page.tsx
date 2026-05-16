import Link from "next/link";
import type { ComponentType } from "react";

import {
  IcBell,
  IcChart,
  IcCheck,
  IcDoc,
  IcKey,
  IcUsers,
  IcWrench,
  type IconProps,
} from "@/components/icons";
import { Card, CardHeader, EmptyState } from "@/components/ui";
import { appScope, requireContext } from "@/server/auth/context";
import { listNotifications } from "@/server/notifications/data";

import { MarkAllRead, MarkOneRead } from "./avisos-actions";

type IconCmp = ComponentType<IconProps>;

const TYPE_META: Record<
  string,
  { icon: IconCmp; href: string | null; label: string }
> = {
  document_expiring: { icon: IcDoc, href: "/propiedades", label: "Documento" },
  document_approval_updated: { icon: IcDoc, href: "/propiedades", label: "Documento" },
  lease_expiring: { icon: IcKey, href: "/rentas", label: "Renta" },
  rent_payment_updated: { icon: IcKey, href: "/rentas/calendario", label: "Pago" },
  valuation_request_updated: { icon: IcChart, href: "/valuaciones", label: "Avalúo" },
  maintenance_updated: { icon: IcWrench, href: "/mantenimiento", label: "Mantenimiento" },
  task_assigned: { icon: IcCheck, href: "/mantenimiento", label: "Tarea" },
  invitation: { icon: IcUsers, href: "/usuarios", label: "Invitación" },
};

const DEFAULT_META = { icon: IcBell, href: null, label: "Aviso" };

const dateFmt = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const min = Math.round(diff / 60_000);
  if (min < 1) return "hace un momento";
  if (min < 60) return `hace ${min} min`;
  const hrs = Math.round(min / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `hace ${days} d`;
  return dateFmt.format(date);
}

export default async function AvisosPage() {
  const ctx = await requireContext();
  const notifications = await listNotifications(appScope(ctx), ctx.user.id);

  const unread = notifications.filter((n) => n.readAt == null).length;

  return (
    <section className="mx-auto flex max-w-[760px] flex-col gap-6 px-8 py-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label">Centro de notificaciones</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em]">
            Avisos
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            {notifications.length === 0
              ? "No tienes avisos."
              : unread > 0
                ? `${unread} sin leer · ${notifications.length} en total`
                : `${notifications.length} aviso${notifications.length === 1 ? "" : "s"} · todos leídos`}
          </p>
        </div>
        {unread > 0 && <MarkAllRead />}
      </header>

      {notifications.length === 0 ? (
        <EmptyState
          icon={IcBell}
          title="Sin avisos"
          description="Aquí aparecerán los avisos sobre vencimientos, pagos, avalúos y mantenimiento."
        />
      ) : (
        <Card>
          <CardHeader title="Recientes" />
          <ul className="divide-y divide-ink-100">
            {notifications.map((n) => {
              const meta = TYPE_META[n.type] ?? DEFAULT_META;
              const Icon = meta.icon;
              const isUnread = n.readAt == null;
              return (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3.5 ${
                    isUnread ? "bg-pp-50/60" : ""
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isUnread
                        ? "bg-pp-100 text-pp-700"
                        : "bg-[var(--bg-muted)] text-ink-500"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="mono-label">{meta.label}</span>
                      {isUnread && (
                        <span className="h-1.5 w-1.5 rounded-full bg-pp-500" />
                      )}
                      <span className="mono ml-auto text-[11px] text-ink-400">
                        {relativeTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[13px] font-medium text-ink-900">
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-ink-600">
                      {n.body}
                    </p>
                    <div className="mt-1.5 flex items-center gap-3">
                      {meta.href && (
                        <Link
                          href={meta.href as never}
                          className="text-[12px] font-medium text-pp-700 hover:text-pp-600"
                        >
                          Ver detalle →
                        </Link>
                      )}
                      {isUnread && <MarkOneRead id={n.id} />}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </section>
  );
}
