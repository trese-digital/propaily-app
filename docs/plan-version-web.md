# Plan — Consolidación de la versión web (escritorio)

> Objetivo: que **todas las páginas de la versión web** (`app.propaily.com`,
> portal de escritorio) estén **conectadas** (toda navegación lleva a algún
> lado) y con **información sólida** (datos reales, sin placeholders ni mocks).
> Referencia de diseño: `inbox/propaily pwa deskopt/` (handoff v0.1, 15 may 2026).
>
> Estado: **Fases 1-5 completadas (V1.10-V1.14).** Última actualización: 2026-05-16.

---

## 1. Inventario de rutas

| Ruta | Existe | Conectada | Datos | Diseño en handoff |
|---|---|---|---|---|
| `/` dashboard | ✅ | ✅ home | reales · **mapa falso → #3** | `dashboard.jsx` |
| `/propiedades` | ✅ | ⚠️ **#2** | reales | `propiedades.jsx` |
| `/propiedades/nueva` | ✅ | ✅ botón | form real | — |
| `/propiedades/[id]` | ✅ | ✅ card | reales | `propiedad-detalle.jsx` (2 variantes) |
| `/propiedades/[id]/editar` | ✅ | ✅ botón | form real | — |
| `/rentas` | ✅ | ✅ rail | reales | `rentas-lista.jsx` |
| `/rentas/calendario` | ✅ | ✅ link | reales | `rentas-calendario.jsx` |
| `/rentas/nuevo` | ✅ | ✅ botón | form real | — |
| `/rentas/[id]` | ✅ | ✅ click | reales | `rentas-detalle.jsx` |
| `/clientes` · `/clientes/[id]` | ✅ | ✅ rail | reales | `clientes.jsx` |
| `/valuaciones` | ✅ | ✅ rail | reales | `valuaciones.jsx` |
| `/usuarios` | ✅ | ✅ rail | reales | `usuarios.jsx` |
| `/cartografia` | ✅ (addon) | ✅ rail | PostGIS + Google Maps | `cartografia.jsx` |
| `/welcome` | ✅ | landing | marketing | — |
| `(auth)/login` · `/signup` | ✅ | — | — | screens de auth |
| `/admin` · `/admin/tenants(+[id])` · `/admin/avaluos` · `/admin/cartografia` · `/admin/auditoria` | ✅ | ✅ nav admin | reales | — |
| **`/mantenimiento`** | ❌ | rail `disabled` "· pronto" | — | `mantenimiento.jsx` (kanban) |
| **`/avisos`** (notificaciones desktop) | ❌ | sin entrada | — | `notificaciones.jsx` |
| **`/suscripcion`** (plan del cliente) | ❌ | sin entrada | — | `suscripcion.jsx` |

---

## 2. Bugs reportados (Fase 1)

### #2 — El ícono "Propiedades" no lleva
- **Diagnóstico:** en el código el ítem del rail (`app-rail-items.tsx`) y la
  página `(client)/propiedades/page.tsx` están **correctos**: el `<Link>`
  apunta a `/propiedades` y la página compila y consulta datos reales. No hay
  bug en el escritorio a nivel de código.
- **Causa real:** en la **PWA móvil**, el tab "Propiedades" apuntaba a
  `/m/inicio` (no existía pantalla de listado móvil) → "no te lleva".
- **Fix:** nueva pantalla `/m/propiedades` (listado móvil) + el tab apunta ahí.
- Si el fallo es en el escritorio, hace falta reproducirlo en runtime con el
  síntoma exacto (no pasa nada / error / pantalla en blanco).

