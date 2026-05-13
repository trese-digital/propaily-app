# Propaily

Aplicacion web para administrar portafolios inmobiliarios: propiedades, valuacion, documentacion, vencimientos y datos clave para su gestion.

## Objetivo

Construir una plataforma segura y escalable donde un usuario pueda:

- Ver el valor estimado y la composicion de su portafolio inmobiliario.
- Administrar propiedades, ubicaciones, datos legales, financieros y operativos.
- Cargar y organizar documentos necesarios para la administracion.
- Recibir alertas de vencimientos, faltantes documentales y tareas pendientes.

## Stack propuesto

- Next.js con App Router para frontend y backend ligero.
- TypeScript para reducir errores y facilitar crecimiento.
- PostgreSQL como base de datos transaccional.
- Prisma como ORM.
- Auth.js o Clerk/Supabase Auth para autenticacion segura.
- Almacenamiento privado de documentos en S3 compatible, Azure Blob o Supabase Storage.
- Zod para validar datos de entrada.

## Documentacion principal

- `docs/product-context.md`: contexto de producto, usuarios y reglas principales.
- `docs/mvp-scope.md`: alcance confirmado de la primera version.
- `docs/architecture.md`: arquitectura tecnica y modulos.
- `docs/data-model.md`: entidades principales y relaciones.
- `docs/security.md`: seguridad, auditoria, documentos sensibles y borrado.
- `docs/permissions.md`: roles, plantillas y permisos granulares.
- `docs/roadmap.md`: orden tecnico de implementacion.
- `docs/open-decisions.md`: decisiones futuras o pendientes.

## Estructura

```txt
src/
  app/                 Rutas web, layouts y endpoints.
  features/            Modulos por dominio de negocio.
  lib/                 Infraestructura compartida.
  server/              Codigo server-only: db, auth, storage, auditoria.
  types/               Tipos compartidos.
docs/                  Arquitectura, seguridad y roadmap.
prisma/                Esquema y migraciones de base de datos.
```

## Primeros comandos

```bash
npm install
npm run dev
```

## Principios del proyecto

- Seguridad desde el inicio: autenticacion, autorizacion, validacion, auditoria y secretos fuera del codigo.
- Crecimiento por etapas: primero portafolio y propiedades; despues documentos, valuaciones, alertas y reportes.
- Separacion por dominio: cada modulo contiene su UI, acciones, validaciones y consultas.
- Datos sensibles protegidos: documentos privados, permisos por usuario/organizacion y registro de actividad.
