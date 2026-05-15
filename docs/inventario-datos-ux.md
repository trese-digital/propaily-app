# Inventario de datos — Propaily (para UX)

> Fuente: `prisma/schema.prisma` (schema `propaily`) + schema `public` (catastro).
> Generado 2026-05-13. Este documento lista **toda la data que la base puede almacenar**.
> La columna **Estado** indica si ya tiene pantalla/UI funcional o si solo existe el modelo.

**Leyenda de estado:**
- 🟢 **Operable** — ya tiene UI funcional en la app.
- 🟡 **Parcial** — existe parte de la UI.
- 🔴 **Solo modelo** — la tabla existe en la DB pero no hay ninguna pantalla; UX diseña desde cero.

---

## 1. Estructura organizacional (jerarquía de cuentas)

La app es multi-tenant. La jerarquía es:
`Platform → ManagementCompany → Client → Portfolio → Property → Unit`

| Entidad | Estado | Qué guarda |
|---|---|---|
| **Platform** | 🔴 | La plataforma raíz. `name`. (1 sola, casi sin UI necesaria) |
| **ManagementCompany** | 🟡 | La empresa que administra inmuebles (el "tenant"). Nombre, razón legal, logo, color primario, color de acento, pie de reporte, estatus. |
| **Subscription** | 🔴 | Suscripción de la ManagementCompany. Plan (starter/growth/pro/enterprise/custom), estatus (active/paused/past_due/cancelled), 3 toggles de addon (cartografía, insights, calculadoras), fechas inicio/fin, notas. |
| **Membership** | 🔴 | Vincula un Usuario con una ManagementCompany y le da un Rol. |
| **Client** | 🔴 | Cliente de la empresa administradora. Nombre, tipo (individual/empresa/fideicomiso/familia/otro), email, teléfono, RFC, domicilio fiscal, contacto administrativo, contacto legal, notas internas, estatus. |
| **Portfolio** | 🔴 | Agrupación de propiedades de un cliente. Nombre, descripción, estatus. |

---

## 2. Inmuebles

| Entidad | Estado | Qué guarda |
|---|---|---|
| **Property** | 🟢 | El inmueble. Ver desglose abajo. |
| **PropertyPhoto** | 🟢 | Galería (máx. 24). Imagen, caption, orden, dimensiones, peso, tipo. |
| **Unit** | 🟢 | Unidad rentable dentro de una propiedad. Nombre, tipo (depto/local/oficina/bodega/cuarto/otro), área m², estatus operativo, renta mensual, moneda, inquilino actual, fechas de contrato, día de pago, notas. |
| **Ownership** | 🔴 | Titularidad/copropiedad. Nombre del titular, tipo, **% de propiedad**. Se asocia a portafolio o propiedad. |

### Campos de Property (detalle)
- **Identificación:** nombre, tipo (casa/depto/terreno/local/oficina/bodega/industrial/otro), estatus operativo (activo/disponible/rentado/en venta/en construcción/mantenimiento/reservado/inactivo), estatus legal.
- **Ubicación:** dirección, ciudad, estado, país, latitud, longitud.
- **Superficies:** área de terreno (m²), área construida (m²).
- **Valores económicos** (todos en centavos + moneda MXN/USD):
  - precio de compra + fecha de compra
  - valor actual
  - valor fiscal
  - valor comercial
  - valor de seguro
  - renta esperada
  - gastos mensuales
- **Catastro:** vínculo opcional a predio y colonia del mapa de León.
- **Otros:** foto de portada, notas internas.

---

## 3. Documentos

| Entidad | Estado | Qué guarda |
|---|---|---|
| **Document** | 🟢 | Documento. Nombre, categoría, sensibilidad (normal/sensible), estatus de aprobación, fecha de expiración. Se puede colgar de cliente, portafolio, propiedad, unidad, contrato, pago, mantenimiento o tarea. |
| **DocumentVersion** | 🟡 | Versionado del archivo. Nº de versión, archivo, tipo, peso, checksum, quién subió, motivo. |
| **DocumentApproval** | 🔴 | Flujo de aprobación. Estatus, revisor, notas. |

**Categorías de documento:** escritura, contrato de compra, contrato de arrendamiento, avalúo comercial, avalúo fiscal, identificación, poder, estado de cuenta, fiscal, seguro, plano, mantenimiento, comprobante de pago, legal, otro.

---

## 4. Valuaciones (avalúos)

| Entidad | Estado | Qué guarda |
|---|---|---|
| **Valuation** | 🔴 | Avalúo histórico de una propiedad (append-only). Tipo (manual/comercial/fiscal/seguro/profesional), valor, moneda, fecha de valuación, fuente, notas, ¿es oficial?, estatus de aprobación. |
| **ValuationRequest** | 🔴 | Solicitud de avalúo del cliente a GF. Estatus (pendiente/en progreso/completado/cancelado), notas, respuesta, fecha de completado. |

---

## 5. Rentas (administración de arrendamiento)

