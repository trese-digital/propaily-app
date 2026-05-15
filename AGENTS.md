# Propaily — Reglas para agentes de IA

> Este archivo es leído automáticamente por Claude Code, Cursor, Copilot y cualquier agente compatible con el estándar AGENTS.md al iniciar sesión en este proyecto. **Léelo completo antes de escribir o modificar código.**

---

## 1. Qué es Propaily

Propaily es el SaaS de **GF Consultoría** para administrar bienes raíces. Plataforma multi-tenant con base en León, Guanajuato.

**Producto central** (incluido en todos los paquetes):
- Administración de propiedades: CRUD, fotos (24 max por propiedad), documentos PDF, unidades rentables
- Administración de rentas: contratos, pagos, vencimientos

**Módulos PLUS** (addons cobrados aparte, encendibles/apagables por tenant):
- **Cartografía** — visor catastral de León con PostGIS
- **Insights** — analítica de portafolio
- **Calculadoras fiscales** — ISAI/impuesto de traslado, ISR, predial, plusvalía

**Servicio profesional diferenciador** (revenue clave):
- GF realiza el **avalúo inicial** y carga la información correcta
- **Actualización anual** del valor a precio fijo por propiedad
- Backoffice operativo donde analistas de GF capturan y actualizan datos

**Modelo de cobro por paquetes:**

| Paquete | Propiedades | Plus disponibles |
|---|---|---|
| Starter | 0–5 | Add-on |
| Growth | 5–10 | Add-on |
| Pro | 10–20 | Add-on |
| Enterprise | 20+ | Add-on |

Los addons son **toggles independientes del paquete**. Un Starter puede tener Cartografía + Calculadoras; un Pro puede tener solo el core.

---

## 2. Arquitectura de dos lados (mismo proyecto Next.js)

Propaily tiene **dos frontends sobre la misma DB**:

### A) `app.propaily.com` — Portal del cliente
- **Usuario:** administrador de propiedades, family office, desarrollador
- **Hace:** ver portafolio, descargar reportes, gestionar rentas, usar módulos plus activos
- **Acceso:** Supabase Auth, scoping por `tenantId` (JWT custom claim)
- **Permisos:** lectura de sus datos, escritura limitada (rentas, notas)

### B) `admin.propaily.com` — Backoffice de analistas GF
- **Usuario:** equipo interno de GF Consultoría (analistas, valuadores, admin)
- **Hace:** cargar avalúos, editar cartografía, actualizar valores anuales, asignar propiedades a clientes, gestionar suscripciones
- **Acceso:** Supabase Auth con rol `gf_analyst` o `gf_admin`
- **Permisos:** lectura/escritura amplia, cross-tenant para staff (con audit log)

**Regla:** ambos lados son rutas del mismo proyecto Next.js, separadas por route groups `(client)` y `(admin)`. La separación se enforza en middleware + RLS, no en routing.

---

## 3. Stack técnico — fuente de verdad

| Capa | Tecnología | Notas críticas |
|---|---|---|
| Framework | Next.js 16 (App Router) | `params` y `searchParams` son `Promise` — siempre `await` |
| UI | React + Tailwind v4 | Tokens en `globals.css`, NO inline hex |
| Lenguaje | TypeScript estricto | `tsc --noEmit` debe pasar siempre |
| ORM | Prisma 6 | Solo schema `propaily` |
| DB | PostgreSQL 16 + PostGIS | Schemas `public` (catastro, Alembic) + `propaily` (negocio, Prisma) |
| Auth | Supabase Auth (`@supabase/ssr`) | Middleware protege rutas |
| Storage | Supabase Storage | Bucket **privado**, signed URLs **60s** |
| Imágenes | sharp | auto-rotate → resize 1600px → WebP quality 82 |
| Mapa | Google Maps JS API (`@googlemaps/js-api-loader`) | Solo client-side, en `(visor)/cartografia`. Capas `google.maps.Data` consumen GeoJSON de PostGIS. Key en `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` |
| Pagos | Stripe (subscriptions + add-ons + webhooks) | Server-side, con verificación de firma |
| Fuentes | Geist + Geist Mono via `next/font` | |
| Identidad visual | Morado `#6E3AFF` | No introducir paletas paralelas |

---

## 4. Arquitectura de DB — REGLA CRÍTICA

**Una sola DB Postgres con DOS schemas que conviven:**

- **`public`** → datos catastrales (colonias, tramos, lotes, vialidades, valores fiscales).
  Manejado por **Alembic** desde el backend FastAPI legacy en `cartografia-gfc/backend`.
  ⚠️ **NUNCA crear migraciones de Prisma que toquen este schema.**

