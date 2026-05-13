import { NextResponse } from "next/server";

// Liviano: NO consulta la DB. Solo confirma que el proceso de Node responde.
// Lo usan: Docker HEALTHCHECK, nginx upstream check, monitoreo externo.
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({ ok: true, service: "propaily", ts: new Date().toISOString() });
}
