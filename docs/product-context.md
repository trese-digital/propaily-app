# Contexto de producto

## Vision

Propaily es una aplicacion web para administrar portafolios inmobiliarios de forma segura, trazable y escalable. La plataforma centraliza clientes, propietarios, portafolios, propiedades, unidades, documentos, rentas, pagos, mantenimiento, tareas, comentarios, reportes y auditoria.

## Jerarquia del producto

La jerarquia base confirmada es:

```txt
Platform
ManagementCompany
Client
Portfolio
Property
Unit
```

## Tipos de usuarios

- Super Admin: administra la plataforma SaaS global.
- Admin Empresa: administra una empresa administradora.
- Operador Empresa: carga y gestiona informacion operativa sin administrar permisos globales.
- Propietario: accede a sus portafolios y puede administrar segun permisos.
- Invitado: usuario externo con permisos limitados.
- Inquilino: accede a contrato, pagos, comprobantes y mantenimiento.
- Proveedor: base preparada para acceso futuro; en MVP se maneja catalogo basico.

## Principios funcionales

- La empresa administradora y el propietario pueden operar informacion segun permisos.
- Los propietarios pueden invitar usuarios externos, con aprobacion y control de la empresa.
- Los permisos son granulares por rol, usuario, recurso y campo sensible.
- Los documentos son parte central del producto y deben manejar versiones, categorias, vencimientos y aprobaciones.
- La auditoria y el historial visible son obligatorios desde la primera version.
- El sistema debe soportar varias empresas administradoras en el futuro.

## Alcance geografico e idioma

- Pais configurable por propiedad.
- Mexico como base legal inicial.
- Arquitectura preparada para otros paises.
- Interfaz inicial en espanol.
- Arquitectura preparada para ingles posteriormente.

## Branding por empresa

Cada empresa administradora podra configurar:

- Logo.
- Colores.
- Firma en reportes.

Branding completo, dominios personalizados y plantillas avanzadas quedan para etapas posteriores.
