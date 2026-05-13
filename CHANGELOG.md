# Changelog · Propaily

Bitácora de cambios. Formato: cada entrada es una sesión con su fecha, las fases cerradas y los archivos clave tocados.

---

## 2026-05-13 — Sesión 7 · Nueva identidad Propaily (morado + Geist)

**Migración completa de identidad visual** — paquete `cartografia-gfc/propaily-handoff/` aplicado a toda la app Next.js.

**Foundation**
- `src/app/globals.css` reescrito sobre tokens del handoff: rampa purple (`--color-pp-50…950`), rampa ink (`--color-ink-0…900`), semánticos (`--color-ok/warn/bad/info`), roles `--bg / --fg / --accent / --border`, radios, sombras con tinte morado, motion. Dark mode preparado vía `[data-theme="dark"]`. Aliases legacy (`--color-navy`, `--color-teal`...) mapean a tokens nuevos para no romper componentes aún no refactorizados.
- `src/app/layout.tsx` carga `Geist` + `Geist_Mono` vía `next/font/google` y expone `--font-geist` / `--font-geist-mono`.
- `public/logo/` con 7 SVGs (wordmark violet/white/black, mark violet/white, app-icon, lockup-endorsed).
- `src/app/icon.svg` favicon con gradiente morado (Next.js auto-discover).
- Utilidades CSS nuevas: `.mono`, `.mono-tight`, `.mono-label`, `.num`, `.endoso`, `.watermark`, `.leaflet-tooltip.pp-tt`.

**Chrome**
- `src/components/app-rail.tsx`: rail compacto 56px (era 84px), isotipo P morado arriba, indicador vertical morado en el ítem activo, hover blanco-translúcido. Sin labels — solo íconos con tooltip.
- `src/components/app-shell.tsx`: topbar 56px con wordmark "propaily" morado + endoso GFC, search ⌘K placeholder, botón morado "Nueva propiedad", avatar circular con gradiente + botón Salir tipográfico.

**Pantallas**
- `src/app/(auth)/login/login.module.css` + `login/page.tsx` + `signup/page.tsx`: fondo con radial morado, card con tokens, endoso GFC bajo el card, input height 36 + radio 8.
- `src/app/(app)/page.tsx` (dashboard): saludo dinámico por hora, 4 KPIs (valor estimado, propiedades, documentos, renta), card mapa-preview con pins morados, accesos rápidos, tarjeta Insights teaser, propiedades recientes en grid (datos reales — no inventados).
- `src/app/(app)/propiedades/page.tsx`: header simplificado, filtros como chips morados (al activarse), botones nuevos (height 36 + accent), badges de status con dot + tono semántico, grid con cards de hover-elevation.
- `src/app/(app)/propiedades/[id]/page.tsx`: hero con cover + gradiente + status pill, grid principal/rail, panel catastral con mono-labels y `StatGrid`, side rail con `ValueCard` (negro top-accent morado), ubicación y equipo.
- `src/components/cartografia/Visor.tsx`: header oscuro con wordmark "propaily" + barra de accent morado, banner "modo vincular" como pill morada flotante, status bar con dot semáforo (verde idle / morado loading).
- `src/components/cartografia/Sidebar.tsx`: panel limpio con secciones tokens, leyenda con rampa morada (pp-100 → pp-700) en lugar de violet/cyan/lime.
- `src/components/cartografia/SearchBox.tsx`: input glass sobre fondo oscuro, dropdown con borders/tokens, badges de tipo (colonia/vialidad) en accent-soft / pp-700.

**Landing pública nueva**
- `src/app/welcome/page.tsx`: ruta pública con nav sticky-blur, hero con map-preview + inspector flotante + watermark, sección "Features" en grid, sección "Cartografía" con stats reales de cobertura, pricing 3-tier (uno en card oscura con accent), CTA en gradiente morado, footer con endoso.
- `src/lib/supabase/middleware.ts`: `/welcome` añadido a `PUBLIC_PATHS`. Visitantes sin sesión que aterrizan en `/` ahora se redirigen a `/welcome` (antes iban a `/login`).

**Validación**
- `npm run typecheck` limpio.
- HTTP 200 OK en: `/welcome`, `/login`, `/signup`, `/`, `/propiedades`, `/propiedades/:id`, `/cartografia`.
- Screenshots manuales de cada ruta verificados (Playwright 1440×900): tokens aplicados, fonts Geist activas, mapa con tiles correctos, propiedad detalle con datos reales.