- **`propaily`** → modelo de negocio (Tenant, Subscription, Portfolio, Property, Document, Unit, Lease, Payment, Valuation, CatastralLink, etc.).
  Manejado por **Prisma** desde esta app.

**Connection string local (dev):**
```
postgresql://gfc:gfc_dev_2026@127.0.0.1:5432/cartografia_gfc_dev?schema=propaily
```

⚠️ **SIEMPRE usar `127.0.0.1`, NUNCA `localhost`** — IPv6 cuelga el handshake en Windows.

**Queries cross-schema usan `$queryRaw` con nombres calificados:**
```ts
await prisma.$queryRaw`
  SELECT p.id, ST_AsGeoJSON(l.geom)::json AS geometry
  FROM propaily."Property" p
  JOIN propaily."CatastralLink" cl ON cl."propertyId" = p.id
  JOIN public.lotes l ON l.id = cl."loteId"
  WHERE p."tenantId" = ${tenantId}::uuid
    AND l.geom && ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}, 4326)
`;
```

---

## 5. Modelo de datos (alto nivel)

```
Tenant ─┬─ Subscription ─── Plan (Starter/Growth/Pro/Enterprise)
        │                └── Addons (Cartografia, Insights, Calculadoras)
        ├─ User[] ─── role (client_admin, client_viewer, gf_analyst, gf_admin)
        ├─ Portfolio[] ─── Property[]
        │                 ├─ Document[]
        │                 ├─ Photo[] (galería 24 max)
        │                 ├─ Unit[] ─── Lease[] ─── Payment[]
        │                 ├─ Valuation[] (avalúos GF, append-only)
        │                 └─ CatastralLink (FK a public.lote, opcional)
        ├─ Invoice[] (facturación SaaS)
        └─ AuditLog[] (acciones de staff GF cross-tenant)
```

**Decisiones de modelado:**
- Todo dato de cliente tiene `tenantId` → RLS lo enforza
- `Valuation` es **append-only** (histórico anual); el "valor actual" es el último registro
- `CatastralLink` es opcional (no todas las propiedades están en catastro de León)
- `Addons` son booleanos en `Subscription`, no rows separadas → simple, atómico
- `AuditLog` registra cada vez que staff GF accede a datos de un tenant

---

## 6. Reglas NO NEGOCIABLES

### Seguridad
1. **`SUPABASE_SERVICE_ROLE_KEY` solo en `src/server/`.** Si aparece en Client Component, es bug crítico.
2. **Toda query Prisma a `propaily` se scopea por `tenantId`.** Sin excepciones (salvo staff GF con audit).
3. **Signed URLs siempre TTL 60s.** No subir el TTL "por comodidad".
4. **Validar uploads:** PDFs ≤25MB, imágenes ≤10MB, MIME real (`file-type` o sharp metadata, no por extensión).
5. **Staff GF tiene `role` propio.** No reutilizar `tenantId` para staff.
6. **RLS activo en todas las tablas de `propaily`.** Defensa en profundidad sobre filtro de aplicación.

### Base de datos
7. **Prisma SOLO toca schema `propaily`.** El `public` es de Alembic.
8. **Queries espaciales = `$queryRaw` con tipos explícitos.** Prisma no entiende PostGIS.
9. **Migraciones se revisan antes de `migrate deploy`.** El `deploy.sh` corre automático en VPS.
10. **Conexión usa `127.0.0.1`, NO `localhost`.**

### Next.js 16
11. **`params` y `searchParams` son `Promise`.** Siempre `await`.
12. **`fetch` no cachea por default en 16.** Si necesitas cache, opt-in explícito.
13. **Server Actions para mutaciones desde formularios.** No API routes ad-hoc si Server Action sirve.
14. **`'use client'` solo cuando necesites state/efectos/browser APIs.** El mapa sí, formularios estáticos no.

### Multi-tenancy y addons
15. **`tenantId` viaja por session (JWT custom claim), NO por URL.**
16. **Admin de GF puede impersonar a un tenant para soporte.** Loguear cada impersonación en `AuditLog`.
17. **Toggles de addons se verifican EN EL SERVER, no en UI.** Un cliente puede llamar endpoint de Cartografía aunque su UI no lo muestre — el endpoint debe rechazar si `subscription.addons.cartografia === false`.

### UI/UX
18. **Tailwind v4 con design tokens en `globals.css`.** No inline colors ad hoc.
19. **Identidad visual:** morado `#6E3AFF`, Geist. No introducir paletas paralelas.
20. **Formularios largos (avalúo, propiedad) deben tener autosave.** Perder data por refresh es bug crítico.

---

## 7. Estructura del proyecto

