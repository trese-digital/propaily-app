# 🟢 Estado de sesión — Propaily

> **Última actualización**: 2026-05-13 (sesión 7) · **Fase actual**: 6 + P2 UX cerrado + nueva identidad visual aplicada
> Changelog completo: [CHANGELOG.md](CHANGELOG.md)
> ADR de la fusión: [`../cartografia-gfc/bitacora-sesiones/2026-05-12_adr-fusion-propaily.md`](../cartografia-gfc/bitacora-sesiones/2026-05-12_adr-fusion-propaily.md)
> Handoff de identidad: [`../cartografia-gfc/propaily-handoff/`](../cartografia-gfc/propaily-handoff/) — tokens, logos y componentes de referencia.

## 🎯 Visión

Propaily es la **app principal** del grupo GFC. Absorbe Cartografía como módulo `/cartografia`.
Stack: **Next.js 16 + Prisma 6 + PostgreSQL+PostGIS + Supabase (Auth + Storage)** + Tailwind v4 + Geist/Geist Mono.

## ✅ Estado actual (qué funciona)

| Módulo | Estado |
|---|---|
| **Auth** | Login/signup con Supabase. Middleware protege rutas. 401 JSON en `/api/*`. |
| **Visor cartografía** (`/cartografia`) | Mapa Leaflet con colonias, tramos, lotes (con dimensiones reales). Buscador funcional. Rail + sidebar + inspector. Retina, panes z-index, sidebar minimizable. |
| **Propiedades** (`/propiedades`) | CRUD: crear (vacío o desde lote), editar, eliminar (soft). Listado con foto. |
| **Foto de portada** | Subida con `sharp` (resize 1600px + WebP). Aparece en detalle y listado. |
| **Galería** | Multi-upload (varias a la vez), optimización a WebP, máx 24 por propiedad. Set as cover. |
| **Documentos** | CRUD: subir múltiples, descargar (signed URL 60s), eliminar (soft), **editar metadata**. 25 MB max. |
| **Unidades** | CRUD inline: crear, editar, eliminar. Tipo, área, renta, inquilino, notas. |
| **Vínculo cartografía ↔ propiedad** | Bidireccional. Al crear desde el visor o vincular post-creación. |
| **Catastro en detalle** | Panel "Catastro vinculado" con colonia, sector, $/m² fiscal y comercial, fiscal sugerido. Etiqueta "referencia" para diferenciar de la superficie real. |
| **Identidad visual Propaily** | Paleta morado-primario (`#6E3AFF`), Geist + Geist Mono via `next/font`. Tokens en `globals.css`. Logos en `public/logo/`. Aplicada a chrome, login/signup, dashboard, propiedades, detalle, cartografía y landing pública. |
| **Landing público** | Ruta `/welcome` accesible sin sesión (hero + features + cartografía stats + pricing + CTA). Middleware redirige sin-sesión-en-`/` → `/welcome` (antes iba a `/login`). |

## 🚀 Para retomar

```powershell
# 1) DB en Docker
cd c:\Users\pablo\ia\claudecode\gfc-claude\cartografia-gfc\backend
docker compose up -d

# 2) Propaily Next.js
cd c:\Users\pablo\ia\claudecode\gfc-claude\propaily
npm run dev
# → http://localhost:3000
```

Login: `pablo.torres.sm@gmail.com` / `GFC2026admin`.

## 🔜 Backlog ordenado por prioridad

### P2 — UX consistencia
- [x] **#9** Nav lateral consistente. _Hecho 2026-05-13 sesión 5._
- [x] **#6** Filtros en listado propiedades (ciudad, tipo, estatus operativo). _Hecho 2026-05-13 sesión 6._
- [x] **#7** Toggle vista grid / lista en listado. _Hecho 2026-05-13 sesión 6._

### P2 — Cartografía con más info
- [~] **#12** Sidebar visor al seleccionar colonia. _Parcial 2026-05-13 sesión 6:_ ya muestra nº de lotes, lote típico, lote promedio, rango y propiedades de Propaily vinculadas. **Falta:** servicios cercanos (escuelas, salud) y áreas verdes — requieren integrar capas DENUE/INEGI primero (sesión aparte con `data-integrator`).

### P3 — Features grandes
- [ ] **#13** Calculadora de valor catastral (fiscal + mercado, terreno + construcción). Necesita migrar `cartografia-gfc/data/construccion.json` (BIMSA/VARELA) al modelo.
- [ ] **#8** Sección perfil + portafolios + invitar agentes + permisos granulares.
- [ ] **6.4** Valuaciones (historial de valor por propiedad).
- [ ] **6.5** Rentas + pagos (Lease + RentPayment).

### P3 — Deploy
- [ ] **Fase 9** Deploy a VPS Hostinger (decidir Vercel vs self-hosted, ver plan en este mismo doc).

### Identidad — cleanup post-migración (P3)
- [ ] Refactor de `Inspector.tsx` del visor para consumir tokens nuevos directos (hoy usa aliases legacy que mapean).
- [ ] Refactor de `cover-photo.tsx`, `photo-gallery.tsx`, `units-section.tsx`, `documents-section.tsx` (idem).
- [ ] Watermark dinámico en exports de mapa (email + ISO timestamp).
- [ ] Eliminar aliases legacy (`--color-navy`, `--color-teal`...) de `globals.css` cuando todo migre.

## ⚙️ Decisiones técnicas clave (resumen)

- **Una DB, dos schemas**: `public` (cartografía, SQLAlchemy/Alembic) + `propaily` (Prisma).
- **Sin `geometry` en Prisma**: queries espaciales con `prisma.$queryRaw` y funciones prefijadas con `public.`.
- **Imágenes**: pasan por `sharp` (auto-rotate, resize, WebP). Bucket privado, signed URLs.
- **Server Actions**: forms usan `useActionState` + timestamp `ts` para resetear inputs sin cerrar el form.
- **Auth Supabase** con `@supabase/ssr`. Sync UUID → `propaily.User.id`.
- **FastAPI legacy** sigue en `:8000` pero ya no se usa desde Propaily. Se apaga cuando se quiera.

## ⚠️ Notas heredadas

- Usar `127.0.0.1` (no `localhost`) en `DATABASE_URL` — IPv6 cuelga el handshake en este Windows.
- Schema `public` se renombrará a `cartografia` cuando se apague FastAPI.
- Tabla `audit_log` viejo del FastAPI **no** se usa desde Propaily; el modelo `propaily.AuditLog` queda para uso futuro.
