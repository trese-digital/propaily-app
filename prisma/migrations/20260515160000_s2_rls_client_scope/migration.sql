-- =============================================================================
-- S2 — RLS dual: scoping opcional a nivel Client (portal family office)
-- =============================================================================
-- Construye sobre 20260513220000_rls_rollout.
--
-- Hasta S2, RLS scopeaba SÓLO por ManagementCompany (app.management_company_id).
-- S2 añade una segunda dimensión OPCIONAL: app.client_id.
--   · NULL  → operador GF: ve toda la MC (comportamiento previo, intacto).
--   · set   → portal family office: ve SÓLO ese Client.
--
-- Implementación: el filtro se inyecta en los 4 helpers base (is_my_client,
-- is_my_portfolio, is_my_property, is_my_unit) y en las 3 policies inline
-- (Client/Portfolio/Property). is_my_lease / is_my_document delegan en esos
-- helpers, así que heredan el scoping de Client sin redefinirse.
--
-- SQL bruto (Prisma no entiende RLS). Leer antes de `migrate deploy`.
-- Sólo toca el schema `propaily`.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Backfill — marca la MC operadora de plataforma (decisión S2-C). Sin esto,
-- is-gf-staff.ts (que desde S2 usa isPlatformOperator en vez del nombre
-- literal) dejaría al staff sin acceso al backoffice en instalaciones previas.
-- -----------------------------------------------------------------------------
UPDATE propaily."ManagementCompany"
  SET "isPlatformOperator" = true
  WHERE name = 'GF Consultoría';

-- -----------------------------------------------------------------------------
-- current_client(): lee app.client_id. NULL/'' = sin scope de Client
-- (fail-open hacia el nivel MC, que sigue siendo fail-closed por current_mc()).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION propaily.current_client() RETURNS uuid AS $$
  SELECT NULLIF(current_setting('app.client_id', true), '')::uuid;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION propaily.current_client() TO propaily_app, propaily_bypass;

-- -----------------------------------------------------------------------------
-- Helpers base — se redefinen añadiendo el filtro opcional por current_client().
-- `CREATE OR REPLACE` preserva los GRANT EXECUTE previos.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION propaily.is_my_client(client_id text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM propaily."Client" c
    WHERE c.id = client_id
      AND c."managementCompanyId" = propaily.current_mc()::text
      AND (propaily.current_client() IS NULL OR c.id = propaily.current_client()::text)
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION propaily.is_my_portfolio(portfolio_id text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM propaily."Portfolio" po
    JOIN propaily."Client"    cl ON cl.id = po."clientId"
    WHERE po.id = portfolio_id
      AND cl."managementCompanyId" = propaily.current_mc()::text
      AND (propaily.current_client() IS NULL OR cl.id = propaily.current_client()::text)
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION propaily.is_my_property(property_id text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM propaily."Property"  pr
    JOIN propaily."Portfolio" po ON po.id = pr."portfolioId"
    JOIN propaily."Client"    cl ON cl.id = po."clientId"
    WHERE pr.id = property_id
      AND cl."managementCompanyId" = propaily.current_mc()::text
      AND (propaily.current_client() IS NULL OR cl.id = propaily.current_client()::text)
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION propaily.is_my_unit(unit_id text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM propaily."Unit"      u
    JOIN propaily."Property"  pr ON pr.id = u."propertyId"
    JOIN propaily."Portfolio" po ON po.id = pr."portfolioId"
    JOIN propaily."Client"    cl ON cl.id = po."clientId"
    WHERE u.id = unit_id
      AND cl."managementCompanyId" = propaily.current_mc()::text
      AND (propaily.current_client() IS NULL OR cl.id = propaily.current_client()::text)
  );
$$ LANGUAGE sql STABLE;

-- is_my_lease / is_my_document NO se redefinen: delegan en los helpers de
-- arriba, heredan el scoping de Client automáticamente.

-- -----------------------------------------------------------------------------
-- Policies inline (Client / Portfolio / Property) — mismo filtro opcional.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS client_isolation ON propaily."Client";
CREATE POLICY client_isolation ON propaily."Client"
  USING (
    "managementCompanyId" = propaily.current_mc()::text
    AND (propaily.current_client() IS NULL OR id = propaily.current_client()::text)
  )
  WITH CHECK (
    "managementCompanyId" = propaily.current_mc()::text
    AND (propaily.current_client() IS NULL OR id = propaily.current_client()::text)
  );

DROP POLICY IF EXISTS portfolio_isolation ON propaily."Portfolio";
CREATE POLICY portfolio_isolation ON propaily."Portfolio"
  USING (EXISTS (
    SELECT 1 FROM propaily."Client" c
    WHERE c.id = propaily."Portfolio"."clientId"
      AND c."managementCompanyId" = propaily.current_mc()::text
      AND (propaily.current_client() IS NULL OR c.id = propaily.current_client()::text)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM propaily."Client" c
    WHERE c.id = propaily."Portfolio"."clientId"
      AND c."managementCompanyId" = propaily.current_mc()::text
      AND (propaily.current_client() IS NULL OR c.id = propaily.current_client()::text)
  ));

DROP POLICY IF EXISTS property_isolation ON propaily."Property";
CREATE POLICY property_isolation ON propaily."Property"
  USING (EXISTS (
    SELECT 1
    FROM propaily."Portfolio" po
    JOIN propaily."Client"    cl ON cl.id = po."clientId"
    WHERE po.id = propaily."Property"."portfolioId"
      AND cl."managementCompanyId" = propaily.current_mc()::text
      AND (propaily.current_client() IS NULL OR cl.id = propaily.current_client()::text)
  ))
  WITH CHECK (EXISTS (
    SELECT 1
    FROM propaily."Portfolio" po
    JOIN propaily."Client"    cl ON cl.id = po."clientId"
    WHERE po.id = propaily."Property"."portfolioId"
      AND cl."managementCompanyId" = propaily.current_mc()::text
      AND (propaily.current_client() IS NULL OR cl.id = propaily.current_client()::text)
  ));
