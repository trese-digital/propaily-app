import Link from "next/link";

export const metadata = {
  title: "Propaily — Cartografía de tu patrimonio inmobiliario",
  description:
    "Catastro, lotes, propiedades, contratos y valuaciones de tu portafolio en un solo mapa. Para family offices y agentes con más de cinco activos.",
};

export default function WelcomePage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <Features />
      <Cartografia />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        gap: 28,
      }}
    >
      <Link href={"/welcome" as never} style={{ display: "flex", alignItems: "baseline", gap: 10, textDecoration: "none" }}>
        <span style={{ font: "600 18px var(--font-sans)", color: "var(--color-pp-700)", letterSpacing: "-0.015em" }}>
          propaily
        </span>
      </Link>
      <div style={{ display: "flex", gap: 22, marginLeft: 8 }} className="hidden md:flex">
        {["Producto", "Cartografía", "Para portafolios", "Precios"].map((l) => (
          <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} style={{ font: "500 13px var(--font-sans)", color: "var(--fg-muted)", textDecoration: "none" }}>
            {l}
          </a>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <Link href="/login" style={{ font: "500 13px var(--font-sans)", color: "var(--fg)", textDecoration: "none" }}>
        Iniciar sesión
      </Link>
      <Link
        href="/signup"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          height: 34,
          padding: "0 14px",
          borderRadius: 8,
          background: "var(--accent)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 500,
          textDecoration: "none",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        Solicitar acceso →
      </Link>
    </nav>
  );
}

function Hero() {
  return (
    <section
      id="producto"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "80px 32px 56px",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -180,
          right: -160,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(110,58,255,0.18) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
          gap: 64,
          alignItems: "center",
          position: "relative",
        }}
        className="md:grid-cols-[1.2fr_1fr] grid-cols-1"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              alignItems: "center",
              gap: 8,
              padding: "5px 12px 5px 5px",
              borderRadius: 999,
              background: "var(--accent-soft)",
              border: "1px solid var(--color-pp-200)",
              color: "var(--color-pp-700)",
              font: "500 12px var(--font-sans)",
            }}
          >
            <span
              style={{
                background: "var(--color-pp-500)",
                color: "#fff",
                padding: "2px 7px",
                borderRadius: 999,
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Nuevo
            </span>
            Vinculación lote ↔ propiedad
          </span>
          <h1
            style={{
              margin: 0,
              font: "700 60px/1.04 var(--font-sans)",
              letterSpacing: "-0.035em",
              color: "var(--fg)",
            }}
          >
            La cartografía
            <br />
            <span style={{ color: "var(--color-pp-500)" }}>de tu patrimonio</span>
            <br />
            inmobiliario.
          </h1>
          <p style={{ margin: 0, font: "400 17px/1.55 var(--font-sans)", color: "var(--fg-muted)", maxWidth: 540 }}>
            Propaily concentra catastro, lotes, propiedades, contratos y valuaciones de tu portafolio
            en un solo mapa. Hecho para family offices y agentes que manejan más de cinco activos.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 44,
                padding: "0 22px",
                borderRadius: 10,
                background: "var(--accent)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 500,
                textDecoration: "none",
                boxShadow: "var(--shadow-md)",
              }}
            >
              Solicitar acceso →
            </Link>
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 44,
                padding: "0 22px",
                borderRadius: 10,
                background: "var(--bg)",
                color: "var(--fg)",
                fontSize: 15,
                fontWeight: 500,
                textDecoration: "none",
                border: "1px solid var(--border-strong)",
              }}
            >
              Iniciar sesión
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                background: "var(--color-pp-500)",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                font: "600 12px var(--font-sans)",
              }}
            >
              P
            </span>
            <span className="endoso" style={{ color: "var(--fg-muted)", opacity: 1 }}>
              BY GF CONSULTORÍA · LEÓN, MX
            </span>
          </div>
        </div>

        <HeroMapPreview />
      </div>
    </section>
  );
}

