# Handoff: Propaily Mobile PWA (`app.propaily.com`)

> **Para el desarrollador (Claude Code u otro):** este paquete contiene **prototipos de diseño** hechos en HTML/React-via-Babel. **NO son código de producción para copiar/pegar.** Son la referencia visual y de comportamiento. Tu tarea es **recrear estos diseños** en el codebase real de Propaily (o, si aún no existe, elegir el stack adecuado para una PWA — recomendamos Next.js 14+ App Router + TypeScript + Tailwind o vanilla CSS con los tokens incluidos).

---

## 1. Overview

`app.propaily.com` es la **PWA móvil** de Propaily, plataforma de gestión inmobiliaria de GF Consultoría. Da acceso móvil a 3 personas:

| Rol | Mantra | Acciones principales |
|---|---|---|
| **Propietario / inversionista** | Consultar + aprobar | Ver patrimonio, revisar propiedades, aprobar renovaciones/avalúos |
| **Inquilino** | Pagar + reportar | Pagar renta vía SPEI, subir comprobante, reportar mantenimiento |
| **Operador GFC** | Operar en campo | Ver ruta del día, gestionar cobranza, mantenimiento desde el teléfono |

La PWA es **complementaria** al dashboard de escritorio — NO lo reemplaza. En móvil **no hay edición pesada** (no se crean propiedades, no se editan contratos). Solo flujos transaccionales y de aprobación.

---

## 2. Sobre los archivos de diseño

Los archivos en este bundle son **referencias de diseño** creadas en HTML. Son prototipos que muestran el aspecto y comportamiento esperados, **no código de producción para copiar directamente**. Las decisiones técnicas (qué framework usar, cómo estructurar componentes, qué librería de estado, etc.) las tomas tú según el codebase de destino — pero el **resultado visual y los flujos deben coincidir**.

Si el codebase ya tiene un design system, **adáptate a sus componentes**. Si no hay nada todavía, sugerimos:
- **Framework:** Next.js 14+ (App Router) + TypeScript
- **Estilos:** Tailwind CSS configurado con los tokens de `tokens.css`, o CSS Modules con los mismos tokens como custom properties
- **PWA:** `next-pwa` o `workbox-webpack-plugin` para service worker
- **Estado:** TanStack Query para data fetching, React Context o Zustand para UI state
- **Forms:** React Hook Form + Zod

---

## 3. Fidelidad

**Alta fidelidad (hifi).** Estos diseños incluyen:
- Colores exactos (hex) en `tokens.css`
- Tipografía final (Geist + Geist Mono, ya con escala definida)
- Espaciado y tamaños finales
- Estados interactivos clave

El desarrollador debe **recrear pixel-perfect** estos diseños. Donde se vean placeholders rayados con texto mono (clase `.pp-img-ph`), **reemplazar por imágenes reales** (fotos de propiedades, logos de banco, etc.) que el equipo de Propaily proveerá.

---

## 4. Inventario de pantallas

**21 pantallas en 6 secciones.** Ver `Propaily Mobile Flow.html` para el storyboard visual. Especificación detallada de cada una en `Propaily-Mobile-PWA-Spec.md` (§4).

### Mapa rápido

| # | Componente referencia | Ruta sugerida | Rol(es) | Tipo |
|---|---|---|---|---|
| 01 | `MFlowSplash` | `/splash` (transitorio) | — | Splash PWA |
| 02 | `MFlowOnboard1` | `/onboarding?step=1` | — | Onboarding |
| 03 | `MFlowOnboard2` | `/onboarding?step=2` | — | Onboarding |
| 04 | `MFlowInstall` | overlay sobre cualquier ruta | — | Install hint (PWA) |
| 05 | `MFlowRole` | `/onboarding/rol` | — | Selector de rol |
| 06 | `MobileLogin` | `/login` | — | Auth (magic link) |
| 07 | `MFlowMagicSent` | `/login/email-enviado` | — | Auth |
| 08 | `MobileHome` | `/` (owner) | Propietario | Home |
| 09 | `MobilePropDetalle` | `/propiedad/:id` | Propietario / Admin | Detalle |
| 10 | `MFlowOwnerPending` | `/aprobar` | Propietario | Bandeja |
| 11 | `MFlowApproveDetail` | `/aprobar/renovacion/:id` | Propietario | Detalle + acción |
| 12 | `MobilePago` | `/inquilino/pago` | Inquilino | Pago SPEI |
| 13 | `MFlowComprobUpload` | `/inquilino/pago/:id/comprobante` | Inquilino | Upload |
| 14 | `MFlowComprobOk` | `/inquilino/pago/:id/ok` | Inquilino | Confirmación |
| 15 | `MobileMantenimiento` | `/mantenimiento/nuevo` | Inquilino / Admin | Form |
| 16 | `MFlowCamera` | overlay (viewfinder) | Inquilino / Admin | PWA cámara |
| 17 | `MFlowAdminHome` | `/` (admin) | Admin | Home |
| 18 | `MFlowAdminCobranza` | `/cobranza` | Admin | Cobranza |
| 19 | `MobileNotif` | `/avisos` | Todos | Lista |
| 20 | `MFlowAvisoDetalle` | `/avisos/:id` | Todos | Detalle |
| 21 | `MFlowPerfil` | `/perfil` | Todos | Settings + switch de rol |

