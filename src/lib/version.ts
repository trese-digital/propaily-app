// Versión visible de Propaily. Se muestra en el header, al lado del nombre.
//
// REGLA: cada vez que se hace `git push` + deploy, se agrega una entrada nueva
// al inicio del CHANGELOG con el número de versión y el comentario de lo que se
// hizo. `APP_VERSION` siempre toma la entrada más reciente. Así queda el orden.
export const CHANGELOG = [
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
