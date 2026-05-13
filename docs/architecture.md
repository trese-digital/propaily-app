# Arquitectura

## Stack propuesto

- Next.js con App Router.
- TypeScript estricto.
- PostgreSQL.
- Prisma.
- Zod para validacion.
- Capa abstracta de storage para documentos.
- Email transaccional por proveedor intercambiable.
- Autenticacion con email/password, Google/Microsoft y MFA para roles sensibles.

## Jerarquia multiempresa

```txt
Platform
  ManagementCompany
    InternalUsers
    Clients
      Portfolios
        Properties
          Units
```

## Capas del codigo

- `src/app`: rutas, paginas, layouts y handlers.
- `src/features`: modulos de negocio por dominio.
- `src/server`: codigo server-only como db, auth, permisos, auditoria y storage.
- `src/lib`: utilidades compartidas sin logica sensible.
- `prisma`: esquema persistente y migraciones.
- `docs`: decisiones de producto, seguridad y arquitectura.

## Modulos principales

- Identidad y autenticacion.
- Empresas administradoras.
- Usuarios, roles, permisos y plantillas.
- Clientes y propietarios.
- Portafolios.
- Propiedades.
- Unidades o subpropiedades.
- Porcentajes de propiedad.
- Documentos.
- Valuaciones.
- Rentas.
- Pagos de renta.
- Portal de propietario.
- Portal de inquilino.
- Mantenimiento.
- Proveedores.
- Tareas.
- Comentarios.
- Reportes.
- Importaciones y exportaciones.
- Notificaciones.
- Historial visible.
- Auditoria interna.

## Decisiones arquitectonicas clave

- Organizaciones y empresas administradoras desde el inicio.
- Clientes separados de usuarios: un cliente puede ser persona fisica, moral, fideicomiso, familia u otro.
- Portafolios con multiples propietarios y porcentajes.
- Propiedades con estructura propia de propietarios y porcentajes.
- Unidades desde primera version.
- Documentos como metadata en base de datos y binarios en storage privado.
- Borrado logico por defecto.
- Borrado definitivo solo por proceso autorizado y auditado.
- Historial visible separado de auditoria interna.
- Permisos evaluados siempre en servidor.

## Integraciones futuras preparadas

- Tipo de cambio automatico.
- IA.
- Pagos en linea.
- Acceso de proveedores externos.
- Facturacion SaaS.
- Storage especifico segun proveedor elegido.
