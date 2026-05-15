# Propaily · Mobile PWA — Spec de implementación

> **Acompaña a:** `Propaily Mobile Flow.html`
> **Audiencia:** equipo de desarrollo que implementará `app.propaily.com` como PWA.
> **Última actualización:** v0.1 · 14 may 2026

---

## 1. Resumen

`app.propaily.com` es una **Progressive Web App** instalable, optimizada para iOS/Android, que da acceso móvil a la plataforma Propaily a **3 personas**:

| Rol | Acceso a | Mantra |
|---|---|---|
| **Propietario** | Patrimonio, propiedades, aprobaciones | *Consultar + aprobar* |
| **Inquilino** | Su contrato, pagos, mantenimiento | *Pagar + reportar* |
| **Operador GFC** | Ruta del día, cobranza, manten. en campo | *Operar en movimiento* |

La PWA **no reemplaza** el dashboard de escritorio — lo complementa. En móvil **no hay edición pesada** (no se crean propiedades, no se editan contratos). Solo flujos transaccionales y de aprobación.

---

## 2. Arquitectura PWA

### 2.1 Manifest (`/manifest.webmanifest`)

```json
{
  "name": "Propaily",
  "short_name": "Propaily",
  "description": "Tu portafolio inmobiliario en el bolsillo.",
  "start_url": "/?source=pwa",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#6E3AFF",
  "theme_color": "#6E3AFF",
  "lang": "es-MX",
  "categories": ["business", "finance", "productivity"],
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "shortcuts": [
    { "name": "Pagar renta",      "url": "/inquilino/pago",         "icons": [{ "src": "/icons/shortcut-pago.png", "sizes": "96x96" }] },
    { "name": "Nuevo reporte",    "url": "/mantenimiento/nuevo",    "icons": [{ "src": "/icons/shortcut-maint.png", "sizes": "96x96" }] },
    { "name": "Avisos",           "url": "/avisos",                 "icons": [{ "src": "/icons/shortcut-bell.png", "sizes": "96x96" }] }
  ],
  "screenshots": [
    { "src": "/screenshots/home.png",   "sizes": "1170x2532", "type": "image/png", "form_factor": "narrow" },
    { "src": "/screenshots/pago.png",   "sizes": "1170x2532", "type": "image/png", "form_factor": "narrow" }
  ]
}
```

