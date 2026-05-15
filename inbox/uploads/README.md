# Propaily — Handoff de identidad v1

Paquete listo para que dev actualice la plataforma con la nueva identidad.

## Contenido

```
propaily-handoff/
├── README.md                ← este archivo
├── tokens.css               ← Variables CSS (drop-in)
├── tokens.json              ← Mismos tokens en JSON (Style Dictionary)
├── assets/
│   └── logo/
│       ├── wordmark-violet.svg     ← Logo principal (sobre fondo claro)
│       ├── wordmark-white.svg      ← Sobre fondo oscuro / fotos
│       ├── wordmark-black.svg      ← Mono — impresión / sello
│       ├── mark-violet.svg         ← Solo isotipo "P" (favicon, app)
│       ├── mark-white.svg          ← Isotipo blanco
│       ├── app-icon.svg            ← App icon 512×512 con gradiente
│       └── lockup-endorsed.svg     ← Wordmark + "by GF Consultoría"
├── Propaily.html            ← Referencia visual (manual de marca + UI)
├── tokens.css               (raíz también, igual al de propaily-handoff/)
├── design-canvas.jsx
└── components/              ← Código de referencia (React) de cada pantalla
```

---

## 1 · Marca

- **Color primario:** `#6E3AFF` (var: `--pp-500`)
- **Logo:** wordmark "propaily" en morado primario. La "P" como isotipo se usa
  para favicon, app icon, avatares y como acento dentro de la app.
- **Endoso GFC:** "BY GF CONSULTORÍA" en `Geist Mono`, uppercase, letter-spacing
  `0.18em`, color con 55% opacidad del wordmark. Aparece solo en lockups
  principales (landing footer, tarjetas, primera pantalla de login).
- **Espacio mínimo (clearspace):** la altura de la "P" del wordmark en todas direcciones.
- **Tamaño mínimo:** 80 px de ancho para wordmark · 24 px para mark.

### Do
- Morado **solo** para acción primaria y data destacada.
- Geist Mono **solo** para data (coords, folios, $, dimensiones) y micro-etiquetas
  uppercase.
- Sombras con tinte morado (ya en tokens).

### Don't
- No usar morado en bloques de texto largos.
- No degradados arcoíris ni el morado mezclado con cyan/verde fuera del logo de la
  app icon.
- No deformar ni inclinar el wordmark.
- No reescribir el endoso GFC con otro tipo o tamaño.

---

## 2 · Tipografía

| Rol         | Familia    | Uso                                          |
|-------------|------------|----------------------------------------------|
| UI / texto  | Geist      | Todo el chrome de la app, headings, body     |
| Data        | Geist Mono | $, coords, folios, dimensiones, IDs, kbd     |

Carga desde Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

Escala completa en `tokens.css` (variables `--type-*`) y en `tokens.json`.

---

## 3 · Color

Dos rampas + 4 semánticos.

```
purple   50 100 200 300 400 [500★] 600 700 800 900 950
ink       0  25  50 100 200  300 400 500 600 700 800 900
semantic  success #10B981 · warning #F59E0B · danger #EF4444 · info #3B82F6
```

**Reglas:**
- Componentes consumen **roles** (`--bg`, `--fg`, `--accent`…), no las rampas
  crudas. Si un rol no existe para tu caso, primero proponemos uno nuevo,
  luego lo usas — no muestrees `--ink-300` directo en código de producto.
- Modo oscuro: `[data-theme="dark"]` ya remapea los roles en `tokens.css`.

---

## 4 · Componentes — guía rápida

Ver `Propaily.html` (sección "Sistema visual" → "Componentes") para anatomía
exacta de cada uno. Patrones clave:

| Componente   | Notas                                                                 |
|--------------|-----------------------------------------------------------------------|
| Botón        | 3 tamaños · `primary` morado · `secondary` blanco · `ghost` · `danger` |
| Input        | h36 · radio 8 · border `--ink-200` · `leading`/`trailing` opcionales  |
| Badge        | Pill con dot · 6 tonos · h22 ideal para densidad de tabla             |
| Chip         | Pill clickeable · variantes `active` y removible                      |
| Tabla        | Header uppercase `Geist Mono` 11/0.04em · filas alternadas en zebra   |
| Inspector    | Panel lateral 360px con tabs + footer pegado de acciones              |
| Documento    | Fila con icono cuadrado · sensitivity pill · acciones a la derecha    |
| KPI          | Label mono uppercase · número grande tabular · delta como Badge + spark |

---

## 5 · Plataforma — pantallas

Las pantallas de referencia están en `components/`:

- `dashboard.jsx` — Home con KPIs, mapa-preview, actividad, tareas, propiedades recientes.
- `cartografia.jsx` — Mapa fullbleed + inspector tabbed (Colonia / Tramo / Lote) + watermark + banner "modo vincular".
- `propiedades.jsx` — Listado grid con filtros chip + ordenamiento.
- `detalle.jsx` — Hero con foto, tabs, datos catastrales (área real vs catastro), galería, unidades, documentos, rail con valor + mini-mapa + ingresos 12m + equipo.
- `landing.jsx` — propaily.com home (hero, mock app, features, comparativa, pricing, footer).

El chrome compartido (rail + sidebar + topbar) está en `app-chrome.jsx`.

---

## 6 · Watermark / seguridad visual

Toda exportación (PDF, imagen) debe llevar:
- Email del usuario logueado
- Timestamp ISO
- IP opcional para audit logs

Estilo: `Geist Mono` 10px, color con 35% opacidad, rotación −10°, repetido en
diagonal con `repeating-linear-gradient`. Ver ejemplo en
`components/brand-direction-data.jsx`.

---

## 7 · Próximos pasos sugeridos

- [ ] Validar tipografía con stakeholders (alternativa: IBM Plex Sans + Mono si licencia es problema)
- [ ] Flow de Login / Signup
- [ ] Empty states (sin propiedades, sin documentos, sin permisos)
- [ ] Toasts y system messages
- [ ] Vista de Equipo & Permisos
- [ ] Audit log
- [ ] Mobile (consultar/aprobar — no edición)

---

Cualquier duda con tokens o componentes, ver `Propaily.html` con la sección
correspondiente como fuente de verdad visual.
