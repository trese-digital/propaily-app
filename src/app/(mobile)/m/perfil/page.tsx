/** 21 · Perfil & cambio de rol (MFlowPerfil del handoff). */
import type { Route } from "next";
import Link from "next/link";

import { mobileLogout } from "@/app/(mobile)/m/login/actions";
import {
  IcBell,
  IcBuilding,
  IcChart,
  IcCheck,
  IcChevR,
  IcDoc,
  IcDownload,
  IcKey,
  IcSettings,
  IcShield,
  IcSpark,
  IcUsers,
} from "@/components/icons";
import { MTabBar } from "@/components/mobile/nav";
import { Avatar, Dot, MCard, MSection } from "@/components/mobile/ui";
import { demoUser, roles, type Role } from "@/features/mobile/demo-data";
import { APP_VERSION } from "@/lib/version";

export const metadata = { title: "Perfil · Propaily" };

const ROLE_ICON = { owner: IcChart, tenant: IcKey, admin: IcBuilding } as const;
const ROLE_HOME: Record<Role, Route> = {
  owner: "/m/inicio",
  tenant: "/m/pago",
  admin: "/m/admin",
};

const ACCOUNT_ITEMS = [
  [IcUsers, "Información personal", null],
  [IcBell, "Notificaciones", "Push · email · WhatsApp"],
  [IcShield, "Seguridad", "Face ID activo"],
  [IcDownload, "Datos y privacidad", null],
] as const;

const APP_ITEMS = [
  [IcSpark, "Apariencia", "Sistema"],
  [IcSettings, "Idioma", "Español (MX)"],
  [IcDoc, "Términos y privacidad", null],
] as const;

export default function ProfileScreen() {
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
          padding: "var(--m-safe-top) 0 18px",
          background: "#fff",
          borderBottom: "1px solid var(--ink-100)",
          textAlign: "center",
        }}
      >
        <Avatar name={demoUser.name} size={72} tone="warn" />
        <h1
          style={{
            margin: "12px 0 2px",
            font: "600 18px var(--font-sans)",
            letterSpacing: "-0.015em",
          }}
        >
          {demoUser.name}
        </h1>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-500)" }}>
          {demoUser.email}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 10,
            padding: "4px 10px",
            borderRadius: 999,
            background: "var(--pp-50)",
          }}
        >
          <Dot tone="violet" size={6} />
          <span
            style={{ fontSize: 11, color: "var(--pp-700)", fontWeight: 600 }}
          >
            Viendo como · Propietario
          </span>
        </div>
      </div>

      {/* Cambiar de rol */}
      <MSection title="Cambiar de rol" style={{ paddingTop: 14 }}>
        <MCard style={{ padding: 0 }}>
          {roles.map((r, i) => {
            const Icon = ROLE_ICON[r.id];
            const active = r.id === "owner";
            return (
              <Link
                key={r.id}
                href={ROLE_HOME[r.id]}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 14px",
                  borderTop: i > 0 ? "1px solid var(--ink-100)" : "none",
                  background: active ? "var(--pp-50)" : "#fff",
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: active ? "var(--pp-500)" : "var(--ink-50)",
                    color: active ? "#fff" : "var(--ink-600)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "0 0 auto",
                  }}
                >
                  <Icon size={17} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      font: "600 13px var(--font-sans)",
                      color: active ? "var(--pp-700)" : "var(--ink-900)",
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: 10, color: "var(--ink-500)" }}
                  >
                    {r.detail}
                  </div>
                </div>
                {active ? (
                  <IcCheck size={16} style={{ color: "var(--pp-600)" }} />
                ) : (
                  <IcChevR size={14} style={{ color: "var(--ink-400)" }} />
                )}
              </Link>
            );
          })}
        </MCard>
      </MSection>

      <MSection title="Cuenta">
        <MCard style={{ padding: 0 }}>
          {ACCOUNT_ITEMS.map(([Icon, name, detail], i) => (
            <SettingRow key={name} Icon={Icon} name={name} detail={detail} first={i === 0} />
          ))}
        </MCard>
      </MSection>

      <MSection title="App">
        <MCard style={{ padding: 0 }}>
          {APP_ITEMS.map(([Icon, name, detail], i) => (
            <SettingRow key={name} Icon={Icon} name={name} detail={detail} first={i === 0} />
          ))}
        </MCard>
      </MSection>

      <div style={{ padding: "14px 18px 4px" }}>
        <form action={mobileLogout}>
          <button
            type="submit"
            style={{
              width: "100%",
              height: 46,
              borderRadius: 12,
              border: "1px solid var(--ink-200)",
              background: "#fff",
              color: "var(--bad)",
              font: "500 14px var(--font-sans)",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </form>
      </div>
      <div style={{ padding: "6px 18px 0", textAlign: "center" }}>
        <span
          className="mono"
          style={{ fontSize: 9, color: "var(--ink-400)", letterSpacing: "0.1em" }}
        >
          propaily v{APP_VERSION} · móvil
        </span>
      </div>

      <MTabBar active={4} />
    </div>
  );
}

function SettingRow({
  Icon,
  name,
  detail,
  first,
}: {
  Icon: (p: { size?: number }) => React.ReactNode;
  name: string;
  detail: string | null;
  first: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderTop: first ? "none" : "1px solid var(--ink-100)",
      }}
    >
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: "var(--ink-50)",
          color: "var(--ink-600)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
        }}
      >
        <Icon size={15} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ font: "500 13px var(--font-sans)" }}>{name}</div>
        {detail && (
          <div
            className="mono"
            style={{ fontSize: 10, color: "var(--ink-500)" }}
          >
            {detail}
          </div>
        )}
      </div>
      <IcChevR size={13} style={{ color: "var(--ink-400)" }} />
    </div>
  );
}