**Cosas que iOS necesita aparte del manifest** (porque ignora la mitad):

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Propaily">
<link rel="apple-touch-icon" href="/icons/apple-touch-180.png">
<link rel="apple-touch-startup-image" href="/splash/iphone-15-pro.png" media="(device-width: 393px)">
```

### 2.2 Service Worker (`/sw.js`)

**Estrategias por tipo de recurso:**

| Recurso | Estrategia | Notas |
|---|---|---|
| `index.html`, app shell JS/CSS | **Stale-while-revalidate** | Cache versionado por hash. |
| `/api/portfolio`, `/api/properties` | **Network-first, fallback cache** | Caduca a 5 min. |
| `/api/me`, `/api/role` | **Network-only** | Nunca cacheado. |
| Imágenes de propiedad | **Cache-first** | Max 100 entradas / 30 días. |
| `/api/payments/:id` (pago hecho) | **Background Sync** | Encolar si offline. |

**Background Sync** crítico para 2 momentos:
1. `pago-comprobante-upload` (pantalla 13) — si el usuario está en SPEI sin señal, se encola y dispara cuando vuelve.
2. `mantenimiento-nuevo` (pantalla 15) — el reporte + fotos se encola.

### 2.3 Permisos requeridos

Pedirlos **diferidos**, nunca de golpe al cargar. Cada uno tiene un *priming screen* dentro de la app antes del prompt nativo.

| Permiso | Cuándo se pide | Pantalla origen |
|---|---|---|
| `Notification.requestPermission()` | Tras primer login exitoso | Después de pantalla 07 |
| `getUserMedia({video})` (cámara) | Cuando toca *Tomar foto* | Pantallas 13, 15 |
| `geolocation` | Solo rol Admin · al ver ruta | Pantalla 17 |
| `BeforeInstallPromptEvent` | Tras 2 visitas o 1 acción completada | Pantalla 04 |

---

## 3. Inventario de pantallas (21)

Numeración alineada con el storyboard `Propaily Mobile Flow.html`.

| # | ID componente | Ruta sugerida | Rol(es) | Tipo |
|---|---|---|---|---|
| 01 | `MFlowSplash` | `/splash` (transitorio) | — | Splash PWA |
| 02 | `MFlowOnboard1` | `/onboarding?step=1` | — | Onboarding |
| 03 | `MFlowOnboard2` | `/onboarding?step=2` | — | Onboarding |
| 04 | `MFlowInstall` | overlay sobre cualquier ruta | — | PWA install hint |
| 05 | `MFlowRole` | `/onboarding/rol` | — | Selector de rol |
| 06 | `MobileLogin` | `/login` | — | Auth |
| 07 | `MFlowMagicSent` | `/login/email-enviado` | — | Auth |
| 08 | `MobileHome` | `/` (owner) | Propietario | Home |
| 09 | `MobilePropDetalle` | `/propiedad/:id` | Propietario, Admin | Detalle |
| 10 | `MFlowOwnerPending` | `/aprobar` | Propietario | Bandeja |
| 11 | `MFlowApproveDetail` | `/aprobar/renovacion/:id` | Propietario | Detalle + acción |
| 12 | `MobilePago` | `/inquilino/pago` | Inquilino | Pago |
| 13 | `MFlowComprobUpload` | `/inquilino/pago/:id/comprobante` | Inquilino | Upload |
| 14 | `MFlowComprobOk` | `/inquilino/pago/:id/ok` | Inquilino | Confirmación |
| 15 | `MobileMantenimiento` | `/mantenimiento/nuevo` | Inquilino, Admin | Form |
| 16 | `MFlowCamera` | overlay (camera viewfinder) | Inquilino, Admin | PWA cámara |
| 17 | `MFlowAdminHome` | `/` (admin) | Admin | Home |
| 18 | `MFlowAdminCobranza` | `/cobranza` | Admin | Lista de cobro |
| 19 | `MobileNotif` | `/avisos` | Los 3 | Lista |
| 20 | `MFlowAvisoDetalle` | `/avisos/:id` | Los 3 | Detalle |
| 21 | `MFlowPerfil` | `/perfil` | Los 3 | Settings |

---

## 4. Specs por pantalla

### A · Primer arranque (01 → 05)

#### 01 · Splash · cold start
- **Cuándo:** primera carga después de `display: standalone` o desde el icono.
- **Duración:** mínimo 600ms, máximo 2.5s. Se prolonga mientras `/api/me` no responda.
- **Tap targets:** ninguno.
- **Datos cargados:** `/api/me` + `/api/role` + cache shell.
- **Salida feliz:** rol detectado → pantalla 08/12/17 según rol.
- **Salida fallback:** sin sesión → pantalla 02 (si nunca abrió) o 06 (si ya pasó onboarding).

#### 02–03 · Onboarding · consulta y aprueba
- 2 slides + dots. Botón **Omitir** persiste el flag `onboardingDone=true` en localStorage.
- *No* es una página separada del flujo de Auth — es un pre-paso opcional.
- Si el usuario tappea **Omitir** o termina, va a 04 (install) → 05 (rol) → 06 (login).

#### 04 · Add to Home · PWA install
- **iOS:** muestra siempre como overlay (iOS no expone API de prompt). Solo aparece después de 2 visitas (`localStorage.visitCount >= 2`).
- **Android:** escucha `beforeinstallprompt`, lo guarda, y dispara `prompt()` al tocar el CTA.
- **Cierre:** persiste `installDismissedAt`. No volver a mostrar antes de 7 días.

#### 05 · Selector de rol
- Si el usuario solo tiene 1 rol disponible, **saltar esta pantalla** y guardarlo en sesión.
- Si tiene 2+, mostrar todos los suyos resaltando el último usado.
- Persistir: `activeRole` en JWT claim + localStorage para arranques offline.

### B · Login (06 → 07)

#### 06 · Email + SSO
- Botones SSO: **Google**, **Microsoft** (los socios típicos en MX).
- Magic link como fallback. Validar email contra `/api/auth/whoami?email=...`.
- Mostrar mensaje *"¿Eres inquilino? Pide invitación"* — los inquilinos no auto-registran.

#### 07 · Revisa tu correo
- Polling cada 3s a `/api/auth/magic-status?token=...`. Cuando el usuario tappee el link en otra pestaña/dispositivo, este screen se cierra solo.
- Botones a **Gmail / Outlook / Otra app** abren el cliente vía intent (`googlegmail://` en iOS, `intent://` en Android, fallback `mailto:`).
- Cooldown de reenvío: 60s.