```
propaily/
├── prisma/
│   ├── schema.prisma                    # solo schema "propaily"
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (client)/                    # portal cliente
│   │   │   ├── dashboard/
│   │   │   ├── propiedades/
│   │   │   ├── rentas/
│   │   │   ├── cartografia/             # solo si tenant tiene addon
│   │   │   ├── insights/                # solo si tenant tiene addon
│   │   │   └── calculadoras/            # solo si tenant tiene addon
│   │   ├── (admin)/                     # backoffice GF
│   │   │   ├── tenants/
│   │   │   ├── avaluos/
│   │   │   ├── cartografia-edit/
│   │   │   └── facturacion/
│   │   ├── (auth)/                      # login, signup, recovery
│   │   ├── (marketing)/welcome/         # landing público
│   │   ├── api/
│   │   │   ├── webhooks/stripe/         # eventos de suscripción
│   │   │   ├── catastro/                # endpoints PostGIS
│   │   │   └── health/                  # health check para deploy
│   │   └── globals.css
│   ├── components/                      # UI reutilizable
│   ├── features/                        # lógica por dominio
│   │   ├── properties/
│   │   ├── leases/
│   │   ├── valuations/
│   │   ├── billing/
│   │   └── cartografia/
│   ├── server/                          # SERVER-ONLY (nunca importar desde client)
│   │   ├── auth/                        # supabase + tenant scoping
│   │   ├── db/                          # prisma client
│   │   ├── storage/                     # signed URLs, sharp pipeline
│   │   ├── billing/                     # stripe, plan logic
│   │   └── access/                      # ¿este tenant tiene este addon?
│   ├── lib/                             # utilidades puras (geometry, formatters)
│   └── middleware.ts                    # auth + tenant resolution
├── docs/
├── AGENTS.md                            # ← este archivo
├── CLAUDE.md                            # ← import de AGENTS.md
└── deploy.sh                            # ← en VPS, no en repo
```

**Reglas de dependencia:**
- `server/` **NUNCA** se importa desde Client Components
- `components/` no importa de `features/` (al revés sí)
- `lib/` no tiene side effects ni imports de Next

---

## 8. Cómo correr localmente

```bash
# Terminal 1 — DB Docker (background)
cd "C:\Users\pablo\ia\claudecode\02 gfc-claude\cartografia-gfc\backend"
docker compose up -d

# Terminal 2 — Next
cd "C:\Users\pablo\ia\claudecode\02 gfc-claude\propaily"
npm run dev
# → http://localhost:3000
```

**Login dev:** `pablo.torres.sm@gmail.com` / `GFC2026admin`

**Scripts disponibles:** `dev`, `build`, `start`, `lint`, `typecheck`, `db:generate`, `db:migrate`, `db:studio`.

**Antes de declarar "listo" cualquier cambio:**
```bash
npm run typecheck    # DEBE pasar
npm run lint         # DEBE pasar
```

---

## 9. Deploy

- VPS: `deploy@177.7.40.42`, app en `/opt/propaily/`, dominio `propaily.com`
- Flujo: `git push` → `ssh deploy@177.7.40.42 "/opt/propaily/deploy.sh"`
- `deploy.sh` hace: pull → `npm ci` si cambió lockfile → `prisma generate` → `prisma migrate deploy` → `npm run build` → copia public/.next/static → `pm2 restart` → health check
- Runtime: `node .next/standalone/server.js` en :3001, Nginx delante con HTTPS, PM2 supervisa
- Para deploys que tocan **billing o subscriptions**: primero a staging cuando exista; nunca directo a prod

**Nunca:**
- `prisma db push` (sin migración trazable)
- Modificar archivos en `prisma/migrations/` ya existentes
- `git push --force` a `main`
- SSH y `git pull` manual al VPS (siempre usar `deploy.sh`)
- `prisma migrate dev` contra prod

---

## 10. Mapping de agentes y skills a invocar

Cuando una tarea pertenece a un dominio, **invoca al especialista correspondiente** (Claude Code lo hace automático si la tarea es clara, o puedes forzarlo con `@nombre`).

### Agentes públicos disponibles (instalados en `~/.claude/agents/`)

| Tarea | Invocar |
|---|---|
| Visor, mapa (Google Maps), queries PostGIS, performance espacial | `geospatial-engineer` |
| Lógica de bienes raíces (AVM, MLS, geo-search facetado) | `real-estate-tech` |
| Schema Prisma, migraciones, queries complejas | `prisma-expert` |
| Next.js 16, App Router, Server Components, Server Actions | `nextjs-expert` |
| Stripe subscriptions, webhooks, idempotencia, billing | `stripe-expert` |

### Agentes propios (tuyos, ya existentes en `~/.claude/agents/`)