function HeroMapPreview() {
  return (
    <div
      style={{
        position: "relative",
        height: 480,
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid var(--border)",
        boxShadow: "0 30px 80px rgba(27,8,83,0.16)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(110,58,255,0.05) 0%, rgba(110,58,255,0) 60%), var(--color-ink-50)",
        }}
      >
        <svg viewBox="0 0 600 480" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <pattern id="lblock" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="var(--color-ink-25)" />
              <path d="M0 0 L60 0 M0 0 L0 60" stroke="var(--color-ink-200)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="600" height="480" fill="url(#lblock)" opacity="0.8" />
          <path d="M0,200 Q300,180 600,260" stroke="var(--color-ink-300)" strokeWidth="5" fill="none" opacity="0.7" />
          <path d="M150,0 Q170,250 230,480" stroke="var(--color-ink-300)" strokeWidth="5" fill="none" opacity="0.6" />
          <path d="M380,0 Q400,250 460,480" stroke="var(--color-ink-300)" strokeWidth="3" fill="none" opacity="0.5" />
          <path d="M80,80 L320,90 L340,260 L100,250 Z" fill="rgba(110,58,255,0.22)" stroke="var(--color-pp-500)" strokeWidth="2" />
          {[
            [140, 140],
            [200, 140],
            [260, 140],
            [140, 180],
            [200, 180],
            [260, 180],
          ].map(([x, y], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width="48"
              height="32"
              fill={i === 2 ? "var(--color-pp-500)" : "rgba(110,58,255,0.5)"}
              stroke="#fff"
              strokeWidth="1.5"
              rx="3"
            />
          ))}
        </svg>
      </div>

      {/* Inspector card */}
      <div
        style={{
          position: "absolute",
          right: 16,
          top: 16,
          bottom: 16,
          width: 230,
          background: "var(--bg)",
          borderRadius: 12,
          padding: 16,
          boxShadow: "var(--shadow-md)",
          border: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <span className="mono-label" style={{ color: "var(--color-pp-500)" }}>
          Colonia
        </span>
        <div style={{ font: "600 16px var(--font-sans)", letterSpacing: "-0.01em" }}>Polanco V</div>
        <div style={{ height: 1, background: "var(--border)" }} />
        <KV k="Valor fiscal" v="$78,420/m²" />
        <KV k="Valor comercial" v="$182,300/m²" />
        <KV k="Sector" v="04-12" />
        <div style={{ flex: 1 }} />
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 32,
            borderRadius: 8,
            background: "var(--color-pp-500)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 500,
            width: "100%",
          }}
        >
          Crear propiedad
        </span>
      </div>

      {/* Watermark */}
      <span
        className="mono"
        style={{
          position: "absolute",
          left: 14,
          bottom: 12,
          fontSize: 10,
          color: "rgba(14,10,22,0.55)",
          letterSpacing: "0.06em",
        }}
      >
        usuario@gfconsultoria.mx · 2026-05-13
      </span>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
      <span style={{ color: "var(--fg-muted)" }}>{k}</span>
      <span className="mono num" style={{ color: "var(--fg)", fontWeight: 500 }}>
        {v}
      </span>
    </div>
  );
}

function Features() {
  const items = [
    {
      title: "Mapa catastral de León",
      body: "1,507 colonias, 1,383 sectores, 541,791 predios. Valores fiscales y comerciales 2025/2026.",
    },
    {
      title: "Portafolios reales",
      body: "Casa, edificio, local, terreno. Unidades, contratos, valuaciones, fotos y documentos.",
    },
    {
      title: "Vinculación lote ↔ propiedad",
      body: "Conecta cada propiedad con su lote catastral. La superficie real prevalece sobre la del catastro.",
    },
    {
      title: "Documentos firmados",
      body: "Escrituras, avalúos, contratos. Versiones, vencimientos, niveles de sensibilidad.",
    },
    {
      title: "Watermark en exports",
      body: "Cada mapa o reporte exportado lleva email del usuario y timestamp en diagonal.",
    },
    {
      title: "Acceso por invitación",
      body: "Roles por administración, clientes y portafolios. Auditoría de cambios.",
    },
  ];

  return (
    <section
      id="cartografía"
      style={{
        padding: "72px 32px",
        background: "var(--bg-muted)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <span className="mono-label">Producto</span>
        <h2 style={{ margin: "8px 0 12px", font: "600 32px var(--font-sans)", letterSpacing: "-0.025em" }}>
          Todo el patrimonio, en un solo lugar.
        </h2>
        <p style={{ margin: "0 0 32px", color: "var(--fg-muted)", maxWidth: 640, fontSize: 16, lineHeight: 1.55 }}>
          Construido con datos del catastro municipal y enriquecido con valores comerciales actualizados.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((it) => (
            <div
              key={it.title}
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 22,
              }}
            >
              <h3 style={{ margin: "0 0 6px", font: "600 15px var(--font-sans)", letterSpacing: "-0.005em" }}>
                {it.title}
              </h3>
              <p style={{ margin: 0, color: "var(--fg-muted)", fontSize: 13, lineHeight: 1.5 }}>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cartografia() {
  return (
    <section style={{ padding: "72px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="md:grid-cols-2 grid-cols-1">
        <div>
          <span className="mono-label" style={{ color: "var(--color-pp-700)" }}>
            Cartografía
          </span>
          <h2 style={{ margin: "8px 0 12px", font: "600 30px var(--font-sans)", letterSpacing: "-0.025em" }}>
            Catastro de León vivo y consultable.
          </h2>
          <p style={{ margin: "0 0 24px", color: "var(--fg-muted)", fontSize: 15, lineHeight: 1.6 }}>
            45,736 placemarks unificados. Tramos de vialidad con valor por metro. Lotes con
            geometría, frente, fondo y uso de suelo. Búsqueda por colonia, sector o vialidad
            con autocompletado en 220ms.
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Colonias geocodificadas con valor 2025/2026",
              "Tramos de vialidad para zonas comerciales",
              "Lotes con dimensiones reales del catastro",
              "Heatmaps por valor fiscal y comercial (próximo)",
            ].map((t) => (
              <li key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--fg)" }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    background: "var(--accent-soft)",
                    color: "var(--color-pp-700)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    marginTop: 1,
                  }}
                >
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            background: "var(--color-ink-900)",
            color: "#fff",
            borderRadius: 16,
            padding: 28,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background:
                "linear-gradient(90deg, var(--color-pp-700) 0%, var(--color-pp-500) 50%, var(--color-pp-300) 100%)",
            }}
          />
          <span className="mono-label" style={{ color: "rgba(255,255,255,0.55)" }}>
            Datos en producción
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 18 }}>
            {[
              ["1,507", "colonias"],
              ["1,383", "sectores"],
              ["541,791", "predios"],
              ["851", "tramos con valor"],
              ["97%", "match catastro/excel"],
              ["6", "fuentes BIMSA/VARELA"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="num" style={{ font: "600 24px var(--font-sans)", letterSpacing: "-0.025em" }}>
                  {v}
                </div>
                <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Family Office",
      price: "$2,900",
      period: "MXN / mes",
      desc: "Hasta 25 propiedades. 3 usuarios.",
      cta: "Empezar",
      featured: false,
    },
    {
      name: "Operador",
      price: "$7,400",
      period: "MXN / mes",
      desc: "Hasta 120 propiedades. 8 usuarios. Roles.",
      cta: "Solicitar acceso",
      featured: true,
    },
    {
      name: "Institucional",
      price: "A medida",
      period: "",
      desc: "Sin límite. SSO, audit log, integración INEGI.",
      cta: "Contactar",
      featured: false,
    },
  ];

  return (
    <section id="precios" style={{ padding: "72px 32px", background: "var(--bg-muted)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <span className="mono-label">Precios</span>
        <h2 style={{ margin: "8px 0 12px", font: "600 30px var(--font-sans)", letterSpacing: "-0.025em" }}>
          Por portafolio, no por propiedad.
        </h2>
        <p style={{ margin: "0 auto 40px", maxWidth: 540, color: "var(--fg-muted)", fontSize: 15, lineHeight: 1.55 }}>
          Precios indicativos. La cuota se ajusta al volumen real al cerrar el alta.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            textAlign: "left",
          }}
        >
          {tiers.map((t) => (
            <div
              key={t.name}
              style={{
                background: t.featured ? "var(--color-ink-900)" : "var(--bg)",
                color: t.featured ? "#fff" : "var(--fg)",
                border: t.featured ? "none" : "1px solid var(--border)",
                borderRadius: 16,
                padding: 24,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {t.featured && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: "0 0 auto 0",
                    height: 3,
                    background:
                      "linear-gradient(90deg, var(--color-pp-700) 0%, var(--color-pp-500) 50%, var(--color-pp-300) 100%)",
                  }}
                />
              )}
              <span
                className="mono-label"
                style={{ color: t.featured ? "rgba(255,255,255,0.6)" : "var(--fg-muted)" }}
              >
                {t.name}
              </span>
              <div>
                <span
                  className="num"
                  style={{
                    font: "600 32px var(--font-sans)",
                    letterSpacing: "-0.025em",
                    color: t.featured ? "#fff" : "var(--fg)",
                  }}
                >
                  {t.price}
                </span>
                {t.period && (
                  <span style={{ marginLeft: 6, fontSize: 13, color: t.featured ? "rgba(255,255,255,0.55)" : "var(--fg-muted)" }}>
                    {t.period}
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 13, color: t.featured ? "rgba(255,255,255,0.8)" : "var(--fg-muted)", lineHeight: 1.5 }}>
                {t.desc}
              </p>
              <Link
                href="/signup"
                style={{
                  marginTop: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 38,
                  borderRadius: 8,
                  background: t.featured ? "var(--color-pp-500)" : "var(--bg-muted)",
                  color: t.featured ? "#fff" : "var(--fg)",
                  border: t.featured ? "none" : "1px solid var(--border-strong)",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {t.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section style={{ padding: "72px 32px" }}>
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          background:
            "linear-gradient(135deg, var(--color-pp-700) 0%, var(--color-pp-500) 100%)",
          borderRadius: 20,
          padding: "48px 40px",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{ margin: "0 0 8px", font: "600 26px var(--font-sans)", letterSpacing: "-0.025em" }}>
            ¿Listo para mapear tu portafolio?
          </h3>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 1.55, maxWidth: 480 }}>
            Acceso por invitación. Te activamos un workspace en 24h con tus propiedades iniciales cargadas.
          </p>
        </div>
        <Link
          href="/signup"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            height: 44,
            padding: "0 22px",
            borderRadius: 10,
            background: "#fff",
            color: "var(--color-pp-700)",
            fontSize: 15,
            fontWeight: 500,
            textDecoration: "none",
            boxShadow: "var(--shadow-md)",
          }}
        >
          Solicitar acceso →
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        padding: "40px 32px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-muted)",
        color: "var(--fg-muted)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ font: "600 16px var(--font-sans)", color: "var(--color-pp-700)", letterSpacing: "-0.015em" }}>
            propaily
          </span>
          <span className="endoso">BY GF CONSULTORÍA · LEÓN · CDMX</span>
        </div>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          © 2026 · v0.1
        </div>
      </div>
    </footer>
  );
}