### C · Propietario (08 → 11)

#### 08 · Home propietario
- KPI principal: **Patrimonio · MXN** + delta trimestre. Viene de `/api/portfolio/summary`.
- Alerta superior agrupa todos los `requiresApproval=true` items.
- Lista de propiedades: paginada, 20 por carga, scroll infinito.
- Lista de próximos pagos: solo los siguientes 30 días.

#### 09 · Detalle de propiedad
- Hero con galería (swipe horizontal). Imágenes lazy-load. Reusa `/api/properties/:id/media`.
- Tabs: **Resumen · Documentos · Avalúos · Inquilino · Histórico**. Las tabs son sticky al hacer scroll.
- Card "Catastro" carga el mapa **solo cuando entra al viewport** (intersection observer).
- Datos críticos: `valor_fiscal`, `valor_comercial_m2`, `inquilino_actual`, `contrato_estado`.

#### 10 · Pendientes
- Endpoint: `GET /api/approvals?role=owner&status=pending`.
- Orden: por fecha de vencimiento ascendente.
- Acciones rápidas: **Ver detalles** (pantalla 11) o **Aprobar** directo (modal de confirmación).

#### 11 · Aprobar renovación · detalle
- 3 acciones en barra inferior pegajosa:
  - **Negociar** → abre composer de mensaje a inquilino vía Propaily.
  - **Aprobar propuesta** → `POST /api/approvals/:id/approve` → toast → vuelve a 10.
  - (En menú `...`) **Rechazar con motivo**.
- Auditoría: cada acción crea entry en `/api/audit-log`.

### D · Inquilino (12 → 16)

#### 12 · Próximo pago · SPEI
- Hero card con monto + fecha. Datos SPEI **copiables al tocar** (`navigator.clipboard`).
- CTA *Pagar ahora con SPEI*: abre intent bancaria si el dispositivo la soporta (`spei://`), fallback a la lista de bancos.
- CTA *Subir comprobante* → pantalla 13.

#### 13 · Subir comprobante
- 2 fuentes: cámara (pantalla 16) o galería (`<input type="file" accept="image/*,application/pdf">`).
- OCR client-side o server-side detecta **monto + referencia**; si coinciden, banner verde de auto-conciliación.
- Tamaño máximo: 8MB. Si excede, comprime con `canvas` antes de subir.
- Persiste en IndexedDB hasta que el upload termine (recuperable si la app se cierra).

#### 14 · Comprobante enviado
- Folio único `PP-YYYY-NNNNNN` generado en server.
- Empuja al usuario a 2 acciones: descargar comprobante (PDF) o volver al inicio.
- Próximo paso: **push notification cuando el admin concilie** (máx. 24h).

#### 15 · Nueva solicitud de mantenimiento
- Form con 5 campos: propiedad, categoría, prioridad, descripción, fotos.
- Si el inquilino solo tiene 1 propiedad, el selector se pre-llena y se colapsa.
- `Enviar` queda **deshabilitado** hasta tener: categoría + descripción ≥ 20 chars + ≥ 1 foto.
- En offline: queda en cola (Background Sync `sync-maintenance`).

#### 16 · Cámara · viewfinder
- `<video>` con `srcObject = getUserMedia({video: { facingMode: 'environment' }})`.
- Captura: `canvas.drawImage(videoEl)`. EXIF stripping antes de subir.
- Permite hasta 5 fotos por reporte. Reordenar con drag.
- Flash: si el dispositivo lo soporta vía `ImageCapture.setOptions({fillLightMode: 'flash'})`.

