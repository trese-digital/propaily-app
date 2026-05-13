# Seguridad

## Principios

- Validar toda entrada en servidor.
- Autorizar cada lectura, escritura, descarga, exportacion y accion sensible en servidor.
- No confiar en controles de UI como barrera de seguridad.
- Separar documentos normales y documentos sensibles.
- Registrar auditoria para eventos relevantes.
- Aplicar MFA/reautenticacion en roles y acciones sensibles.

## Autenticacion

- Email y contrasena.
- Google/Microsoft.
- MFA para Super Admin, Admin Empresa y usuarios con permisos sensibles.
- Sesiones seguras con expiracion y revocacion.

## Documentos sensibles

Se consideran sensibles desde el inicio:

- Escrituras.
- Contratos de compraventa.
- Contratos de arrendamiento.
- Avaluos.
- Identificaciones oficiales.
- Poderes notariales.
- Estados de cuenta o informacion bancaria.
- Documentos fiscales.
- Polizas de seguro.
- Documentos legales o judiciales.

## Seguridad documental

- Storage privado.
- URLs firmadas de corta duracion.
- Visor seguro para documentos sensibles.
- Marca de agua simple: `Confidencial`.
- Descarga de documentos sensibles solo si existe permiso explicito.
- Registro de apertura, vista previa, descarga, carga, eliminacion y aprobacion.
- Versionado de todos los documentos.
- Aprobacion configurable por categoria documental.

## Auditoria obligatoria

Auditar desde primera version:

- Inicio de sesion.
- Creacion, edicion y eliminacion de propiedades.
- Creacion, edicion y eliminacion de portafolios.
- Subida, descarga, edicion y eliminacion de documentos.
- Accesos a documentos sensibles.
- Cambios de permisos.
- Invitaciones de usuarios.
- Cambios de valores financieros.
- Solicitudes de valuacion.
- Exportacion o generacion de reportes.
- Aprobaciones y rechazos.
- Borrado definitivo.

## Historial visible vs auditoria interna

- Historial visible: muestra campo cambiado, valor anterior y valor nuevo cuando aplique.
- Auditoria interna: conserva detalle alto como IP, dispositivo, user agent, origen y metadata tecnica.
- Cambios sensibles solo deben ser visibles para usuarios autorizados.

## Borrado y retencion

- Borrado logico por defecto.
- Borrado real solo por obligacion legal, solicitud formal o proceso autorizado.
- Todo borrado real debe requerir auditoria y aprobacion.

## Antes de produccion

- Definir aviso de privacidad.
- Definir politica de retencion documental.
- Configurar backups automaticos.
- Configurar monitoreo y alertas.
- Configurar CSP completa.
- Configurar rate limiting.
- Evaluar antivirus o escaneo de documentos.