**Pendiente conscientemente fuera de scope**
- `Inspector.tsx` del visor: usa aliases legacy (`bg-navy`, `text-teal`...) que ya mapean a tokens nuevos. Funciona, pero conviene refactor directo en sesión siguiente.
- Componentes `cover-photo.tsx`, `photo-gallery.tsx`, `units-section.tsx`, `documents-section.tsx`: idem. Vía aliases CSS.
- Sistema de watermark dinámico sobre exports (timestamp + email + IP en diagonal): solo visible en el mock del landing por ahora. Se aplicará cuando se construyan los flows de export.

**Archivos clave**
- `src/app/globals.css` · `src/app/layout.tsx` · `src/app/icon.svg`
- `src/components/app-rail.tsx` · `src/components/app-shell.tsx`
- `src/app/(auth)/login/page.tsx` · `signup/page.tsx` · `login/login.module.css`
- `src/app/(app)/page.tsx` · `propiedades/page.tsx` · `propiedades/[id]/page.tsx`
- `src/app/(app)/propiedades/filters-bar.tsx` · `view-toggle.tsx`
- `src/components/cartografia/Visor.tsx` · `Sidebar.tsx` · `SearchBox.tsx`
- `src/app/welcome/page.tsx` (nuevo) · `src/lib/supabase/middleware.ts`
- `public/logo/*.svg` (7 SVGs nuevos)

---

## 2026-05-13 — Sesión 6 · Filtros + vista lista + stats de colonia

**P2 — UX consistencia (cierra)**
- **#6 Filtros en listado de propiedades**: tres `<select>` (ciudad / tipo / estatus operativo) sincronizados con `searchParams`. Lista de ciudades disponibles se calcula `distinct` sobre el scope del usuario y no se reduce al aplicar otros filtros. Botón "Limpiar filtros" cuando hay alguno activo. Contador inteligente: "X de Y" cuando filtra, "X en total" cuando no.
- **#7 Toggle grid / lista**: dos vistas, persistencia por cookie (`gfc.propiedades.view`, 1 año). Vista lista con cabecera tipo tabla, foto miniatura 64px, columnas nombre/cliente/tipo/ciudad/estatus/valor.

