// Versión visible de Propaily. Se muestra en el header, al lado del nombre.
//
// REGLA: cada vez que se hace `git push` + deploy, se agrega una entrada nueva
// al inicio del CHANGELOG con el número de versión y el comentario de lo que se
// hizo. `APP_VERSION` siempre toma la entrada más reciente. Así queda el orden.
export const CHANGELOG = [
  {
    version: "1.14",
    date: "2026-05-16",
    summary:
      "Fase 5 web — PWA de escritorio: titlebar Window Controls Overlay, atajos de teclado (⌘1/2/3/K/,), banner de instalación, banner de actualización y tira de offline",
  },
  {
    version: "1.13",
    date: "2026-05-16",
    summary:
      "Fase 4 web — re-skin: /propiedades migrado a los componentes del sistema de diseño (Card, Badge, Segmented, EmptyState), consistente con el resto del portal",
  },
  {
    version: "1.12",
    date: "2026-05-16",
    summary:
      "Fase 3 web — módulos faltantes: /mantenimiento (tablero kanban), /avisos (centro de notificaciones con campana en el header), /suscripcion (plan, uso y addons en sólo lectura)",
  },
  {
    version: "1.11",
    date: "2026-05-16",
    summary:
      "Fase 2 web — estados de carga/error/404, dashboard con pendientes reales (pagos vencidos, contratos por vencer), búsqueda conectada",
  },
  {
    version: "1.10",
    date: "2026-05-16",
    summary:
      "Fase 1 web — mapa real en dashboard, /auth/callback (invitaciones), listado de propiedades móvil",
  },
  {
    version: "1.9",
    date: "2026-05-16",
    summary:
      "PWA mobile Fase 2a — pantallas owner/operador con datos reales + /m protegido",
  },
  {
    version: "1.8",
    date: "2026-05-16",
    summary:
      "PWA mobile — detección de móvil: teléfonos entran directo a /m",
  },
  {
    version: "1.7",
    date: "2026-05-15",
    summary:
      "PWA mobile — 21 pantallas de app.propaily.com (/m) + Portafolio Demo",
  },
  {
    version: "1.6",
    date: "2026-05-15",
    summary: "S7 — backoffice de cuentas/suscripciones + visor de auditoría",
  },
  {
    version: "1.5",
    date: "2026-05-15",
    summary: "PWA instalable + captcha Turnstile en login y registro",
  },
  {
    version: "1.4",
    date: "2026-05-15",
    summary:
      "Split de dominios — app.propaily.com (portal) y admin.propaily.com (backoffice)",
  },
  {
    version: "1.3",
    date: "2026-05-15",
    summary: "S6 — Valuaciones + gestión de usuarios y permisos (cierra Bloque 1)",
  },
  {
    version: "1.2",
    date: "2026-05-15",
    summary: "Mostrar versión de la app en el header",
  },
] as const;

export const APP_VERSION = CHANGELOG[0].version;
