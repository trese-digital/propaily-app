-- =============================================================================
-- Fase 4 — RLS spike (Client / Portfolio / Property)
-- =============================================================================
-- Decisión Bloque 5: dos roles DB:
--   propaily_app     — sujeto a RLS, login para queries del portal cliente.
--   propaily_bypass  — BYPASSRLS, login para queries del backoffice GF.
--
-- El scoping vive en `current_setting('app.management_company_id', true)`,
-- seteado por la app con `SET LOCAL` al inicio de cada transacción.
--
-- Esta migración es SQL bruto (no fue generada por `prisma migrate dev`).
-- Prisma no entiende RLS; lo controlamos a mano y la migración debe leerse
-- antes de un eventual `migrate deploy`.
--
-- Spike: sólo se aplican policies sobre Client / Portfolio / Property —
-- la cadena mínima para validar end-to-end que el portal cliente queda
-- correctamente aislado por managementCompanyId. Las demás tablas se
-- atacan en una migración posterior una vez verificado el approach.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) Roles (idempotente).
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'propaily_app') THEN
    CREATE ROLE propaily_app WITH LOGIN PASSWORD 'propaily_app_dev_2026';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'propaily_bypass') THEN
    CREATE ROLE propaily_bypass WITH LOGIN BYPASSRLS PASSWORD 'propaily_bypass_dev_2026';
  END IF;
END
$$;

-- -----------------------------------------------------------------------------
-- 2) Permisos. Ambos roles necesitan USAGE en el schema y SELECT/INSERT/UPDATE/
--    DELETE en las tablas. `propaily_bypass` también puede tocar el schema
--    `public` (catastro) para las queries cross-schema del visor cartográfico.
-- -----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA propaily TO propaily_app, propaily_bypass;
GRANT USAGE ON SCHEMA public   TO propaily_app, propaily_bypass;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES    IN SCHEMA propaily TO propaily_app, propaily_bypass;
GRANT USAGE, SELECT                  ON ALL SEQUENCES IN SCHEMA propaily TO propaily_app, propaily_bypass;
GRANT EXECUTE                        ON ALL FUNCTIONS IN SCHEMA propaily TO propaily_app, propaily_bypass;

GRANT SELECT                         ON ALL TABLES    IN SCHEMA public   TO propaily_app, propaily_bypass;
GRANT EXECUTE                        ON ALL FUNCTIONS IN SCHEMA public   TO propaily_app, propaily_bypass;

-- Defaults para tablas que se creen en migraciones futuras.
ALTER DEFAULT PRIVILEGES IN SCHEMA propaily
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES    TO propaily_app, propaily_bypass;
ALTER DEFAULT PRIVILEGES IN SCHEMA propaily
  GRANT USAGE, SELECT                  ON SEQUENCES TO propaily_app, propaily_bypass;
ALTER DEFAULT PRIVILEGES IN SCHEMA propaily
  GRANT EXECUTE                        ON FUNCTIONS TO propaily_app, propaily_bypass;

-- -----------------------------------------------------------------------------
-- 3) Helper: lee el setting de la transacción. Devuelve NULL si no hay tenant
--    seteado, lo que hace que las policies devuelvan FALSE (fail-closed).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION propaily.current_mc() RETURNS uuid AS $$
  SELECT NULLIF(current_setting('app.management_company_id', true), '')::uuid;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION propaily.current_mc() TO propaily_app, propaily_bypass;

-- -----------------------------------------------------------------------------
-- 4) Habilitar RLS y policies — Client (directo: tiene managementCompanyId).
-- -----------------------------------------------------------------------------
ALTER TABLE propaily."Client" ENABLE ROW LEVEL SECURITY;
ALTER TABLE propaily."Client" FORCE ROW LEVEL SECURITY;
-- FORCE: aplica también al owner. Sin FORCE, el dueño (gfc) bypassea por
-- ser owner. Queremos que sólo propaily_bypass (BYPASSRLS) ignore las
-- policies; el resto (incluido gfc desde Prisma) las respeta.

DROP POLICY IF EXISTS client_isolation ON propaily."Client";
CREATE POLICY client_isolation ON propaily."Client"
  USING ("managementCompanyId" = propaily.current_mc()::text)
  WITH CHECK ("managementCompanyId" = propaily.current_mc()::text);

-- -----------------------------------------------------------------------------
-- 5) Portfolio — llega a la MC vía Client.
-- -----------------------------------------------------------------------------
ALTER TABLE propaily."Portfolio" ENABLE ROW LEVEL SECURITY;
ALTER TABLE propaily."Portfolio" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS portfolio_isolation ON propaily."Portfolio";
CREATE POLICY portfolio_isolation ON propaily."Portfolio"
  USING (EXISTS (
    SELECT 1 FROM propaily."Client" c
    WHERE c.id = propaily."Portfolio"."clientId"
      AND c."managementCompanyId" = propaily.current_mc()::text
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM propaily."Client" c
    WHERE c.id = propaily."Portfolio"."clientId"
      AND c."managementCompanyId" = propaily.current_mc()::text
  ));

-- -----------------------------------------------------------------------------
-- 6) Property — llega a la MC vía Portfolio → Client.
-- -----------------------------------------------------------------------------
ALTER TABLE propaily."Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE propaily."Property" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS property_isolation ON propaily."Property";
CREATE POLICY property_isolation ON propaily."Property"
  USING (EXISTS (
    SELECT 1
    FROM propaily."Portfolio" po
    JOIN propaily."Client"    cl ON cl.id = po."clientId"
    WHERE po.id = propaily."Property"."portfolioId"
      AND cl."managementCompanyId" = propaily.current_mc()::text
  ))
  WITH CHECK (EXISTS (
    SELECT 1
    FROM propaily."Portfolio" po
    JOIN propaily."Client"    cl ON cl.id = po."clientId"
    WHERE po.id = propaily."Property"."portfolioId"
      AND cl."managementCompanyId" = propaily.current_mc()::text
  ));
