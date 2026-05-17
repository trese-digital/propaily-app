/** Mapa base de la PWA móvil — pines de las propiedades del tenant (CORE). */
import Link from "next/link";

import { IcChevR, IcPin } from "@/components/icons";
import { MTabBar } from "@/components/mobile/nav";
import { Badge } from "@/components/mobile/ui";
import { resolveMobileRole } from "@/server/mobile/data";
import { getMapProperties } from "@/server/properties/map-data";

import { MobileMapView } from "./map-view";

export const metadata = { title: "Mapa · Propaily" };

export default async function MobileMapScreen() {
  const { ctx } = await resolveMobileRole();
  const { located, unlocated } = await getMapProperties(ctx);
  const total = located.length + unlocated.length;

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
          Mapa
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
          {located.length} de {total} ubicadas
        </div>
      </div>

      {total === 0 ? (
        <div
          style={{
            margin: "14px 18px",
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
      ) : (
        <>
          <div style={{ padding: "14px 18px 0" }}>
            <div
              style={{
                height: 360,
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid var(--ink-100)",
                background: "var(--ink-100)",
              }}
            >
              {located.length > 0 ? (
                <MobileMapView located={located} />
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20,
                    textAlign: "center",
                    fontSize: 13,
                    color: "var(--ink-500)",
                  }}
                >
                  Ninguna propiedad tiene ubicación todavía.
                </div>
              )}
            </div>
          </div>

          {unlocated.length > 0 && (
            <div style={{ padding: "16px 18px 0" }}>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--ink-500)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Sin ubicar · {unlocated.length}
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid var(--ink-100)",
                  overflow: "hidden",
                }}
              >
                {unlocated.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/m/propiedad/${p.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: 12,
                      borderTop: i > 0 ? "1px solid var(--ink-100)" : "none",
                    }}
                  >
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: "var(--ink-100)",
                        color: "var(--ink-500)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "0 0 auto",
                      }}
                    >
                      <IcPin size={16} />
                    </span>
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
                        style={{
                          fontSize: 10,
                          color: "var(--ink-500)",
                          marginTop: 1,
                        }}
                      >
                        Sin ubicación
                      </div>
                    </div>
                    <Badge tone="neutral">{p.status}</Badge>
                    <IcChevR size={14} style={{ color: "var(--ink-400)" }} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <MTabBar active={2} />
    </div>
  );
}
