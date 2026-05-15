/** 09 · Detalle de propiedad (MobilePropDetalle del handoff). */
import Link from "next/link";

import { IcArrowR, IcCheck, IcMap, IcMore } from "@/components/icons";
import { MTabBar } from "@/components/mobile/nav";
import {
  Avatar,
  Badge,
  Chip,
  MCard,
  MSection,
  MetricMini,
} from "@/components/mobile/ui";
import { properties, propertyDetail } from "@/features/mobile/demo-data";

export default async function PropertyDetailScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = properties.find((p) => p.id === id) ?? properties[0];
  const d = propertyDetail;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-muted)",
        paddingBottom: 100,
      }}
    >
      {/* Hero */}
      <div
        className="pp-img-ph"
        style={{
          height: 280,
          borderRadius: 0,
          position: "relative",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "var(--m-safe-top)",
            left: 14,
            right: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Link href="/m/inicio" aria-label="Atrás" style={glassBtn}>
            <IcArrowR size={14} style={{ transform: "rotate(180deg)" }} />
          </Link>
          <span style={{ flex: 1 }} />
          <span style={glassBtn}>
            <IcMore size={14} />
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 14,
            bottom: 14,
            right: 14,
            color: "#fff",
          }}
        >
          <Badge tone="ok">{d.status}</Badge>
          <h1
            style={{
              margin: "8px 0 4px",
              font: "600 24px var(--font-sans)",
              letterSpacing: "-0.015em",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {property.name}
          </h1>
          <div
            className="mono"
            style={{
              fontSize: 11,
              opacity: 0.9,
              textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            {d.colony}
          </div>
        </div>
      </div>

      {/* Métricas clave */}
      <div
        style={{
          margin: "-20px 14px 14px",
          padding: 14,
          background: "#fff",
          borderRadius: 14,
          border: "1px solid var(--ink-100)",
          boxShadow: "0 8px 20px rgba(27,8,83,0.08)",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
        }}
      >
        <MetricMini label="Valor" value={d.value} tone="violet" />
        <MetricMini label="Renta/mes" value={d.rentMonth} tone="ok" />
        <MetricMini label="Área" value={d.area} tone="neutral" />
      </div>

      {/* Tabs */}
      <div
        style={{
          padding: "0 14px",
          display: "flex",
          gap: 8,
          marginBottom: 14,
          overflowX: "auto",
        }}
      >
        <Chip active>Resumen</Chip>
        <Chip>Documentos · 12</Chip>
        <Chip>Avalúos · 7</Chip>
        <Chip>Inquilino</Chip>
        <Chip>Histórico</Chip>
      </div>

      {/* Catastro */}
      <MSection title="Catastro · León">
        <MCard accent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--pp-500)",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IcMap size={16} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ font: "600 13px var(--font-sans)" }}>
                Lote vinculado
              </div>
              <div
                className="mono"
                style={{ fontSize: 10, color: "var(--ink-500)" }}
              >
                {d.catastro.lote}
              </div>
            </div>
            <Badge tone="ok">
              <IcCheck size={9} />
            </Badge>
          </div>
          <div
            className="pp-img-ph"
            style={{ height: 90, borderRadius: 8 }}
          >
            Mapa catastral
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
              marginTop: 10,
            }}
          >
            <MetricMini
              label="Fiscal"
              value={d.catastro.fiscal}
              mono
              small
            />
            <MetricMini
              label="Comercial /m²"
              value={d.catastro.comercialM2}
              mono
              small
            />
          </div>
        </MCard>
      </MSection>

      {/* Inquilino */}
      <MSection title="Inquilino actual">
        <MCard>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={d.tenant.name} size={44} tone="violet" />
            <div style={{ flex: 1 }}>
              <div style={{ font: "600 14px var(--font-sans)" }}>
                {d.tenant.name}
              </div>
              <div
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-500)" }}
              >
                {d.tenant.since}
              </div>
            </div>
          </div>
          <div
            style={{
              height: 1,
              background: "var(--ink-100)",
              margin: "12px -2px",
            }}
          />
          <Link
            href="/m/aprobar/renovacion/renovacion-sofia"
            style={{
              padding: 10,
              background: "#FFFBEB",
              borderRadius: 8,
              border: "1px solid #FDE68A",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 999,
                background: "var(--warn)",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              !
            </span>
            <span style={{ flex: 1, fontSize: 12, color: "#92400E" }}>
              {d.tenant.contractWarning}
            </span>
            <span style={{ fontSize: 11, color: "#92400E", fontWeight: 600 }}>
              Renovar →
            </span>
          </Link>
        </MCard>
      </MSection>

      <MTabBar active={1} />
    </div>
  );
}

const glassBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(10px)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--ink-700)",
};
