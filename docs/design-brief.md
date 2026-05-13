# Brief de diseno UX/UI

## Objetivo del documento

Este documento sirve como guia para el equipo de UX/UI encargado de disenar Propaily. El objetivo es definir experiencia, flujos, pantallas, estados, componentes y criterios visuales de una plataforma web segura para administracion de portafolios inmobiliarios.

El equipo de diseno debe usar este documento junto con:

- `docs/product-context.md`
- `docs/mvp-scope.md`
- `docs/permissions.md`
- `docs/security.md`
- `docs/data-model.md`

## Producto

Propaily es una plataforma para administrar portafolios inmobiliarios. Debe permitir que una empresa administradora, propietarios, invitados e inquilinos colaboren con permisos controlados.

La plataforma debe transmitir:

- Seguridad.
- Orden documental.
- Control financiero.
- Confianza profesional.
- Claridad operativa.
- Escalabilidad para muchos clientes, propiedades y documentos.

## Usuarios principales

### Super Admin

Usuario global del SaaS. Su experiencia no es prioritaria para la primera entrega visual, pero debe existir un concepto de panel global.

Necesita:

- Ver empresas administradoras.
- Ver estado general del sistema.
- Gestionar configuraciones globales.
- Acceder a auditoria global bajo reglas estrictas.

### Admin Empresa

Usuario principal de la primera experiencia. Es quien opera la plataforma para una empresa administradora.

Necesita:

- Ver todos los clientes.
- Ver alertas criticas.
- Crear clientes, portafolios, propiedades y unidades.
- Revisar documentos pendientes.
- Aprobar documentos.
- Gestionar permisos.
- Ver tareas y vencimientos.
- Exportar reportes.

### Operador Empresa

Usuario interno que carga y mantiene informacion.

Necesita:

- Capturar datos rapidamente.
- Subir documentos.
- Ver tareas asignadas.
- Ver errores o faltantes.
- No sentirse bloqueado por controles complejos, pero sin acceso a configuracion sensible.

### Propietario

Cliente final propietario de portafolios o propiedades.

Necesita:

- Ver resumen de su patrimonio.
- Revisar propiedades y unidades.
- Ver documentos permitidos.
- Subir documentos si tiene permiso.
- Invitar usuarios con permisos controlados.
- Solicitar valuaciones.
- Ver reportes.

### Invitado

Usuario externo con acceso especifico. Ejemplos: contador, abogado, familiar, socio, valuador externo.

Necesita:

- Ver solo lo que le corresponde.
- Entender claramente sus restricciones.
- No ver informacion financiera, legal o sensible si no tiene permiso.

### Inquilino

Usuario con portal limitado.

Necesita:

- Ver datos de contrato.
- Ver pagos.
- Subir comprobantes.
- Crear solicitudes de mantenimiento.
- Ver estado de sus solicitudes.

## Estructura de navegacion recomendada

### Admin Empresa

Menu principal:

- Dashboard.
- Clientes.
- Portafolios.
- Propiedades.
- Unidades.
- Documentos.
- Rentas y pagos.
- Mantenimiento.
- Tareas.
- Reportes.
- Usuarios y permisos.
- Auditoria.
- Configuracion.

### Propietario

Menu principal:

- Mi resumen.
- Portafolios.
- Propiedades.
- Documentos.
- Rentas.
- Tareas.
- Reportes.
- Usuarios invitados.

### Inquilino

Menu principal:

- Mi contrato.
- Pagos.
- Comprobantes.
- Mantenimiento.
- Documentos permitidos.

## Dashboard Admin Empresa

Debe ser la primera pantalla prioritaria.

Contenido recomendado:

- Valor total administrado.
- Numero de clientes activos.
- Numero de portafolios.
- Numero de propiedades y unidades.
- Documentos pendientes de aprobacion.
- Documentos proximos a vencer.
- Contratos proximos a vencer.
- Pagos de renta pendientes o vencidos.
- Tareas vencidas o urgentes.
- Solicitudes de mantenimiento abiertas.
- Ultima actividad auditada.

Diseno recomendado:

- Cards de metricas arriba.
- Seccion de alertas criticas visible sin scroll en desktop.
- Tabla/lista de tareas y vencimientos.
- Acciones rapidas: nuevo cliente, nueva propiedad, subir documento, crear tarea.
- Filtros por cliente, portafolio, responsable y prioridad.

## Dashboard Propietario

Contenido recomendado:

- Valor total de sus portafolios.
- Distribucion por tipo de propiedad.
- Documentos faltantes o por vencer.
- Rentas activas.
- Tareas o solicitudes pendientes.
- Accesos compartidos.
- Reportes disponibles.

Debe sentirse ejecutivo y claro, no operativo en exceso.

## Portal Inquilino

Contenido recomendado:

- Estado del contrato.
- Fecha de inicio y fin.
- Renta mensual y dia de pago.
- Pago actual: pendiente, enviado, confirmado o vencido.
- Boton para subir comprobante.
- Historial de pagos.
- Crear solicitud de mantenimiento.
- Lista de solicitudes con estado.

Debe ser simple, movil primero y con lenguaje claro.

## Pantallas clave

### Clientes

Lista con:

- Nombre o razon social.
- Tipo de cliente.
- Estado.
- Numero de portafolios.
- Numero de propiedades.
- Valor total.
- Alertas abiertas.
- Responsable interno.

Detalle del cliente:

- Datos generales.
- Contacto administrativo.
- Contacto legal.
- Direccion fiscal.
- Documentos del cliente.
- Portafolios.
- Usuarios relacionados.
- Historial.
- Comentarios.

### Portafolios

Lista con:

- Nombre.
- Cliente.
- Propietarios y porcentajes resumidos.
- Numero de propiedades.
- Valor total.
- Moneda base.
- Estado.

Detalle:

- Resumen financiero.
- Propietarios y porcentajes.
- Propiedades.
- Documentos.
- Reportes.
- Historial.
- Comentarios.

### Propiedades

Lista con vistas:

- Tabla.
- Cards.
- Mapa futuro o opcional.

Campos visibles:

- Nombre.
- Tipo.
- Cliente.
- Portafolio.
- Ciudad/pais.
- Estado operativo.
- Estado documental.
- Valor actual.
- Renta mensual.
- Alertas.

Detalle de propiedad:

- Hero/resumen de propiedad.
- Datos generales.
- Propietarios y porcentajes.
- Valores financieros.
- Unidades.
- Documentos.
- Valuaciones.
- Rentas.
- Pagos.
- Mantenimiento.
- Tareas.
- Comentarios.
- Historial.

### Unidades

Pueden mostrarse dentro de propiedad y tambien como vista global.

Campos:

- Nombre.
- Tipo.
- Estado.
- Superficie.
- Renta mensual.
- Arrendatario actual.
- Inicio/fin contrato.
- Dia de pago.
- Documentos.

### Documentos

La experiencia documental es critica.

Debe incluir:

- Vista por categorias.
- Estado: faltante, pendiente, aprobado, rechazado, vencido, por vencer.
- Sensibilidad: normal o sensible.
- Version actual y acceso a versiones anteriores.
- Vencimiento.
- Responsable.
- Acciones disponibles segun permiso.

Estados visuales recomendados:

- Aprobado: verde sobrio.
- Pendiente: amarillo/ambar.
- Rechazado: rojo.
- Vencido: rojo intenso.
- Por vencer: naranja.
- Sensible: candado o etiqueta confidencial.

Para documentos sensibles:

- Mostrar indicador claro de confidencialidad.
- Si no puede descargar, mostrar solo boton `Ver seguro`.
- Si no tiene permiso, mostrar estado restringido sin revelar contenido innecesario.

### Permisos

La UI de permisos debe evitar complejidad excesiva.

Flujo recomendado:

1. Elegir usuario.
2. Elegir plantilla: Solo lectura, Contador, Abogado, etc.
3. Elegir alcance: cliente, portafolio, propiedad, unidad o documento.
4. Ajustar excepciones si hace falta.
5. Mostrar resumen claro antes de guardar.

Debe existir una vista tipo matriz, pero no debe ser la primera forma de configuracion para usuarios no tecnicos.

### Tareas

Campos:

- Titulo.
- Descripcion.
- Responsable.
- Fecha limite.
- Prioridad.
- Estado.
- Relacion con cliente/portafolio/propiedad/unidad/documento.
- Comentarios.

Estados:

- Pendiente.
- En proceso.
- Bloqueada.
- Completada.
- Cancelada.

### Mantenimiento

Flujo:

- Inquilino crea solicitud.
- Empresa revisa.
- Se asigna responsable o proveedor.
- Se registra prioridad, categoria, fotos, notas, costo estimado y costo real.
- Se cierra con historial y comentarios.

Estados:

- Nueva.
- En revision.
- Asignada.
- En proceso.
- Completada.
- Cancelada.

### Reportes

Reportes iniciales:

- Resumen de portafolio.
- Reporte por propiedad.
- Reporte documental.
- Reporte financiero basico.
- Exportacion PDF/CSV.

Regla UX:

- Por defecto excluir informacion sensible.
- Si el usuario tiene permiso, permitir incluir informacion sensible manualmente.
- Mostrar advertencia antes de exportar informacion sensible.

## Estados y permisos en UI

La UI nunca debe ocultar fallas de permiso de forma confusa.

Patrones recomendados:

- Si una accion no esta permitida, ocultarla cuando no aporte valor.
- Si el usuario espera tener acceso, mostrar mensaje: `No tienes permiso para realizar esta accion`.
- Para datos sensibles restringidos, mostrar placeholder: `Informacion restringida`.
- Para descarga sensible, mostrar confirmacion y razon.

## Importacion CSV/Excel

Flujo recomendado:

1. Subir archivo.
2. Vista previa.
3. Mapeo de columnas.
4. Validacion.
5. Lista de errores por fila.
6. Confirmacion.
7. Resultado: creados, actualizados, omitidos, fallidos.

La importacion debe sentirse segura y reversible. Debe advertir si impacta informacion financiera o propietarios.

## Historial y auditoria visible

Historial visible:

- Usuario.
- Fecha.
- Accion.
- Campo cambiado.
- Valor anterior.
- Valor nuevo.

Auditoria tecnica no debe exponerse en vistas normales. Solo Admin Empresa o Super Admin deben acceder a vistas avanzadas.

## Tono visual

Recomendaciones:

- Profesional, sobrio y confiable.
- Evitar una estetica demasiado inmobiliaria generica.
- Usar espacios amplios, tablas legibles y componentes densos solo donde sea necesario.
- Priorizar lectura de datos y jerarquia de alertas.
- Colores de estado consistentes.
- No abusar de gradientes.

## Componentes necesarios

- Layout con sidebar por rol.
- Header con contexto actual.
- Cards de metricas.
- Tablas con filtros persistentes.
- Drawer o panel lateral para detalles rapidos.
- Modales para confirmaciones sensibles.
- Stepper para importacion.
- Selector de alcance de permisos.
- Badge de sensibilidad documental.
- Timeline de historial.
- Comentarios con adjuntos.
- Empty states claros.
- Estados de carga y skeletons.
- Toasts para acciones operativas.

## Responsive

- Desktop primero para Admin Empresa y Operador Empresa.
- Mobile primero para Inquilino.
- Propietario debe funcionar bien en tablet y mobile.
- Tablas deben tener alternativa responsive: cards compactas o columnas prioritarias.

## Accesibilidad

- Contraste suficiente.
- Navegacion por teclado.
- Labels claros en formularios.
- Estados no dependientes solo del color.
- Confirmaciones accesibles para acciones destructivas.

## Entregables esperados del equipo UX/UI

- Mapa de navegacion por rol.
- Wireframes de baja fidelidad.
- Flujos principales.
- Design system base.
- Prototipo navegable de alta fidelidad.
- Estados vacios, error, carga y sin permiso.
- Version desktop y mobile para pantallas clave.

## Pantallas prioritarias para disenar primero

1. Login y MFA.
2. Dashboard Admin Empresa.
3. Lista y detalle de cliente.
4. Lista y detalle de propiedad.
5. Modulo de documentos.
6. Configuracion de permisos con plantillas.
7. Portal propietario.
8. Portal inquilino.
9. Tareas y mantenimiento.
10. Reportes.