**P2 — Cartografía con más info (#12 parcial)**
- Nuevo endpoint `GET /api/cartografia/colonias/[id]/stats` → nº de lotes, lote típico (mediana), lote promedio, rango min–max, nº de propiedades de Propaily vinculadas.
- `Inspector` (panel colonia) consume el endpoint con `useEffect` lazy: cancela fetch si cambia la selección. Muestra estado "Calculando…" / error.
- **Pendiente del #12**: servicios cercanos (escuelas, salud, áreas verdes) requiere integrar capas DENUE/INEGI primero — fuera de scope de esta sesión.

**Archivos clave**
- `src/app/(app)/propiedades/page.tsx` — refactor con server-side filters + cookie + GridView/ListView.
- `src/app/(app)/propiedades/filters-bar.tsx` — nuevo (client).
- `src/app/(app)/propiedades/view-toggle.tsx` — nuevo (client).
- `src/app/(app)/propiedades/view-actions.ts` — nuevo (server action).
- `src/app/(app)/propiedades/view-config.ts` — constantes/types compartidos (separado de actions porque "use server" sólo permite async exports).
- `src/app/api/cartografia/colonias/[id]/stats/route.ts` — nuevo endpoint.
- `src/components/cartografia/Inspector.tsx` — panel colonia con sección "Lotes en la colonia".

**Validación**
- `npm run build` limpio (13 rutas, +1 nueva).
- TypeScript OK.

---

## 2026-05-13 — Sesión 5 · Nav lateral consistente (#9)

**Refactor de shell (P2)**
- **#9 Rail vertical fijo en toda la app**: `AppHeader` (top bar horizontal con tabs) sustituido por `AppShell` (rail vertical 84px + top bar simplificado). Mismo lenguaje visual del visor de cartografía aplicado a todas las pantallas.
- Rail extraído a `src/components/app-rail.tsx` y compartido entre `AppShell` y el `Visor` cartográfico — una sola fuente de verdad para íconos, items y estado activo.
- Activo del rail se deriva automáticamente de `usePathname()`; `Visor` lo sobreescribe con `activeId="cartografia"`.
- `(app)/layout.tsx` nuevo: llama `requireContext()` una sola vez por request y envuelve los children en `AppShell`. Las pages dejan de importar `AppHeader` y `logout`.
- `/cartografia` movido a route group `(visor)/cartografia` para no heredar el shell genérico (mantiene su propio grid fullscreen con sidebar + inspector + status bar).

**Archivos clave**
- `src/components/app-rail.tsx` — nuevo, exporta `AppRail`, `RailIcons`, `APP_RAIL_ITEMS`, `APP_RAIL_WIDTH`.
- `src/components/app-shell.tsx` — nuevo, server component.
- `src/app/(app)/layout.tsx` — nuevo.
- `src/app/(visor)/cartografia/page.tsx` — movido desde `(app)/cartografia/`.
- `src/components/cartografia/Visor.tsx` — usa el rail compartido.
- `src/components/cartografia/Rail.tsx` — eliminado.
- `src/components/app-header.tsx` — eliminado.
- 5 pages bajo `(app)/`: removida prop `AppHeader` y `<main>` exterior; el shell los provee.

**Validación**
- `npm run build` pasa limpio (TypeScript OK, 12 rutas generadas, mismas URLs públicas).
- `/`, `/propiedades`, `/cartografia` responden 307 → `/login` sin sesión (correcto).
- Pendiente verificación visual en navegador autenticado.

---

## 2026-05-13 — Sesión 4 · UX cleanup + multi-upload + vínculo bidireccional

**Bugs cerrados (P0)**
- **#4 Documentos**: el form se cerraba después de la primera subida. Ahora se queda abierto, se resetean los inputs por `state.ts`, muestra "✓ Subido. Puedes subir otro o cerrar".
- **#4b Documentos**: edición inline de metadata (nombre, categoría, sensibilidad). Action `editDocument` con validación Zod.
- **#3 Unidades**: agregada `editarUnidad` + UI de edición inline. Form reutilizable `UnitFields` para crear y editar.

**Features (P1)**
- **#1 Multi-foto**: input `multiple` + server action procesa array. Hasta 24 fotos por propiedad.
- **#2 Optimización con `sharp`**: rotación EXIF automática, resize a 2000px máx en galería (1600px en portada), conversión a WebP calidad 82. Reduce 60-80% el peso. Acepta HEIC/HEIF de iPhone.
- **#5 Vincular propiedad ↔ lote bidireccional**: desde el detalle, botón "Vincular con lote" abre el visor en modo `linkProperty`. Banner navy "Modo vincular" arriba del mapa. Al seleccionar lote → botón "✓ Vincular esta propiedad con este lote" en el inspector → server action `vincularPropiedadConLote` → redirect al detalle.
- **#11 Superficie real prevalece**: en el detalle, el área del catastro se etiqueta "Área catastro (referencia)" y el "Fiscal sugerido" como "(catastro)". Nota explícita: *La superficie real registrada en esta propiedad es la que se usa para los cálculos*.

**Análisis (#10)**
- Documentado en chat: qué información es relevante para vender avalúos vs uso interno. Define los campos críticos para Fase 7 (calculadora) y Valuaciones.

**Archivos clave**
- `src/server/properties/actions.ts` — agregado `vincularPropiedadConLote`.
- `src/server/properties/photos.ts` — reescrito con `sharp` y multi-archivo.
- `src/server/properties/cover-photo.ts` — `sharp` para portada también.
- `src/server/documents/actions.ts` — agregado `editDocument` + `ts` para reset de form.
- `src/server/units/actions.ts` — agregado `editarUnidad`.
- `src/app/(app)/propiedades/[id]/documents-section.tsx` — refactor con edición inline.
- `src/app/(app)/propiedades/[id]/units-section.tsx` — refactor con edición inline.
- `src/app/(app)/propiedades/[id]/photo-gallery.tsx` — multi-select.
- `src/app/(app)/propiedades/[id]/page.tsx` — botón "Vincular con lote" cuando no hay carto.
- `src/components/cartografia/Visor.tsx` — modo `linkProperty` con banner y callback.
- `src/components/cartografia/Inspector.tsx` — botón "Vincular" prioritario sobre "Crear nueva".
- `package.json` — dep nueva: `sharp@^0.x`.

**Pendiente**
- #9 Nav lateral consistente
- #6 Filtros listado
- #7 Toggle grid/lista
- #12 Info ampliada de colonia en sidebar visor
- #8 Sección perfil (portafolios, invitar agentes, permisos)
- #13 Calculadora valor catastral (fiscal + mercado, terreno + construcción)
- Fase 6.4 Valuaciones (historial)
- Fase 6.5 Rentas + pagos

---

## 2026-05-13 — Sesión 3 · Editar/galería/unidades + foto + vínculo carto

**Fase 5** (cerrada)
- Migración Prisma: campos `cartoPredioId`, `cartoColoniaId`, `coverPhotoStorageKey` en `Property`. Índice por `cartoPredioId`.
- Form de "Nueva propiedad" acepta y guarda los IDs del catastro cuando vienen del visor.
- Visor pasa los IDs al hacer "+ Crear propiedad desde este lote".
- Detalle muestra bloque navy "Catastro vinculado" con colonia, sector, tipo de zona, fiscal $/m², comercial $/m², área del lote, **Fiscal sugerido** (lime).
- Foto de portada: server action `setPropertyCoverPhoto`. Una foto principal por propiedad. Aparece en detalle (16:10) y en cada card del listado.

**Fase 6.1** (cerrada)
- Editar propiedad: `/propiedades/[id]/editar` con todos los campos cargados.
- "Zona de peligro" con botón eliminar (soft delete).
- Estado operativo y campos extra (valor seguro, renta esperada).
- Form único `PropertyForm` reutilizable para crear y editar.

**Fase 6.2** (cerrada)
- Tabla `PropertyPhoto` (migración Prisma).
- Galería en el detalle: grid 4 columnas con hover overlay (botones "Portada" / "✕").
- "Set as cover" → cambia `coverPhotoStorageKey` de la propiedad.

**Fase 6.3** (cerrada)
- Unidades dentro de propiedad. CRUD básico inline.
- Action `crearUnidad`, `eliminarUnidad` (soft delete).

**Archivos clave**
- `prisma/schema.prisma` — campos nuevos en `Property` + nueva tabla `PropertyPhoto`.
- `prisma/migrations/20260512235808_add_carto_link_and_cover/` y `20260513001509_add_property_photos/`.
- `src/server/properties/actions.ts` — `crearPropiedad`, `editarPropiedad`, `eliminarPropiedad`.
- `src/server/properties/cover-photo.ts` — portada.
- `src/server/properties/photos.ts` — galería (versión simple).
- `src/server/units/actions.ts` — crear, eliminar.
- `src/components/property-form.tsx` — form único create/edit.
- `src/app/(app)/propiedades/[id]/{cover-photo,photo-gallery,units-section,documents-section}.tsx`.

---

## 2026-05-13 — Sesión 2 · Visor v3 en Next.js + módulos

**Fase 2** (cerrada)
- Visor v3 reescrito en React dentro de Next.js (`/cartografia`).
- 5 API routes `/api/cartografia/*` (colonias, tramos, predios, search) reemplazan los del FastAPI legacy.
- Componentes: Rail, Sidebar, Inspector, MapClient (Leaflet vanilla con dynamic import), SearchBox.
- Tailwind v4 con tokens GFC en `@theme`.
- Middleware Next.js protege rutas; APIs devuelven 401 JSON sin sesión.

**Fase 3** (cerrada)
- Módulo Propiedades: listado, nueva, detalle.
- Vinculo cartografía → propiedad: "+ Crear propiedad desde este lote" en el inspector.
- AppHeader (Inicio / Propiedades / Cartografía).

**Fase 4** (cerrada)
- Bucket privado `propaily-documents` en Supabase Storage.
- CRUD básico de documentos con signed URLs (60s).
- Categorías y sensibilidad.

**Bugs cerrados durante la sesión**
- Mapa en baja resolución → `detectRetina: true`.
- Lotes debajo de la colonia (z-order) → panes de Leaflet con z-index escalonado.
- Rail incompleto → ancho 84px + `whitespace-nowrap`.
- Layout roto al colapsar sidebar → `gridColumn` explícito en cada hijo.
- Dropdown buscador detrás del mapa → z-[2000].
- Handle sidebar no responde → reubicado pegado al rail con z-[2000].
- Al seleccionar lote se borraban los lotes → `loadedColoniaId` separado de `selection`.

---

## 2026-05-12 — Sesión 1 · Fusión arranque

**Fase 0** (cerrada)
- Propaily movida de `cartografia-gfc/inbox/` a `gfc-claude/propaily/`.
- Schema Prisma con `multiSchema`: schema `propaily` separado de `public` (catastro).
- `prisma migrate dev --name init` — 29 tablas en `propaily`.
- ADR escrito: [`cartografia-gfc/bitacora-sesiones/2026-05-12_adr-fusion-propaily.md`](../cartografia-gfc/bitacora-sesiones/2026-05-12_adr-fusion-propaily.md).
- CLAUDE.md raíz actualizado.

**Fase 1** (cerrada)
- Supabase Auth configurado (`@supabase/ssr`).
- Helpers `client.ts` / `server.ts` / `middleware.ts`.
- Páginas `/login` y `/signup` con server actions.
- Sync `Supabase User ↔ propaily.User` (mismo UUID).
- Admin creado: `pablo.torres.sm@gmail.com`.
- Issue resuelto: `localhost` resolvía IPv6 y SQLAlchemy colgaba → cambiado a `127.0.0.1` en `.env`.

---

## Convención

- Cada sesión es una entrada con fecha + título corto.
- Listar fases o sub-tareas cerradas.
- Mencionar bugs cerrados durante la sesión.
- Listar archivos clave (no exhaustivo) para que sirva de búsqueda.
- Al final de cada entrada, "Pendiente" con lo que queda en cola.
