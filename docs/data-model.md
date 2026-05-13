# Modelo de datos

## Entidades principales

- Platform: raiz logica del producto SaaS.
- ManagementCompany: empresa administradora.
- User: persona con acceso a la plataforma.
- Client: propietario, empresa, familia, fideicomiso u otro sujeto administrado.
- Portfolio: agrupacion de propiedades.
- Property: inmueble.
- Unit: subpropiedad o unidad rentable.
- Ownership: porcentaje de participacion sobre portafolio o propiedad.
- Document: metadata documental.
- DocumentVersion: version historica de un documento.
- DocumentCategory: categoria documental.
- DocumentApproval: flujo de aprobacion/rechazo.
- Valuation: valuacion manual o profesional.
- ValuationRequest: solicitud de valuacion profesional.
- Lease: contrato de arrendamiento.
- RentPayment: pago de renta.
- MaintenanceRequest: solicitud de mantenimiento.
- Vendor: proveedor basico.
- Task: tarea operativa.
- Comment: comentario en entidad soportada.
- Notification: notificacion in-app/email.
- PermissionGrant: permiso especifico por usuario, rol o recurso.
- PermissionTemplate: plantilla de permisos.
- AuditLog: auditoria interna.
- ChangeHistory: historial visible.
- ImportJob: importacion CSV/Excel.
- ExportJob: exportacion o reporte.

## Cliente

Campos base:

- Nombre completo o razon social.
- Tipo: persona fisica, persona moral, fideicomiso, familia, otro.
- Email principal.
- Telefono.
- Direccion fiscal.
- RFC o identificacion fiscal.
- Contacto administrativo.
- Contacto legal.
- Notas internas.
- Estado: prospecto, activo, inactivo.
- Documentos propios del cliente.

## Portafolio

- Pertenece a un cliente.
- Puede tener multiples propietarios con porcentajes.
- Puede contener multiples propiedades.
- Puede tener documentos y comentarios.

## Propiedad

Campos base:

- Nombre o alias.
- Tipo: casa, departamento, terreno, local, nave industrial, oficina, bodega, otro.
- Direccion completa.
- Ciudad, estado/provincia, pais.
- Coordenadas opcionales.
- Superficie de terreno.
- Superficie construida.
- Estado legal/documental.
- Estado operativo.
- Propietarios y porcentajes propios.
- Valor actual estimado.
- Moneda.
- Precio de compra.
- Fecha de compra.
- Valor fiscal.
- Valor comercial.
- Valor de seguro.
- Renta mensual esperada o actual.
- Gastos mensuales estimados.
- Notas internas.

## Unidad

Campos base:

- Nombre de unidad.
- Tipo: departamento, local, oficina, bodega, cuarto, otro.
- Superficie.
- Estado: disponible, rentada, mantenimiento, reservada, inactiva.
- Renta mensual.
- Moneda.
- Arrendatario actual.
- Fecha inicio de contrato.
- Fecha fin de contrato.
- Dia de pago.
- Notas internas.
- Documentos propios.

## Documentos

- Pueden asociarse a cliente, portafolio, propiedad, unidad, contrato, pago, mantenimiento o tarea.
- Tienen categoria, sensibilidad, vencimiento y estado de aprobacion.
- Todos tienen versiones.
- El archivo binario vive en storage privado.
- La base de datos conserva metadata y storage key.

## Valores financieros

- Guardar montos en centavos o unidades menores.
- Guardar moneda por registro.
- Moneda base de reportes: MXN.
- Soporte inicial para MXN y USD.
- Tipo de cambio inicial manual, con base preparada para automatico.
- Guardar tipo de cambio usado en reportes para auditoria.

## Estados

La base debe soportar estados completos, aunque la UI inicial sea simple:

- draft.
- active.
- under_review.
- archived.
- inactive.
- deleted.
