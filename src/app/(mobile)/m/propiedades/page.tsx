/** Listado de propiedades de la PWA mobile — datos reales (fix bug #2). */
import Link from "next/link";

import { IcChevR } from "@/components/icons";
import { MTabBar } from "@/components/mobile/nav";
import { Badge } from "@/components/mobile/ui";
import { getOwnerHome, resolveMobileRole } from "@/server/mobile/data";

export const metadata = { title: "Propiedades · Propaily" };

export default async function MobilePropertiesScreen() {
  const { ctx } = await resolveMobileRole();
  const { properties } = await getOwnerHome(ctx);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-muted)",
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          padding: "var(--m-safe-top) 18px 14px",
          background: "#fff",
          borderBottom: "1px solid var(--ink-100)",
        }}
      >
        <h1
          style={{
            margin: 0,
            font: "600 22px var(--font-sans)",
            letterSpacing: "-0.015em",
          }}
        >
          Propiedades
        </h1>
        <div
          className="mono"
          style={{
            fontSize: 10,
            color: "var(--ink-500)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {properties.length} en total
        </div>
      </div>

      <div
        style={{
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {properties.length === 0 && (
          <div
            style={{
              padding: 28,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid var(--ink-100)",
              textAlign: "center",
              fontSize: 13,
              color: "var(--ink-500)",
            }}
          >
            Aún no hay propiedades registradas.
          </div>
        )}

        {properties.map((p) => (
          <Link
            key={p.id}
            href={`/m/propiedad/${p.id}`}
            style={{
              display: "flex",
              gap: 12,
              padding: 10,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid var(--ink-100)",
              alignItems: "center",
            }}
          >
            <div
              className="pp-img-ph"
              style={{ width: 56, height: 56, borderRadius: 8, flex: "0 0 auto" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  font: "600 14px var(--font-sans)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.name}
              </div>
              <div
                className="mono"
                style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 1 }}
              >
                {p.colony}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 4,
                }}
              >
                <span className="num" style={{ fontSize: 13, fontWeight: 600 }}>
                  {p.value}
                </span>
                <Badge tone={p.statusTone}>{p.status}</Badge>
              </div>
            </div>
            <IcChevR size={14} style={{ color: "var(--ink-400)" }} />
          </Link>
        ))}
      </div>

      <MTabBar active={1} />
    </div>
  );
}
