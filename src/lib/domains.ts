/**
 * Ruteo por host — Propaily vive en una sola app Next servida en tres hosts:
 *
 *   propaily.com        → sitio web / marketing
 *   app.propaily.com    → portal del cliente
 *   admin.propaily.com  → backoffice GF
 *
 * El middleware (`lib/supabase/middleware.ts`) usa estos helpers para reescribir
 * la raíz de cada host y redirigir las rutas que no le pertenecen al subdominio
 * correcto. En desarrollo (`localhost`, IP) el área es `"dev"` y NO se aplica
 * ruteo por host: todo sigue accesible por path, como antes del split.
 */

export const ROOT_DOMAIN = "propaily.com";

export const MARKETING_ORIGIN = `https://${ROOT_DOMAIN}`;
export const APP_ORIGIN = `https://app.${ROOT_DOMAIN}`;
export const ADMIN_ORIGIN = `https://admin.${ROOT_DOMAIN}`;

/** Dominio de la cookie de sesión: compartida entre los tres subdominios. */
export const SESSION_COOKIE_DOMAIN = `.${ROOT_DOMAIN}`;

/** Área servida según el host del request. */
export type HostArea = "marketing" | "app" | "admin" | "dev";

function bareHost(host: string | null | undefined): string {
  return (host ?? "").split(":")[0].toLowerCase();
}

/**
 * Resuelve el área a partir del host.
 * Hosts no productivos (localhost, IP, previews) → `"dev"`: sin ruteo por host.
 */
export function resolveHostArea(host: string | null | undefined): HostArea {
  const h = bareHost(host);
  if (h === `admin.${ROOT_DOMAIN}`) return "admin";
  if (h === `app.${ROOT_DOMAIN}`) return "app";
  if (h === ROOT_DOMAIN || h === `www.${ROOT_DOMAIN}`) return "marketing";
  return "dev";
}

/** ¿El host es uno de los de producción bajo `propaily.com`? */
export function isProdHost(host: string | null | undefined): boolean {
  const h = bareHost(host);
  return h === ROOT_DOMAIN || h.endsWith(`.${ROOT_DOMAIN}`);
}

/**
 * Área "dueña" de un path. Determina, junto con el área del host, si una
 * petición se sirve aquí o se redirige a otro subdominio.
 *  - `admin`   → `/admin`, `/admin/*`
 *  - `marketing` → `/welcome`
 *  - `shared`  → `/login`, `/signup`, `/auth/*`, `/api/*` (válido en todo host)
 *  - `app`     → todo lo demás (dashboard, propiedades, rentas, …)
 */
export type PathOwner = "admin" | "marketing" | "shared" | "app";

export function pathOwner(pathname: string): PathOwner {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  if (pathname === "/welcome" || pathname.startsWith("/welcome/")) return "marketing";
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/")
  ) {
    return "shared";
  }
  return "app";
}
