# Cloudflare Turnstile — captcha de autenticación

Protege los formularios de **login** y **signup** contra bots. Se usa Turnstile
(no reCAPTCHA) porque Supabase Auth lo integra de forma nativa: el widget genera
un token, la Server Action lo pasa a Supabase, y Supabase lo verifica con la
*secret key*. No hay endpoint de verificación propio.

El código ya está integrado (`src/components/turnstile.tsx`, login y signup).
Mientras `NEXT_PUBLIC_TURNSTILE_SITE_KEY` no exista, el widget no se renderiza
y los formularios funcionan sin captcha — activarlo es solo configuración.

---

## 1 · Crear el widget en Cloudflare

Cloudflare Dashboard → **Turnstile → Add widget**:

- **Nombre:** `Propaily Auth`
- **Hostnames:** `app.propaily.com`, `admin.propaily.com`, `localhost`
- **Widget mode:** `Managed` (recomendado)

Al crearlo, Cloudflare entrega dos llaves:
- **Site Key** — pública, va en el frontend.
- **Secret Key** — privada, va en Supabase.

---

## 2 · Configurar la Site Key en la app

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` es una variable `NEXT_PUBLIC_*` → se **inyecta
en build**, así que cambiarla exige un redeploy.

- **Local** — agregar a `.env`:
  ```
  NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...   # la Site Key
  ```
- **Producción** — agregar la misma línea a `/opt/propaily/.env` en el VPS,
  luego correr el deploy (`deploy.sh` reconstruye y toma la variable).

> Para desarrollo local sin un widget real, Cloudflare ofrece llaves de
> prueba: Site Key `1x00000000000000000000AA` (siempre pasa) y Secret Key
> `1x0000000000000000000000000000000AA`.

---

## 3 · Configurar la Secret Key en Supabase

Supabase Dashboard → **Authentication → Settings → Bot and Abuse Protection**:

- Activar **Enable Captcha protection**
- **Captcha provider:** `Turnstile`
- **Captcha secret:** pegar la *Secret Key* de Cloudflare

Guardar. Desde ese momento Supabase exige un token válido en cada
`signInWithPassword` y `signUp`.

---

## 4 · Redeploy y prueba

1. Con `NEXT_PUBLIC_TURNSTILE_SITE_KEY` ya en el `.env` del VPS, correr el
   deploy para reconstruir.
2. Abrir `https://app.propaily.com/login` → debe aparecer el widget de
   Turnstile sobre el botón.
3. Iniciar sesión con una cuenta válida → entra normal.
4. Verificar que el captcha también aparece en `/signup`.

> El orden importa: si activas el captcha en Supabase (paso 3) **antes** de
> tener la Site Key desplegada (pasos 2 y 4), los formularios fallarían porque
> Supabase exigiría un token que el frontend aún no genera. Haz 2 → 4 → 3, o
> 3 al final.