### E · Admin (17 → 18)

#### 17 · Home admin (hoy)
- Card oscuro con resumen del día: visitas, cobros, mantenimiento. Tappear el card abre la agenda completa.
- Mapa: previsualización con pines de la ruta. Tappear abre la ruta en Google Maps/Apple Maps vía deep link.
- **Urgentes** son los items con `priority >= high` o `daysOverdue > 7`.

#### 18 · Cobranza
- Progress bar del mes con `% cobrado`. Color cambia según meta.
- Chips de filtro persisten en URL (`?filter=overdue`).
- Acciones por inquilino:
  - **Llamar** → `tel:`.
  - **WhatsApp** → `https://wa.me/52...` con mensaje precargado (template traducido a su contexto).
  - **Marcar pago** → modal de confirmación + nota.

### F · Compartido (19 → 21)

#### 19 · Avisos
- Tabs persisten en URL. Pull-to-refresh dispara `/api/notifications?since=...`.
- Agrupado por **Hoy / Ayer / Esta semana / Más antiguo**.
- No leídos: fondo morado claro + dot azul a la izquierda.

#### 20 · Detalle de aviso
- El tipo del aviso determina el layout del cuerpo. Esta pantalla es del tipo `overdue`.
- Sticky action bar con la acción primaria según el tipo del aviso (ver tabla en §5).

#### 21 · Perfil
- Avatar grande + email + rol activo.
- Switch de rol **sin re-login** — emite nuevo JWT con el claim actualizado.
- Cerrar sesión limpia: localStorage, sessionStorage, indexedDB, caches del SW.

---

## 5. Tipos de aviso → CTA en detalle (pantalla 20)

| Tipo | Color | CTA primaria | CTA secundaria |
|---|---|---|---|
| `overdue` | rojo | Marcar como pagado | Reenviar aviso |
| `doc-exp` | ámbar | Renovar avalúo | Posponer 7d |
| `mention` | morado | Ver tarea | Marcar leído |
| `maintenance` | azul | Ver tarjeta kanban | Actualizar ETA |
| `payment` | verde | Ver comprobante | — |
| `invite` | morado | Ver perfil del nuevo | — |
| `valuation` | azul | Ver detalle propiedad | Aceptar valor |
| `approval` | verde | Ver documento aprobado | — |
| `task` | morado | Ver tarea | — |

---

## 6. Eventos analíticos (mínimo viable)

Convención: `pwa_<area>_<accion>` en snake_case. Stack sugerido: PostHog o Mixpanel.

| Evento | Disparo | Propiedades |
|---|---|---|
| `pwa_install_prompt_shown` | Pantalla 04 al render | `source` (visit2, action-completed) |
| `pwa_install_accepted` | `beforeinstallprompt.prompt() === 'accepted'` | — |
| `pwa_install_dismissed` | Cancela el prompt | — |
| `pwa_role_selected` | Pantalla 05 | `role` |
| `pwa_login_magic_sent` | POST `/auth/magic` | `email_domain` |
| `pwa_login_success` | sesión abierta | `role`, `via` (magic, sso) |
| `pwa_approval_action` | Pantalla 11 | `action` (approve, negotiate, reject), `type` |
| `pwa_payment_submitted` | Pantalla 14 carga | `amount`, `auto_matched` (bool) |
| `pwa_maintenance_submitted` | Pantalla 15 envío | `category`, `priority`, `photos_count` |
| `pwa_camera_opened` | Pantalla 16 | `from_screen` |
| `pwa_role_switched` | Pantalla 21 | `from`, `to` |
| `pwa_offline` | SW reporta sin conexión | `route` |

---

## 7. Endpoints implícitos en el flujo

Lista no exhaustiva — solo lo nuevo o tocado por el móvil.