---

## 5. Cómo abrir y navegar el storyboard

1. Abre `Propaily Mobile Flow.html` en cualquier navegador moderno (Chrome/Safari recientes).
2. El canvas tiene **scroll horizontal y vertical** + **pan & zoom** (rueda del mouse o gestos trackpad).
3. Cada pantalla es un *artboard* dentro de un iPhone bezel. Doble click sobre el label para enfocarla en pantalla completa.
4. El orden lee de izquierda a derecha dentro de cada sección, y de A → F vertical.
5. Cada label tiene un número (01–21) que coincide con `Propaily-Mobile-PWA-Spec.md`.

---

## 6. Design tokens

**Lee `tokens.css`** — está completo y listo para importar. Todo el diseño consume estas variables. **No introduzcas hex sueltos** ni colores nuevos.

### Resumen

| Categoría | Token | Valor |
|---|---|---|
| Marca primaria | `--pp-500` | `#6E3AFF` |
| Marca hover | `--pp-600` | `#5A24E6` |
| Marca soft bg | `--pp-50` | `#F4F0FF` |
| Fondo app | `--bg` / `--bg-muted` | `#FFFFFF` / `#FBFAFE` |
| Texto principal | `--fg` (= `--ink-900`) | `#0E0A16` |
| Texto secundario | `--fg-muted` (= `--ink-500`) | `#6B6480` |
| Border | `--border` (= `--ink-200`) | `#E1DCEE` |
| Verde OK | `--ok` | `#10B981` |
| Ámbar warn | `--warn` | `#F59E0B` |
| Rojo bad | `--bad` | `#EF4444` |
| Azul info | `--info` | `#3B82F6` |
| Font sans | `--font-sans` | `"Geist", system-ui` |
| Font mono | `--font-mono` | `"Geist Mono"` |
| Radius card | `--r-lg` | `14px` |
| Radius pill | `--r-full` | `999px` |
| Shadow card | `--shadow-sm` | tinte morado (ver tokens.css) |

### Mobile-specific tokens (a añadir cuando se implemente)

```css
:root {
  --m-tap: 44px;
  --m-tab-bar-h: 60px;
  --m-safe-bottom: env(safe-area-inset-bottom, 24px);
  --m-safe-top: env(safe-area-inset-top, 54px);
  --m-sheet-r: 22px;
}
```

### Type scale (fija — no inventes)

| Token | Valor |
|---|---|
| `--type-display` | 600 48px/1.05 |
| `--type-h1` | 600 32px/1.1 |
| `--type-h2` | 600 22px/1.2 |
| `--type-h3` | 600 16px/1.3 |
| `--type-body-l` | 400 16px/1.55 |
| `--type-body` | 400 14px/1.5 |
| `--type-caption` | 500 12px/1.4 |
| `--type-mono` | 500 13px/1.4 |

---

## 7. Componentes reutilizados

Los siguientes componentes son shared y están definidos en los archivos `components/`. Recreálos en el codebase como componentes reusables (el equivalente en tu framework):