| Entidad | Estado | Qué guarda |
|---|---|---|
| **Lease** | 🔴 | Contrato de arrendamiento. Inquilino (nombre + email), renta mensual, moneda, día de pago, fecha inicio/fin, depósito en garantía, estatus (borrador/activo/expirado/renovado/cancelado), notas. Se asocia a propiedad o unidad. |
| **RentPayment** | 🔴 | Pago de renta. Monto, moneda, periodo (mes + año), fecha de vencimiento, fecha de pago, estatus (pendiente/comprobante subido/confirmado/vencido/cancelado), notas. |

---

## 6. Mantenimiento

| Entidad | Estado | Qué guarda |
|---|---|---|
| **MaintenanceRequest** | 🔴 | Solicitud de mantenimiento. Título, descripción, categoría (plomería/eléctrico/pintura/carpintería/limpieza/jardinería/estructural/otro), prioridad (baja/media/alta/urgente), estatus (nuevo/en revisión/asignado/en progreso/completado/cancelado), costo estimado, costo real, fecha agendada, fecha de completado. |
| **Vendor** | 🔴 | Proveedor de servicios. Nombre, tipo de servicio, contacto, teléfono, email, notas. |

---

## 7. Colaboración y operación

| Entidad | Estado | Qué guarda |
|---|---|---|
| **Task** | 🔴 | Tarea/pendiente. Título, descripción, prioridad, estatus (pendiente/en progreso/bloqueado/completado/cancelado), asignado a, creado por, fecha límite. Se asocia a cliente/portafolio/propiedad/unidad/documento. |
| **Comment** | 🔴 | Comentario. Texto, autor. Se cuelga de casi cualquier entidad. |
| **Notification** | 🔴 | Notificación al usuario. Tipo (doc por expirar, contrato por expirar, tarea asignada, invitación, avalúo actualizado, aprobación de doc, pago de renta, mantenimiento), canal (in-app/email), título, cuerpo, leída/no leída. |

---

## 8. Usuarios, permisos y seguridad

| Entidad | Estado | Qué guarda |
|---|---|---|
| **User** | 🟡 | Usuario. Email, nombre, teléfono, métodos de auth (password/google/microsoft), estatus (invitado/activo/suspendido/inactivo). |
| **PermissionTemplate** | 🔴 | Plantilla de permisos reutilizable. Nombre, descripción, JSON de permisos. |
| **PermissionGrant** | 🔴 | Permiso concreto a un usuario. Permiso, efecto (permitir/denegar), alcance (plataforma/empresa/cliente/portafolio/propiedad/unidad/documento), campo específico, expiración. |
| **AuditLog** | 🟡 | Bitácora de auditoría. Actor, acción, tipo de entidad, ID, metadata, IP, user-agent, fecha. (Se registra en backend, falta visor) |
| **ChangeHistory** | 🔴 | Historial de cambios campo por campo. Actor, entidad, campo, valor anterior, valor nuevo, resumen. |

**Roles disponibles:** super_admin, company_admin, company_operator, owner, guest, tenant, vendor.

---

## 9. Finanzas y procesos de sistema

| Entidad | Estado | Qué guarda |
|---|---|---|
| **ExchangeRate** | 🔴 | Tipo de cambio. Moneda base, moneda destino, tasa, fecha efectiva, fuente. |
| **ImportJob** | 🔴 | Trabajo de importación masiva. Tipo (clientes/portafolios/propiedades/unidades/pagos/metadata de docs), estatus, archivo, resumen. |
| **ExportJob** | 🔴 | Trabajo de exportación. Tipo (PDF/CSV/clientes/portafolios/propiedades/unidades/documentos/pagos/auditoría), ¿incluye sensible?, archivo, resumen. |

---

## 10. Catastro — schema `public` (mapa de León)

> Estos datos NO los maneja Propaily/Prisma; vienen del pipeline catastral. Ya están operables en el visor 🟢.

| Tabla | Qué guarda |
|---|---|
| **colonias** | Polígonos de colonias. Nombre, sector, tipo de zona, uso de suelo, área, observaciones. |
| **predios** | Polígonos de lotes/predios. Área m², geometría, vínculo a colonia. |
| **tramos** | Tramos de vialidad. Código de vía, vialidad, sector, descripción. |
| **valores_colonia** | Valor fiscal y comercial $/m² por colonia (año 2026), incremento YoY. |
| **valores_tramo** | Valor fiscal y comercial $/m² por tramo de vialidad. |

---

## Resumen para UX — prioridades de diseño

**Ya operable (mantener / pulir):** Propiedades (listado + detalle), Galería de fotos, Documentos, Unidades, Visor de cartografía, Dashboard.

**Modelo listo, falta TODA la UI (oportunidad de diseño):**
1. **Rentas** — contratos + pagos + calendario de vencimientos. *(producto core, alta prioridad)*
2. **Valuaciones** — histórico de avalúos por propiedad + solicitudes de avalúo.
3. **Clientes y Portafolios** — gestión de la jerarquía, hoy invisible.
4. **Mantenimiento** — solicitudes + proveedores.
5. **Tareas y Comentarios** — colaboración sobre cualquier entidad.
6. **Notificaciones** — centro de notificaciones.
7. **Usuarios y Permisos** — invitar gente, roles, permisos granulares.
8. **Suscripción** — ver plan, addons, estatus.
9. **Import/Export** — carga masiva y descarga de reportes.
10. **Auditoría** — visor de bitácora.
