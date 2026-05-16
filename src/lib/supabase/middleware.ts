/**
 * Middleware: refresca la sesión de Supabase en cada request, aplica el ruteo
 * por host (split de dominios) y protege las rutas que requieren sesión.
 *
 * Ruteo por host (ver `lib/domains.ts`):
 *   propaily.com        → marketing  · la raíz se reescribe a /welcome
 *   app.propaily.com    → portal cliente · la raíz es el dashboard
 *   admin.propaily.com  → backoffice GF · la raíz se reescribe a /admin
 *   localhost / IP      → "dev": SIN ruteo por host, todo accesible por path
 *
 * Las rutas que no pertenecen al host se redirigen al subdominio correcto.
 * `/login`, `/signup`, `/auth/*` y `/api/*` son compartidas (válidas en todos).
 *
 * La validación de rol (staff GF) NO vive aquí — está en `admin/layout.tsx`,
 * que es Server Component y tiene acceso a Prisma. El middleware sólo cuida
 * que un usuario sin sesión no vea HTML protegido.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_ORIGIN,
  APP_ORIGIN,
  MARKETING_ORIGIN,
  SESSION_COOKIE_DOMAIN,
  type HostArea,
  type PathOwner,
  isProdHost,
  pathOwner,
  resolveHostArea,
} from "@/lib/domains";

const PUBLIC_PATHS = [
  "/welcome",
  "/login",
  "/signup",
  "/auth/callback",
  "/auth/confirm",
  "/api/health",
  // Assets de PWA — el navegador los pide sin sesión.
  "/sw.js",
  "/manifest.webmanifest",
  // PWA mobile (`/m/*`) — Fase 1: las 21 pantallas son UI con datos del
  // Portafolio Demo, navegables sin sesión. La Fase 2 protegerá las rutas
  // autenticadas (todo salvo splash / onboarding / login).
  "/m",
];

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)))
    return true;
  if (pathname.startsWith("/_next/") || pathname === "/favicon.ico") return true;
  return false;
}

/**
 * Destino cross-host: si el path no pertenece al host actual, devuelve la URL
 * absoluta del subdominio correcto. `null` = el path se sirve en este host.
 *
 * La raíz "/" nunca se redirige (cada host la reescribe a su propia home).
 */
function crossHostTarget(
  area: HostArea,
  owner: PathOwner,
  pathname: string,
  search: string,
): string | null {
  const path = pathname + search;

  // La autenticación vive en el portal, no en la web de marketing: un
  // /login o /signup en propaily.com se manda a app.propaily.com.
  if (area === "marketing" && (pathname === "/login" || pathname === "/signup")) {
    return APP_ORIGIN + path;
  }

  if (owner === "shared" || pathname === "/") return null;

  if (area === "marketing") {
    if (owner === "app") return APP_ORIGIN + path;
    if (owner === "admin") return ADMIN_ORIGIN + path;
  }
  if (area === "app") {
    if (owner === "admin") return ADMIN_ORIGIN + path;
    if (owner === "marketing") return MARKETING_ORIGIN + path;
  }
  if (area === "admin") {
    if (owner === "app") return APP_ORIGIN + path;
    if (owner === "marketing") return MARKETING_ORIGIN + path;
  }
  return null;
}

/** Copia las cookies de sesión refrescadas a una respuesta de redirect/rewrite. */
function carryCookies(from: NextResponse, to: NextResponse): NextResponse {
  from.cookies.getAll().forEach((c) => to.cookies.set(c));
  return to;
}

export async function updateSession(request: NextRequest) {
  const host = request.headers.get("host");
  const cookieDomain = isProdHost(host) ? SESSION_COOKIE_DOMAIN : undefined;

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          // La cookie de sesión se comparte entre los tres subdominios
          // (`Domain=.propaily.com`) para que el login valga en los tres.
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, {
              ...options,
              ...(cookieDomain ? { domain: cookieDomain } : {}),
            }),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const area = resolveHostArea(host);
  const { pathname, search } = request.nextUrl;
  const owner = pathOwner(pathname);

  // ── 1. Ruteo por host: redirigir lo que no pertenece a este host ──────────
  if (area !== "dev") {
    const target = crossHostTarget(area, owner, pathname, search);
    if (target) return carryCookies(response, NextResponse.redirect(target));
  }

  // ── 1.5 Entrada móvil: los teléfonos entran a la PWA `/m` ─────────────────
  // En el portal (`app`) y en dev, un user-agent móvil que llega a la raíz o
  // al login de escritorio se manda a `/m` — así el icono de la PWA instalada
  // (`start_url:"/"`) y la URL escrita abren la app móvil, no el escritorio.
  // Solo redirige los puntos de entrada; el resto del escritorio sigue
  // accesible por URL directa.
  const ua = request.headers.get("user-agent") ?? "";
  const isMobileUA = /Android|iPhone|iPod|iPad|Mobile|Windows Phone/i.test(ua);
  if (
    request.method === "GET" &&
    (area === "app" || area === "dev") &&
    isMobileUA &&
    !pathname.startsWith("/m")
  ) {
    let mobileTarget: string | null = null;
    if (pathname === "/") mobileTarget = user ? "/m/inicio" : "/m";
    else if (pathname === "/login" || pathname === "/signup")
      mobileTarget = user ? "/m/inicio" : "/m/login";
    if (mobileTarget) {
      const url = request.nextUrl.clone();
      url.pathname = mobileTarget;
      url.search = "";
      return carryCookies(response, NextResponse.redirect(url));
    }
  }

  // ── 2. Path efectivo: la raíz de marketing/admin se reescribe ─────────────
  let effective = pathname;
  if (area === "marketing" && pathname === "/") effective = "/welcome";
  if (area === "admin" && pathname === "/") effective = "/admin";

  // ── 3. Gating de sesión ───────────────────────────────────────────────────
  // Todo host salvo marketing exige sesión; además `/api/*` SIEMPRE pasa por
  // el gate (defensa en profundidad sobre el check propio de cada handler).
  const guarded = area !== "marketing" || pathname.startsWith("/api/");
  if (!user && guarded && !isPublic(effective)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Sesión requerida" } },
        { status: 401 },
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    if (effective !== "/" && effective !== "/login") {
      url.searchParams.set("from", effective);
    }
    return carryCookies(response, NextResponse.redirect(url));
  }

  // Usuario ya logueado que cae en login/signup → a la home de su host.
  if (user && (effective === "/login" || effective === "/signup")) {
    const url = request.nextUrl.clone();
    url.search = "";
    url.pathname = area === "admin" ? "/admin" : "/";
    return carryCookies(response, NextResponse.redirect(url));
  }

  // ── 4. Aplicar rewrite de raíz si corresponde ─────────────────────────────
  if (effective !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = effective;
    return carryCookies(response, NextResponse.rewrite(url, { request }));
  }

  return response;
}
