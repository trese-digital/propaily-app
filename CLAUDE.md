# Claude Code — Propaily

@AGENTS.md

## Notas específicas para Claude Code

- **Subagentes públicos** viven en `~/.claude/agents/`: invócalos con `@nombre` o deja que la auto-selección los elija según contexto.
- **Subagentes custom del proyecto** viven en `.claude/agents/`: `propaily-ux-forms` para formularios largos.
- **Skills del ecosistema** (`frontend-design`, `webapp-testing`, `pdf`, `docx`, `xlsx`, `pptx`) se cargan automáticamente cuando son relevantes.
- **Plugins** de Supabase (`supabase`, `postgres-best-practices`) están instalados a nivel user y se auto-invocan en tareas de RLS, auth, queries optimizadas.

## Workflow recomendado

1. **Tareas multi-archivo / features nuevas:** invoca primero `Plan` para diseñar, luego ejecuta por dominio (`@geospatial-engineer`, `@prisma-expert`, etc.).
2. **Búsqueda en codebase:** usa `Explore` antes de pedir cambios para asegurar contexto correcto.
3. **Antes de cada commit:** `npm run typecheck && npm run lint`, luego `/review` si tocaste >10 líneas.
4. **Antes de mergear cambios sensibles** (auth, billing, RLS): `/security-review` obligatorio.
5. **Cuando dudes entre dos enfoques:** lee la sección 6 de AGENTS.md (reglas no negociables) antes de elegir.

## Comandos útiles

```bash
npm run typecheck              # tsc --noEmit
npm run lint                   # eslint
npm run db:migrate             # prisma migrate dev
npm run db:studio              # prisma studio (UI de DB)
ssh deploy@177.7.40.42 "/opt/propaily/deploy.sh"   # deploy a producción
```