| Nombre en prototipo | Archivo | Qué es |
|---|---|---|
| `Btn` | `components/ui-kit.jsx` | Botón (primary/secondary/ghost/icon/danger en lg/md/sm) |
| `Input`, `Select`, `Textarea` | `components/ui-kit.jsx` | Form fields |
| `Badge` | `components/ui-kit.jsx` | Pills de estatus con dot (ok/warn/bad/violet/neutral) |
| `Chip` | `components/ui-kit.jsx` | Filter chips (active / removable) |
| `Avatar` | `components/extras.jsx` | Iniciales con gradiente por tono |
| `Progress` | `components/extras.jsx` | Barra de progreso con label |
| `Card` | `components/extras.jsx` | Wrapper con header opcional |
| `Tabs` | `components/extras.jsx` | Tabs con contador |
| `Dot` | `components/extras.jsx` | Status dot |
| `MStack`, `MSection`, `MCard` | `components/mobile.jsx` | Layout mobile (stack vertical, sección con título mono) |
| `MTabBar` | `components/mobile.jsx` | Tab bar inferior fija (5 tabs) |
| `MetricMini` | `components/mobile.jsx` | KPI pequeño |
| `MFormField` | `components/mobile.jsx` | Wrapper de form field mobile |
| `MSpeiRow` | `components/mobile.jsx` | Fila key-value para datos SPEI |
| `MNotif` | `components/mobile.jsx` | Item de notificación |
| `MFlowTopBar` | `components/mobile-flow.jsx` | Top bar mobile (back + título + action) |
| `PageDots` | `components/mobile-flow.jsx` | Dots del onboarding |
| Iconos (`Ic*`) | `components/icons.jsx` | Set de iconos stroke 1.6 sobre 24×24 |

---

## 8. Interacciones & comportamiento

**`Propaily-Mobile-PWA-Spec.md`** contiene el detalle por pantalla. Lo más importante en alto nivel:

### Navegación
- **Stack-based navigation** (cada pantalla puede tener un back).
- **Tab bar inferior** (5 tabs) en pantallas principales: Inicio, Propiedades, Rentas, Avisos, Tú.
- **Tabs activos** cambian color a `--pp-600` y muestran un dot morado si hay novedades.
- En iOS Safari instalado, **respetar safe-area-inset-bottom**.

### Sheets y overlays
- Sheets de iOS (`MFlowInstall`) son **bottom sheets** con radio 14 superior, drag handle no incluido en este diseño.
- Sticky action bars en bottom (pantallas 11, 13, 20) tienen borde superior y shadow negativa.

### Forms
- Pantalla 15 (mantenimiento): botón *Enviar* deshabilitado hasta cumplir validación (categoría + descripción ≥ 20 chars + ≥ 1 foto).
- Pantalla 13 (comprobante): OCR client/server detecta monto + referencia y muestra banner verde si auto-coincide.

### Animaciones
- Splash: fade-in del logo + spinner mientras carga.
- Onboarding: slide horizontal entre pantallas.
- Toast/banner: slide-in desde top, auto-dismiss 4s.
- Sheets: slide-up desde bottom con ease-out 250ms.
- **Respetar `prefers-reduced-motion: reduce`** — deshabilitar todas las transiciones decorativas.

### Estados
Cada pantalla debe tener estos estados (NO están todos diseñados — son responsabilidad del dev):
- **Loading** (skeleton, no spinner full-screen)
- **Empty** (mensaje + CTA)
- **Error** (banner rojo con retry)
- **Offline** (banner morado sticky arriba)
- **Update available** cuando SW detecta nueva versión

---

## 9. State management

Variables de estado globales mínimas:

```ts
type AppState = {
  user: { id: string; email: string; name: string } | null;
  activeRole: 'owner' | 'tenant' | 'admin' | null;
  availableRoles: Array<'owner' | 'tenant' | 'admin'>;
  isOnline: boolean;
  swUpdateAvailable: boolean;
  unreadNotifications: number;
  pendingApprovals: number;       // solo owner
  upcomingPayments: number;       // solo tenant
  pendingTasks: number;           // solo admin
};
```

### Persistencia
- `activeRole`: JWT claim + localStorage para arranques offline.
- `installDismissedAt`: localStorage. No volver a mostrar pantalla 04 antes de 7 días.
- `onboardingDone`: localStorage flag.
- `visitCount`: localStorage incrementado en cada cold-start.

### Cache layer (sugerido: TanStack Query)
- Stale time 5min para listas (`portfolio`, `properties`, `notifications`).
- Stale time 60s para detalles.
- Optimistic updates para: marcar leído, aprobar, marcar pago.

---

## 10. PWA — implementación

### Manifest

Ver `Propaily-Mobile-PWA-Spec.md` §2.1 — está completo. Resumen:
- `display: standalone`, `orientation: portrait`
- `theme_color: #6E3AFF`, `background_color: #6E3AFF`
- Shortcuts a 3 acciones: Pagar renta, Nuevo reporte, Avisos
- Icons 192/512 + maskable 512

### Service Worker (sugerido Workbox)

| Recurso | Estrategia |
|---|---|
| App shell (HTML/JS/CSS) | Stale-while-revalidate |
| `/api/portfolio`, `/api/properties` | Network-first, cache fallback (5 min) |
| `/api/me`, `/api/role` | Network-only (nunca cacheado) |
| Imágenes de propiedad | Cache-first (100 entradas / 30 días) |

