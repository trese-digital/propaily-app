"use client";

/** 01 · Splash — arranque en frío de la PWA (MFlowSplash del handoff). */
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PropailyMark } from "@/components/mobile/mark";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => router.push("/m/onboarding"), reduce ? 300 : 1800);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background:
          "linear-gradient(160deg, var(--pp-500) 0%, var(--pp-800) 70%, var(--ink-900) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: -80,
          right: -60,
          width: 280,
          height: 280,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
        }}
      />
      <span
        style={{
          position: "absolute",
          bottom: -120,
          left: -60,
          width: 240,
          height: 240,
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
        }}
      />

      <PropailyMark size={84} bg="#fff" fg="var(--pp-600)" radius={20} />
      <div
        style={{
          marginTop: 22,
          font: "600 28px var(--font-sans)",
          letterSpacing: "-0.025em",
        }}
      >
        propaily
      </div>
      <div
        className="mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: 0.7,
          marginTop: 4,
        }}
      >
        by GF Consultoría
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 90,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          data-anim
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            border: "2.5px solid rgba(255,255,255,0.25)",
            borderTopColor: "#fff",
            animation: "pp-spin 1s linear infinite",
          }}
        />
        <span
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            opacity: 0.65,
            textTransform: "uppercase",
          }}
        >
          Sincronizando portafolio
        </span>
      </div>
    </div>
  );
}
