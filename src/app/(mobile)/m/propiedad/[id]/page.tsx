/** 09 · Detalle de propiedad — datos reales (Fase 2a). */
import Link from "next/link";
import { notFound } from "next/navigation";

import { IcArrowR, IcCheck, IcMap, IcMore } from "@/components/icons";
import { MTabBar } from "@/components/mobile/nav";
import { PropertyImage } from "@/components/mobile/property-image";
import { PullToRefresh } from "@/components/mobile/pull-to-refresh";
import {
  Avatar,
  Badge,
  Chip,
  MCard,
  MSection,
  MetricMini,
} from "@/components/mobile/ui";
import { getPropertyDetailData, resolveMobileRole } from "@/server/mobile/data";

export default async function PropertyDetailScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { ctx } = await resolveMobileRole();
  const d = await getPropertyDetailData(ctx, id);
  if (!d) notFound();


  return (
    <PullToRefresh>
      <div
        style={{
          minHeight: "100dvh",
          background: "var(--bg-muted)",
          paddingBottom: 100,
        }}
      >
      {/* Hero */}
      <div
        style={{
          height: 280,
          borderRadius: 0,
          position: "relative",
          alignItems: "stretch",
        }}
      >
        <PropertyImage
          src={d.coverPhotoUrl}
          alt={`Foto de ${d.name}`}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 0,
          }}
          fallbackStyle={{
            alignItems: "stretch",
          }}
        />
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
          <Badge tone={d.statusTone}>{d.status}</Badge>
          <h1
            style={{
              margin: "8px 0 4px",
              font: "600 24px var(--font-sans)",
              letterSpacing: "-0.015em",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {d.name}
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
        <Chip>Documentos</Chip>
        <Chip>Avalúos</Chip>
        <Chip>Inquilino</Chip>
      </div>

      {/* Catastro */}
      <MSection title="Catastro">
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
                {d.catastro.linked ? "Lote vinculado" : "Sin lote vinculado"}
              </div>
              <div
                className="mono"
                style={{ fontSize: 10, color: "var(--ink-500)" }}
              >
                {d.catastro.linked
                  ? "Predio del catastro de León"
                  : "Esta propiedad no está ligada al catastro"}
              </div>
            </div>
            {d.catastro.linked && (
              <Badge tone="ok">
                <IcCheck size={9} />
              </Badge>
            )}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
            }}
          >
            <MetricMini
              label="Valor fiscal"
              value={d.catastro.fiscal}
              mono
              small
            />
            <MetricMini
              label="Comercial"
              value={d.catastro.comercial}
              mono
              small
            />
          </div>
        </MCard>
      </MSection>

      {/* Inquilino */}
      <MSection title="Inquilino actual">
        <MCard>
          {d.tenant ? (
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
          ) : (
            <div
              style={{
                fontSize: 13,
                color: "var(--ink-500)",
                textAlign: "center",
                padding: "8px 0",
              }}
            >
              Esta propiedad no tiene un contrato activo.
            </div>
          )}
        </MCard>
      </MSection>

      <MTabBar active={1} />
    </div>
    </PullToRefresh>
  );
}

const glassBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  background: "rgba(45, 55, 72, 0.7)",
  backdropFilter: "blur(8px)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  textDecoration: "none",
};