### Background Sync (CRÍTICO)
2 momentos lo requieren:
1. **Pantalla 13** — upload de comprobante (`POST /api/payments/:id/receipt`). Si no hay red, encolar en `sync-payment-receipt`.
2. **Pantalla 15** — submit de reporte de mantenimiento. Encolar en `sync-maintenance`.

### Permisos diferidos
- `Notification.requestPermission()` → tras pantalla 07 (con priming screen propio).
- `getUserMedia({video})` → al tocar *Tomar foto* en 13/15.
- `geolocation` → solo admin, al ver ruta en pantalla 17.

### iOS-specific
Safari iOS ignora la mitad del manifest. Necesitas:
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Propaily">
<link rel="apple-touch-icon" href="/icons/apple-touch-180.png">
```

---

## 11. Endpoints implícitos

Lista completa en `Propaily-Mobile-PWA-Spec.md` §7. Los más importantes:

```
POST   /api/auth/magic               { email }
GET    /api/auth/magic-status?token=...
GET    /api/me
POST   /api/role/switch              { role }

GET    /api/portfolio/summary
GET    /api/properties?page=&size=
GET    /api/properties/:id

GET    /api/approvals?role=&status=
POST   /api/approvals/:id/approve    { note }
POST   /api/approvals/:id/reject     { reason }

GET    /api/payments/upcoming
POST   /api/payments/:id/receipt     multipart
GET    /api/payments/:id/receipt/status

POST   /api/maintenance              multipart (json + files)

GET    /api/notifications?since=&unread_only=
POST   /api/notifications/:id/read

GET    /api/admin/today
GET    /api/admin/collections?status=
POST   /api/admin/collections/:id/markpaid
```

---

## 12. Analytics (mínimo viable)

13 eventos definidos en `Propaily-Mobile-PWA-Spec.md` §6. Stack sugerido: PostHog o Mixpanel. Convención: `pwa_<area>_<accion>` snake_case.

Eventos clave:
- `pwa_install_prompt_shown`, `pwa_install_accepted`, `pwa_install_dismissed`
- `pwa_login_success` con prop `via` (magic | sso)
- `pwa_role_selected`, `pwa_role_switched`
- `pwa_approval_action` con prop `action` (approve | reject | negotiate)
- `pwa_payment_submitted` con prop `auto_matched` (bool)
- `pwa_maintenance_submitted` con `photos_count`
- `pwa_offline`

---

## 13. Accesibilidad

- **Tap targets ≥ 44×44** (Apple HIG). Verificar con auditoría axe.
- **Contraste mínimo 4.5:1** para texto. Combinaciones validadas: `--pp-700` sobre `--pp-50`, `--ink-500` sobre `--ink-25`. El resto verificar.
- **VoiceOver / TalkBack:** todo botón con solo icono lleva `aria-label`.
- **`<html lang="es-MX">`** para que iOS lea pesos correctamente.
- **`prefers-reduced-motion: reduce`** deshabilita animaciones del splash y page transitions.

---

## 14. Assets

### Marca (incluidos en `assets/`)
- `assets/mark-violet.svg` — isotipo (cuadrado, morado)
- `assets/wordmark-violet.svg` — wordmark "propaily"
- `assets/app-icon.svg` — icono para PWA install

### Tipografía
- **Geist** (UI) — Google Fonts, weights 300/400/500/600/700
- **Geist Mono** (datos, catastro, coords) — weights 400/500/600

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Imágenes
**Los rectángulos rayados con clase `.pp-img-ph`** son placeholders. Reemplazar al implementar con:
- Fotos de propiedades reales (provee Propaily)
- Logos de banco para botones SPEI (BBVA, Santander, Banorte, HSBC)
- Avatars reales (o las iniciales con gradiente, ya implementadas en `Avatar`)

### Iconos
Set propio definido en `components/icons.jsx` — stroke 1.6 sobre viewBox 24×24, `currentColor`. Si prefieres usar **Lucide React** o **Tabler Icons** en el codebase real, hazlo — son visualmente equivalentes y ahorran trabajo.

---

## 15. Archivos en este paquete

```
design_handoff_mobile_pwa/
├── README.md                          ← este archivo
├── Propaily Mobile Flow.html          ← storyboard de 21 pantallas
├── Propaily-Mobile-PWA-Spec.md        ← spec detallado de PWA + por pantalla
├── tokens.css                         ← design tokens (colores, type, spacing)
├── design-canvas.jsx                  ← runtime del canvas (NO copiar al codebase)
├── assets/
│   ├── app-icon.svg
│   ├── mark-violet.svg
│   └── wordmark-violet.svg
└── components/
    ├── logo.jsx                       ← componente <PropailyMark>
    ├── icons.jsx                      ← set de iconos
    ├── ui-kit.jsx                     ← Btn, Input, Badge, Chip, Avatar, etc.
    ├── extras.jsx                     ← Avatar, Progress, Card, Tabs, Dot
    ├── app-chrome.jsx                 ← shell de escritorio (solo referencia)
    ├── dashboard.jsx                  ← incluye MapPlaceholder (usado en 09, 17)
    ├── notificaciones.jsx             ← incluye TYPE_ICON map (usado en 19, 20)
    ├── ios-frame.jsx                  ← bezel del iPhone (NO copiar al codebase)
    ├── mobile.jsx                     ← 6 pantallas existentes (login, home owner, prop detail, mant, pago, notif)
    └── mobile-flow.jsx                ← 15 pantallas nuevas del flujo
