# Permisos

## Modelo

El sistema usara una combinacion de:

- Rol base.
- Excepciones por usuario.
- Alcance por recurso: empresa, cliente, portafolio, propiedad, unidad o documento.
- Permisos por campo sensible.
- Auditoria de cambios de permisos.

## Administracion de permisos

- Super Admin: permisos globales y empresas administradoras.
- Admin Empresa: permisos dentro de su empresa.
- Propietario: permisos de usuarios invitados sobre sus propios portafolios, con limites definidos por la empresa.
- Operador Empresa: no administra permisos por defecto.
- Invitado: no administra permisos.

## Plantillas iniciales

- Solo lectura.
- Propietario administrador.
- Familiar / socio.
- Contador.
- Abogado.
- Gestor operativo.
- Inquilino.
- Valuador externo.
- Proveedor de mantenimiento.

## Permisos de documentos

- `documents.view`: ver lista de documentos.
- `documents.preview`: abrir documento en visor.
- `documents.download`: descargar documentos.
- `documents.upload`: subir documentos.
- `documents.update`: editar nombre, categoria, vencimiento o metadatos.
- `documents.delete`: eliminar logicamente documentos.
- `documents.share`: compartir acceso.
- `documents.viewSensitive`: ver documentos sensibles.
- `documents.downloadSensitive`: descargar documentos sensibles.
- `documents.approve`: aprobar documentos segun categoria.
- `documents.reject`: rechazar documentos segun categoria.

## Permisos inmobiliarios

- `clients.view`
- `clients.create`
- `clients.update`
- `clients.delete`
- `portfolios.view`
- `portfolios.create`
- `portfolios.update`
- `portfolios.delete`
- `properties.view`
- `properties.create`
- `properties.update`
- `properties.delete`
- `units.view`
- `units.create`
- `units.update`
- `units.delete`

## Permisos financieros y sensibles

- `financials.viewValue`
- `financials.viewPurchasePrice`
- `financials.viewRent`
- `financials.updateValue`
- `financials.updateRent`
- `ownership.view`
- `ownership.update`
- `legalFiscal.view`
- `reports.export`
- `reports.exportSensitive`

## Acciones sensibles

Algunas acciones pueden requerir aprobacion, MFA o reautenticacion segun configuracion por empresa y usuario:

- Eliminar propiedad.
- Eliminar documento.
- Descargar documentos sensibles.
- Exportar reporte con datos sensibles.
- Cambiar propietarios o porcentajes.
- Cambiar permisos.
- Aprobar documentos.
- Borrado definitivo.
- Cambios financieros importantes.
