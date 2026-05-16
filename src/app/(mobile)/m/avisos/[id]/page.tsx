/** 20 · Detalle de aviso — datos reales (Fase 2a). */
import { notFound } from "next/navigation";

import { IcMore } from "@/components/icons";
import { MFlowTopBar } from "@/components/mobile/nav";
import { TYPE_ICON } from "@/components/mobile/notif";
import { MCard, MSection } from "@/components/mobile/ui";
import { getNoticeDetailData, resolveMobileRole } from "@/server/mobile/data";

export default async function NoticeDetailScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { ctx } = await resolveMobileRole();
  const d = await getNoticeDetailData(ctx, id);
  if (!d) notFound();

  const t = TYPE_ICON[d.item.type] ?? TYPE_ICON.task;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-muted)",
      }}
    >
      <MFlowTopBar
        title="Aviso"
        backHref="/m/avisos"
        right={
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid var(--ink-200)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink-600)",
            }}
          >
            <IcMore size={14} />
          </span>
        }
      />

      <div style={{ padding: "18px 18px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: t.bg,
              color: t.c,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
            }}
          >
            <t.Icon size={22} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                font: "600 18px var(--font-sans)",
                letterSpacing: "-0.015em",
              }}
            >
              {d.item.t}
            </div>
            <div
              className="mono"
              style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 2 }}
            >
              {d.createdAtLabel} · {d.item.time}
              {!d.item.read && " · no leído"}
            </div>
          </div>
        </div>
      </div>

      <MSection title="Detalle">
        <MCard>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--ink-900)",
              lineHeight: 1.6,
            }}
          >
            {d.item.body}
          </p>
        </MCard>
      </MSection>
    </div>
  );
}