```

### Qué NO copiar al codebase de producción
- `design-canvas.jsx` — solo sirve para presentar los mocks
- `components/ios-frame.jsx` — bezel decorativo del iPhone

### Qué SÍ portar
- Estructura de pantallas (markup + estilos) de `mobile.jsx` y `mobile-flow.jsx`
- Componentes shared de `ui-kit.jsx`, `extras.jsx`, `icons.jsx`, `logo.jsx`
- `tokens.css` (importar tal cual o convertir a config de Tailwind)

---

## 16. Próximos pasos sugeridos para el dev

1. **Lee `Propaily-Mobile-PWA-Spec.md` completo** antes de empezar — tiene contexto crítico de PWA (background sync, permisos, offline, eventos).
2. **Abre `Propaily Mobile Flow.html`** en el navegador y navega las 21 pantallas. Doble click para enfocar.
3. **Decide el stack** (recomendamos Next.js + TS + Tailwind + next-pwa).
4. **Setupa los tokens** (importa `tokens.css` o vuélcalo en `tailwind.config.ts`).
5. **Construye los shared components** primero (Btn, Badge, MSection, MCard, MTabBar, MFlowTopBar). Sin ellos las pantallas no compilarán cleanly.
6. **Implementa por sub-flujo en este orden** para entregas verticales:
   1. Auth + role (06, 07, 05) — necesario para todo lo demás
   2. Onboarding + Install (01–04)
   3. Propietario (08, 09, 10, 11)
   4. Inquilino (12, 13, 14, 15, 16)
   5. Admin (17, 18)
   6. Shared (19, 20, 21)
7. **Service Worker** al final, una vez estabilizadas las pantallas.
8. **Pasa Lighthouse PWA score ≥ 90** como criterio de aceptación.

---

## 17. Checklist de aceptación

Ver `Propaily-Mobile-PWA-Spec.md` §11 — pego aquí el resumen:

- [ ] Manifest válido en Lighthouse (PWA score ≥ 90)
- [ ] Lighthouse Performance móvil ≥ 80, Best Practices ≥ 95
- [ ] Funciona instalada en iOS 17+ Safari y Android 12+ Chrome
- [ ] Funciona offline para las pantallas: 08, 09, 12, 17, 19, 21
- [ ] Background Sync probado en pantallas 13 y 15
- [ ] Push notifications activas tras pantalla 07
- [ ] Cambio de rol no requiere re-login
- [ ] Splash sale en ≤ 2.5s en una conexión 3G simulada
- [ ] CSP estricta (sin `unsafe-inline`)
- [ ] Telemetría disparando los 13 eventos del §6 del Spec

---

## 18. Preguntas frecuentes

**¿Puedo cambiar el orden de las pantallas?**
No sin hablar con el PM. El orden 01→21 viene de hipótesis de producto.

**¿Puedo usar otro framework distinto al sugerido?**
Sí — el diseño es framework-agnóstico. Lo importante es respetar pixel-perfect y los tokens.

**¿Tengo que recrear el bezel del iPhone?**
NO. El bezel solo es para presentar los mocks. La app real vive dentro del Safari/Chrome real.

**¿Los placeholders rayados se quedan así?**
No. Son `.pp-img-ph` — al implementar van imágenes reales que el equipo Propaily entrega aparte.

**Hay un detalle que no entiendo de una pantalla.**
Abre `Propaily Mobile Flow.html`, ve a la pantalla, lee el componente fuente en `components/`. Si sigue sin estar claro, pregunta al PM de Propaily.

---

*Fin del README. Cualquier duda de diseño: regresa al storyboard. Cualquier duda de comportamiento: el spec lo cubre. Cualquier duda de producto: PM de Propaily.*