### #3 — Mapa falso en el dashboard
- **Causa:** `(client)/page.tsx` renderiza `MapPreview`, un SVG decorativo.
- **Fix:** componente cliente `PortfolioMap` con Google Maps JS API
  (`@googlemaps/js-api-loader`, key `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) que
  coloca un marcador por cada propiedad con `latitude`/`longitude`. Si ninguna
  tiene coordenadas, centra en León. Reusa el patrón de `cartografia/MapClient`.

### #4 — Invitación con enlace expirado / roto
- **Síntoma:** el correo de invitación lleva a
  `propaily.com/#error=access_denied&error_code=otp_expired`.
- **Causas:**
  1. `inviteUserByEmail` se llama **sin `redirectTo`** → Supabase usa la Site
     URL por defecto (cae en `propaily.com`, no en el portal).
  2. **No existe la ruta `/auth/callback`** (el middleware la declara pública
     pero no hay handler) → no se intercambia el `code` por sesión.
  3. `otp_expired` = el enlace caducó antes de usarse.
- **Fix (código):** crear `src/app/auth/callback/route.ts` (intercambio
  `code`→sesión) y pasar `redirectTo: app.propaily.com/auth/callback` en la
  invitación.
- **Fix (config del usuario, en Supabase):** Site URL = `https://app.propaily.com`
  y agregar `https://app.propaily.com/auth/callback` a la allowlist de Redirect
  URLs. Sin esto Supabase rechaza el redirect.

---

## 3. Fases

**Fase 1 — Bugs y conexiones rotas** *(en curso)*
- Arreglar #2, #3, #4.

**Fase 2 — Auditoría "información sólida"**
- Recorrer cada ruta del inventario: datos reales, estados vacío/carga/error,
  toda acción conecta. Cerrar placeholders ("Insights · próximamente", textos
  demo, mapas/figuras falsas restantes).

**Fase 3 — Módulos faltantes**
- `/mantenimiento` (kanban), `/avisos` (notificaciones desktop), `/suscripcion`
  (plan + billing del cliente; hoy solo existe el lado GF en `/admin/tenants`).

**Fase 4 — Re-skin con el handoff**
- Aplicar `Propaily Plataforma.html` y los componentes de
  `inbox/propaily pwa deskopt/components/` a los módulos existentes.

**Fase 5 — PWA desktop**
- Las 18 pantallas del `Propaily Desktop Flow` (instalación, Window Controls
  Overlay, atajos de teclado) — equivalente desktop de la PWA móvil.

---

## 4. Progreso

- ✅ **Fase 1 (2026-05-16, V1.10)** — los 3 bugs:
  - #2 → nueva pantalla `/m/propiedades` + el tab móvil apunta ahí. El rail de
    escritorio estaba correcto (sin cambios).
  - #3 → `components/portfolio-map.tsx` (Google Maps real) reemplaza el SVG
    falso del dashboard; un marcador por propiedad geolocalizada.
  - #4 → ruta `src/app/auth/callback/route.ts` + `redirectTo` en la invitación.
    **Falta config del usuario en Supabase:** Site URL = `https://app.propaily.com`
    y agregar `https://app.propaily.com/auth/callback` a Redirect URLs.
- ✅ **Fase 2 (2026-05-16, V1.11)** — información sólida:
  - `loading.tsx` / `error.tsx` en `(client)` (skeletons + error boundary) y
    `not-found.tsx` global → estados de carga/error/404 para todo el portal.
  - Dashboard: el placeholder "Insights · próximamente" se reemplazó por la
    tarjeta "Requiere atención" con datos reales (pagos vencidos, contratos por
    vencer en 60 d, solicitudes de avalúo abiertas).
  - TopBar: el buscador falso ⌘K ahora es un Link real a `/propiedades`.
- ✅ **Fase 3 (2026-05-16, V1.12)** — módulos faltantes. Los modelos Prisma
  (`MaintenanceRequest`, `Notification`, `Subscription`) ya existían con RLS:
  - `/mantenimiento` — tablero kanban por estado (5 columnas), KPIs, modal de
    nueva solicitud, cambio de estado. Server: `server/maintenance/actions.ts`.
  - `/avisos` — centro de notificaciones del usuario + campana con badge de no
    leídos en el TopBar. Server: `server/notifications/{data,actions}.ts`.
  - `/suscripcion` — vista read-only del plan, uso vs límite y addons. Sin
    Stripe (lo administra GF). Server: `server/billing/subscription.ts`.
  - Rail: Mantenimiento y Suscripción habilitados.
- ✅ **Fase 4 (2026-05-16, V1.13)** — re-skin. Los tokens del handoff ya
  estaban aplicados en `globals.css`; el único módulo fuera del sistema era
  `/propiedades` (~43 estilos inline) → migrado a `Card`/`Badge`/`Segmented`/
  `EmptyState`. **Pendiente:** la página de detalle `propiedades/[id]/*` aún
  usa estilos inline (funciona y consume tokens; re-skin diferido).
- ✅ **Fase 5 (2026-05-16, V1.14)** — PWA desktop (capa PWA; las pantallas del
  portal ya existían). Alcance: convertir el portal de escritorio en una app
  instalable, sin reconstruir pantallas.
  - Manifest: `display_override: [window-controls-overlay, standalone]`.
  - `components/pwa/desktop-titlebar.tsx` — barra de título propia con
    Window Controls Overlay (`env(titlebar-area-*)`, zona de arrastre);
    visible solo en `display-mode: window-controls-overlay`.
  - `components/pwa/keyboard-shortcuts.tsx` — atajos `⌘1/⌘2/⌘3` (Inicio /
    Propiedades / Rentas), `⌘K` (búsqueda) y `⌘,` (Suscripción); inertes
    cuando el foco está en un campo de texto.
  - `components/pwa/install-prompt.tsx` — captura `beforeinstallprompt` y
    ofrece instalar a partir de la 2ª visita; descartable.
  - `components/pwa/connection-status.tsx` — tira de offline con reintentar.
  - `service-worker-register.tsx` + `sw.js` — actualización controlada por
    el usuario: el SW nuevo espera (`SKIP_WAITING` por mensaje) y un banner
    ofrece "Actualizar".
  - `AppShell` monta los componentes y desplaza el layout con
    `env(titlebar-area-height)` cuando corre en modo overlay.
- ⏭️ Siguiente: re-skin de `propiedades/[id]`, o pendientes del spec desktop
  fuera de alcance de esta fase (command palette `⌘K`, onboarding/splash).