| Tarea | Invocar |
|---|---|
| Calculadoras fiscales complejas (ISAI/ISR/predial/plusvalía), reportes financieros | `finanzas-architect` |
| Exportar avalúos o reportes a Excel | `excel-builder` |
| Investigar regulación inmobiliaria mexicana, tasas, normativa SAT | `web-search-agent` |

### Agente custom de Propaily (en `.claude/agents/` del proyecto)

| Tarea | Invocar |
|---|---|
| Formularios largos (avalúo, propiedad, lease), autosave, WCAG, accesibilidad | `propaily-ux-forms` |

### Plugins de Supabase oficial (instalados como plugins)

| Tarea | Invocar (auto) |
|---|---|
| RLS policies, auth flows, signed URLs, schemas Supabase | plugin `supabase` |
| Postgres best practices, índices, queries optimizadas, vacuum | plugin `postgres-best-practices` |

### Skills del ecosistema (ya instalados en `~/.claude/skills/`)

| Tarea | Skill (auto-invocado) |
|---|---|
| UI/Tailwind/CSS, componentes React, diseño visual | `frontend-design` |
| Testing E2E del visor, automatización browser | `webapp-testing` |
| Exportar reportes a PDF | `pdf` |
| Generar documentos Word (contratos) | `docx` |
| Reportes con cálculos en Excel | `xlsx` |
| Presentaciones para clientes | `pptx` |

### Agentes oficiales de Anthropic (siempre disponibles)

| Tarea | Invocar |
|---|---|
| Diseñar arquitectura de feature nueva, plan de implementación | `Plan` |
| Buscar en el codebase, localizar archivos/símbolos/referencias | `Explore` |
| Tareas complejas multi-paso de investigación | `general-purpose` |

### Slash commands

| Tarea | Comando |
|---|---|
| Code review estructurado antes de commit | `/review` |
| Audit de seguridad de cambios pendientes | `/security-review` |

---

## 11. Workflow obligatorio

**Antes de proponer un cambio:**
1. Si toca DB → revisar primero qué schema (`public` vs `propaily`)
2. Si toca rutas → revisar middleware y route group afectado
3. Si toca cartografía → recordar que el mapa (Google Maps) es client-only
4. Si toca uploads → recordar que el bucket es privado y signed URLs son 60s
5. Si toca facturación → involucrar a `stripe-expert`

**Antes de declarar "listo":**
1. `npm run typecheck` pasa
2. `npm run lint` pasa
3. Si tocaste seguridad → `/security-review`
4. Si tocaste >10 líneas → `/review`

**Antes de cada deploy:**
1. Working tree limpio (`git status`)
2. `npm run build` pasa local
3. Si hay migración Prisma nueva → leer el SQL generado, NO debe tocar `public.*`
4. `git push origin main`
5. `ssh deploy@177.7.40.42 "/opt/propaily/deploy.sh"`
6. Smoke test post-deploy en `https://propaily.com`

---

## 12. Pista de aroma — señales de que algo está mal

- Un Server Component intenta importar de `@/components/cartografia/*` → es client-only, mover lógica
- Aparece `localhost` en lugar de `127.0.0.1` en conexión a DB → cuelga en Windows
- `prisma migrate dev` quiere tocar tabla en schema `public` → MAL, eso es Alembic
- Signed URL con TTL >60s → revisar por qué
- `SUPABASE_SERVICE_ROLE_KEY` referenciada fuera de `src/server/` → bandera roja inmediata
- Componente del mapa sin `"use client"` → no va a compilar
- Query Prisma a un modelo de `propaily` sin filtro `tenantId` → leak cross-tenant
- Form con >5 campos sin autosave → bug P1 esperando suceder
- `findUnique({ where: { id } })` sin `tenantId` → bypass de seguridad
- `params.id` sin `await` → falla en runtime en Next 16

---

## 13. Glosario interno

- **Tenant** = cuenta de cliente (un family office = un tenant; sus 50 propiedades viven dentro)
- **Plan** = paquete de propiedades (Starter/Growth/Pro/Enterprise)
- **Addon** = módulo plus (Cartografía, Insights, Calculadoras)
- **Valuation** = avalúo realizado por analista GF, con histórico anual
- **Catastro** = datos del schema `public`, manejados por FastAPI legacy + Alembic
- **GF / staff** = equipo interno de GF Consultoría, opera el backoffice
- **Cliente** = usuario final del tenant (admin de propiedades, etc.)
- **ISAI** = Impuesto Sobre Adquisición de Inmuebles (impuesto de traslado)
- **AVM** = Automated Valuation Model (modelo de valuación automatizada)
- **MLS** = Multiple Listing Service (no implementado aún, posible futuro)