```
GET    /api/me
GET    /api/role
POST   /api/role/switch         { role }

POST   /api/auth/magic          { email }
GET    /api/auth/magic-status?token=...
POST   /api/auth/logout

GET    /api/portfolio/summary
GET    /api/properties?page=&size=
GET    /api/properties/:id
GET    /api/properties/:id/media

GET    /api/approvals?role=&status=
GET    /api/approvals/:id
POST   /api/approvals/:id/approve   { note }
POST   /api/approvals/:id/reject    { reason }
POST   /api/approvals/:id/negotiate { message }

GET    /api/payments/upcoming
POST   /api/payments/:id/receipt    multipart (file)
GET    /api/payments/:id/receipt/status

POST   /api/maintenance             multipart (json + files)
GET    /api/maintenance/:id

GET    /api/admin/today
GET    /api/admin/collections?status=
POST   /api/admin/collections/:id/markpaid { method, note }

GET    /api/notifications?since=&unread_only=
POST   /api/notifications/:id/read
POST   /api/notifications/mark-all-read

GET    /api/audit-log?entity=&id=
```

---

## 8. Diseño · qué reusar de `tokens.css`

- **No introducir colores nuevos.** Toda paleta sale de `--pp-*` y `--ink-*`.
- Sombras siempre vía `--shadow-*` (tienen tinte morado).
- Type scale fija — no inventar tamaños.
- Radios: chips/badges = `--r-full`, cards = `--r-lg`, botones = `--r-md`.
- Estados semánticos: `--ok / --warn / --bad / --info` (no hex sueltos).

**Mobile-specific tokens** que añadir (no existen aún):

```css
:root {
  --m-tap: 44px;             /* hit target mínimo iOS */
  --m-tab-bar-h: 60px;
  --m-safe-bottom: env(safe-area-inset-bottom, 24px);
  --m-safe-top: env(safe-area-inset-top, 54px);
  --m-sheet-r: 22px;         /* bottom sheets */
}
```

---

## 9. Accesibilidad

- **Tap targets ≥ 44×44.** Las pantallas del storyboard ya cumplen; verificar en código.
- Contraste mínimo 4.5:1 para texto. Las combinaciones `--pp-700` sobre `--pp-50` y `--ink-500` sobre `--ink-25` están validadas; el resto **verificar al implementar**.
- Soporte VoiceOver / TalkBack: cada botón con `aria-label` cuando solo tenga icono.
- Modo *Reduce Motion*: deshabilitar animaciones del splash y transiciones de página.
- Idioma: `<html lang="es-MX">` para que iOS lea correctamente cantidades en pesos.

---

## 10. Estados que faltan documentar (pero deben existir)

El storyboard cubre los happy paths. Para implementar también hace falta:

- **Empty states** para: propiedades, avisos, pendientes, cobranza, mantenimiento, pagos.
- **Error / failure**: fallo de red en login, comprobante rechazado, mantenimiento que no se subió.
- **Loading skeleton** para todas las listas (no spinners enteros).
- **Offline banner** (sticky arriba) cuando `navigator.onLine === false`.
- **Update available** cuando el SW detecta nueva versión: banner morado *"Hay una nueva versión, toca para refrescar"*.
- **Force update** si el servidor rechaza el JWT por versión (`410 Gone` → wipe SW + reload).

Estas no son nuevas pantallas — son **variantes** de las 21 existentes. Documentarlas como tales al implementar.

---

## 11. Checklist de aceptación

- [ ] Manifest válido en Lighthouse (PWA score ≥ 90).
- [ ] Lighthouse Performance móvil ≥ 80, Best Practices ≥ 95.
- [ ] Funciona instalada en iOS 17+ Safari y Android 12+ Chrome.
- [ ] Funciona offline para las pantallas: 08, 09, 12, 17, 19, 21.
- [ ] Background Sync probado en pantallas 13 y 15.
- [ ] Push notifications activas tras pantalla 07.
- [ ] Cambio de rol no requiere re-login.
- [ ] Splash sale en ≤ 2.5s en una conexión 3G simulada.
- [ ] Cero llamadas a APIs externas que no sean propaily.com.
- [ ] CSP estricta. No `unsafe-inline`.
- [ ] Telemetría disparando los 13 eventos del §6.

---

*Fin del documento. Para dudas de diseño volver al storyboard `Propaily Mobile Flow.html`. Para dudas de producto, hablar con el PM antes de cambiar el orden de las pantallas.*
