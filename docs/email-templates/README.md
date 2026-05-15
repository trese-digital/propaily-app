# Plantillas de correo — Propaily

Plantillas transaccionales **listas para producción** (HTML email-safe: tablas +
estilos inline). Se pegan en Supabase y se envían vía Resend (SMTP propio).

Diseño basado en los mockups de `inbox/email-templates/`. Variantes elegidas
(híbrido): **Reset y Confirmación → A·Minimal** · **Invitación → B·Hero**.

| Archivo | Tipo en Supabase | Variables usadas |
|---|---|---|
| `reset-password.html` | Reset Password | `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .Data.name }}` |
| `confirm-signup.html` | Confirm signup | `{{ .Token }}`, `{{ .ConfirmationURL }}`, `{{ .Email }}` |
| `invite-user.html` | Invite user | `{{ .ConfirmationURL }}`, `{{ .Data.name }}` |

> El hero morado de `invite-user.html` se degrada a color sólido en Outlook de
> escritorio (no soporta gradientes) — es esperado y se ve bien igual.

---

## 1 · Cargar las plantillas en Supabase

**Dashboard → Authentication → Email Templates.** Por cada tipo: pegar el
**asunto** y el **cuerpo** (contenido completo del `.html`).

| Plantilla | Asunto sugerido |
|---|---|
| Reset Password | `Restablece tu contraseña de Propaily` |
| Confirm signup | `Confirma tu correo · Propaily` |
| Invite user | `Te damos la bienvenida a Propaily` |

Tras guardar, probar: una recuperación de contraseña y una invitación desde
`/usuarios` (app.propaily.com).

---

## 2 · SMTP propio con Resend

Hoy Supabase envía con su remitente y un límite bajo de correos/hora — lo que
ya es riesgo para las invitaciones. Esto lo conecta a Resend para enviar desde
`@propaily.com`.

### 2.1 — Verificar el dominio en Resend

1. Resend → **Domains → Add Domain** → `propaily.com`.
2. Resend muestra varios registros DNS (un `MX` y `TXT` SPF en el subdominio
   `send`, un `TXT` DKIM en `resend._domainkey`, y un `TXT` DMARC opcional).
   **Copiar los valores EXACTOS que muestra Resend** — son específicos de la
   cuenta, no los inventes.
3. En **Cloudflare → DNS** agregar cada registro tal cual:
   - Nombre: lo que diga Resend (`send`, `resend._domainkey`, etc. — Cloudflare
     le añade `.propaily.com` solo).
   - Tipo / Contenido / Prioridad: exactamente lo que muestre Resend.
   - **Proxy status: DNS only (nube gris).**
4. En Resend, **Verify** el dominio. Esperar a que todos los registros queden
   en verde (minutos).

### 2.2 — Crear una API key

Resend → **API Keys → Create** → permiso *Sending access* → copiar la key
(empieza con `re_…`). Es la contraseña SMTP.

### 2.3 — Conectar en Supabase

**Dashboard → Project Settings → Authentication → SMTP Settings** → activar
*Enable Custom SMTP*:

| Campo | Valor |
|---|---|
| Sender email | `cuenta@propaily.com` |
| Sender name | `Propaily` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | la API key `re_…` de Resend |

Guardar. En **Authentication → Rate Limits** se puede subir el límite de envío
de correos ahora que el SMTP es propio.

> El remitente debe estar en el dominio verificado: `cuenta@propaily.com`
> requiere `propaily.com` verificado en Resend (paso 2.1).

---

## 3 · Verificación final

1. `/usuarios` en `app.propaily.com` → invitar un usuario de prueba → llega el
   correo **Invite user** desde `cuenta@propaily.com`.
2. Login → "¿Olvidaste tu contraseña?" → llega **Reset Password**.
3. Revisar que los enlaces apunten a `https://app.propaily.com/...`
   (Site URL configurada en el item 4).

---

## Fuente

Mockups originales: `inbox/email-templates/`. Si se cambia el diseño, regenerar
estos `.html` (email-safe) y volver a pegar en Supabase — Supabase no lee este
repo, las plantillas viven en su dashboard.
