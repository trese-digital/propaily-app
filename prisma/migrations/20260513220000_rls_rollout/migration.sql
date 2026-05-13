-- =============================================================================
-- Fase 4 rollout — RLS sobre el resto del schema propaily
-- =============================================================================
-- Construye sobre 20260513210000_rls_spike_core (roles + RLS en 3 tablas core).
--
-- Approach:
--   1. Funciones helper que encapsulan los JOINS al managementCompanyId.
--   2. Policies cortas que llaman a las helpers.
--   3. Tablas administrativas (Subscription, AuditLog, ChangeHistory, etc.)
--      → REVOKE para propaily_app. Sólo propaily_bypass las toca.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helpers (STABLE, retornan boolean). Se usan en USING/WITH CHECK.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION propaily.is_my_client(client_id text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM propaily."Client" c
    WHERE c.id = client_id
      AND c."managementCompanyId" = propaily.current_mc()::text
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION propaily.is_my_portfolio(portfolio_id text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM propaily."Portfolio" po
    JOIN propaily."Client"    cl ON cl.id = po."clientId"
    WHERE po.id = portfolio_id
      AND cl."managementCompanyId" = propaily.current_mc()::text
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
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION propaily.is_my_lease(lease_id text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM propaily."Lease" l
    WHERE l.id = lease_id
      AND (
        (l."propertyId" IS NOT NULL AND propaily.is_my_property(l."propertyId"))
        OR
        (l."unitId" IS NOT NULL AND propaily.is_my_unit(l."unitId"))
      )
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION propaily.is_my_document(document_id text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM propaily."Document" d
    WHERE d.id = document_id
      AND (
        (d."clientId"    IS NOT NULL AND propaily.is_my_client(d."clientId"))
        OR (d."portfolioId" IS NOT NULL AND propaily.is_my_portfolio(d."portfolioId"))
        OR (d."propertyId"  IS NOT NULL AND propaily.is_my_property(d."propertyId"))
        OR (d."unitId"      IS NOT NULL AND propaily.is_my_unit(d."unitId"))
        OR (d."leaseId"     IS NOT NULL AND propaily.is_my_lease(d."leaseId"))
      )
  );
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION
  propaily.is_my_client(text),
  propaily.is_my_portfolio(text),
  propaily.is_my_property(text),
  propaily.is_my_unit(text),
  propaily.is_my_lease(text),
  propaily.is_my_document(text)
TO propaily_app, propaily_bypass;

-- -----------------------------------------------------------------------------
-- ManagementCompany — visible sólo la propia.
-- -----------------------------------------------------------------------------
ALTER TABLE propaily."ManagementCompany" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mc_isolation ON propaily."ManagementCompany";
CREATE POLICY mc_isolation ON propaily."ManagementCompany"
  USING (id = propaily.current_mc()::text)
  WITH CHECK (id = propaily.current_mc()::text);

-- -----------------------------------------------------------------------------
-- Membership — sólo memberships de mi MC.
-- -----------------------------------------------------------------------------
ALTER TABLE propaily."Membership" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS membership_isolation ON propaily."Membership";
CREATE POLICY membership_isolation ON propaily."Membership"
  USING ("managementCompanyId" = propaily.current_mc()::text)
  WITH CHECK ("managementCompanyId" = propaily.current_mc()::text);

-- -----------------------------------------------------------------------------
-- Unit / PropertyPhoto / Valuation / ValuationRequest — vía Property.
-- -----------------------------------------------------------------------------
ALTER TABLE propaily."Unit" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS unit_isolation ON propaily."Unit";
CREATE POLICY unit_isolation ON propaily."Unit"
  USING (propaily.is_my_property("propertyId"))
  WITH CHECK (propaily.is_my_property("propertyId"));

ALTER TABLE propaily."PropertyPhoto" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS photo_isolation ON propaily."PropertyPhoto";
CREATE POLICY photo_isolation ON propaily."PropertyPhoto"
  USING (propaily.is_my_property("propertyId"))
  WITH CHECK (propaily.is_my_property("propertyId"));

ALTER TABLE propaily."Valuation" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS valuation_isolation ON propaily."Valuation";
CREATE POLICY valuation_isolation ON propaily."Valuation"
  USING (propaily.is_my_property("propertyId"))
  WITH CHECK (propaily.is_my_property("propertyId"));

ALTER TABLE propaily."ValuationRequest" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS valreq_isolation ON propaily."ValuationRequest";
CREATE POLICY valreq_isolation ON propaily."ValuationRequest"
  USING (propaily.is_my_property("propertyId"))
  WITH CHECK (propaily.is_my_property("propertyId"));

-- -----------------------------------------------------------------------------
-- Ownership — vía Portfolio o Property (al menos uno debe matchear).
-- -----------------------------------------------------------------------------
ALTER TABLE propaily."Ownership" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ownership_isolation ON propaily."Ownership";
CREATE POLICY ownership_isolation ON propaily."Ownership"
  USING (
       ("portfolioId" IS NOT NULL AND propaily.is_my_portfolio("portfolioId"))
    OR ("propertyId"  IS NOT NULL AND propaily.is_my_property("propertyId"))
  )
  WITH CHECK (
       ("portfolioId" IS NOT NULL AND propaily.is_my_portfolio("portfolioId"))
    OR ("propertyId"  IS NOT NULL AND propaily.is_my_property("propertyId"))
  );

-- -----------------------------------------------------------------------------
-- Lease / RentPayment.
-- -----------------------------------------------------------------------------
ALTER TABLE propaily."Lease" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lease_isolation ON propaily."Lease";
CREATE POLICY lease_isolation ON propaily."Lease"
  USING (
       ("propertyId" IS NOT NULL AND propaily.is_my_property("propertyId"))
    OR ("unitId"     IS NOT NULL AND propaily.is_my_unit("unitId"))
  )
  WITH CHECK (
       ("propertyId" IS NOT NULL AND propaily.is_my_property("propertyId"))
    OR ("unitId"     IS NOT NULL AND propaily.is_my_unit("unitId"))
  );

ALTER TABLE propaily."RentPayment" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rentpayment_isolation ON propaily."RentPayment";
CREATE POLICY rentpayment_isolation ON propaily."RentPayment"
  USING (propaily.is_my_lease("leaseId"))
  WITH CHECK (propaily.is_my_lease("leaseId"));

-- -----------------------------------------------------------------------------
-- MaintenanceRequest / Document / DocumentVersion / DocumentApproval.
-- -----------------------------------------------------------------------------
ALTER TABLE propaily."MaintenanceRequest" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS maint_isolation ON propaily."MaintenanceRequest";
CREATE POLICY maint_isolation ON propaily."MaintenanceRequest"
  USING (
       ("propertyId" IS NOT NULL AND propaily.is_my_property("propertyId"))
    OR ("unitId"     IS NOT NULL AND propaily.is_my_unit("unitId"))
  )
  WITH CHECK (
       ("propertyId" IS NOT NULL AND propaily.is_my_property("propertyId"))
    OR ("unitId"     IS NOT NULL AND propaily.is_my_unit("unitId"))
  );

ALTER TABLE propaily."Document" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS document_isolation ON propaily."Document";
CREATE POLICY document_isolation ON propaily."Document"
  USING (
       ("clientId"    IS NOT NULL AND propaily.is_my_client("clientId"))
    OR ("portfolioId" IS NOT NULL AND propaily.is_my_portfolio("portfolioId"))
    OR ("propertyId"  IS NOT NULL AND propaily.is_my_property("propertyId"))
    OR ("unitId"      IS NOT NULL AND propaily.is_my_unit("unitId"))
    OR ("leaseId"     IS NOT NULL AND propaily.is_my_lease("leaseId"))
  )
  WITH CHECK (
       ("clientId"    IS NOT NULL AND propaily.is_my_client("clientId"))
    OR ("portfolioId" IS NOT NULL AND propaily.is_my_portfolio("portfolioId"))
    OR ("propertyId"  IS NOT NULL AND propaily.is_my_property("propertyId"))
    OR ("unitId"      IS NOT NULL AND propaily.is_my_unit("unitId"))
    OR ("leaseId"     IS NOT NULL AND propaily.is_my_lease("leaseId"))
  );

ALTER TABLE propaily."DocumentVersion" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS docversion_isolation ON propaily."DocumentVersion";
CREATE POLICY docversion_isolation ON propaily."DocumentVersion"
  USING (propaily.is_my_document("documentId"))
  WITH CHECK (propaily.is_my_document("documentId"));

ALTER TABLE propaily."DocumentApproval" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS docapproval_isolation ON propaily."DocumentApproval";
CREATE POLICY docapproval_isolation ON propaily."DocumentApproval"
  USING (propaily.is_my_document("documentId"))
  WITH CHECK (propaily.is_my_document("documentId"));

-- -----------------------------------------------------------------------------
-- Task / Comment — al menos uno de los anchors debe matchear.
-- -----------------------------------------------------------------------------
ALTER TABLE propaily."Task" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS task_isolation ON propaily."Task";
CREATE POLICY task_isolation ON propaily."Task"
  USING (
       ("clientId"    IS NOT NULL AND propaily.is_my_client("clientId"))
    OR ("portfolioId" IS NOT NULL AND propaily.is_my_portfolio("portfolioId"))
    OR ("propertyId"  IS NOT NULL AND propaily.is_my_property("propertyId"))
    OR ("unitId"      IS NOT NULL AND propaily.is_my_unit("unitId"))
    OR ("documentId"  IS NOT NULL AND propaily.is_my_document("documentId"))
  )
  WITH CHECK (
       ("clientId"    IS NOT NULL AND propaily.is_my_client("clientId"))
    OR ("portfolioId" IS NOT NULL AND propaily.is_my_portfolio("portfolioId"))
    OR ("propertyId"  IS NOT NULL AND propaily.is_my_property("propertyId"))
    OR ("unitId"      IS NOT NULL AND propaily.is_my_unit("unitId"))
    OR ("documentId"  IS NOT NULL AND propaily.is_my_document("documentId"))
  );

ALTER TABLE propaily."Comment" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS comment_isolation ON propaily."Comment";
CREATE POLICY comment_isolation ON propaily."Comment"
  USING (
       ("clientId"    IS NOT NULL AND propaily.is_my_client("clientId"))
    OR ("portfolioId" IS NOT NULL AND propaily.is_my_portfolio("portfolioId"))
    OR ("propertyId"  IS NOT NULL AND propaily.is_my_property("propertyId"))
    OR ("unitId"      IS NOT NULL AND propaily.is_my_unit("unitId"))
    OR ("documentId"  IS NOT NULL AND propaily.is_my_document("documentId"))
  )
  WITH CHECK (
       ("clientId"    IS NOT NULL AND propaily.is_my_client("clientId"))
    OR ("portfolioId" IS NOT NULL AND propaily.is_my_portfolio("portfolioId"))
    OR ("propertyId"  IS NOT NULL AND propaily.is_my_property("propertyId"))
    OR ("unitId"      IS NOT NULL AND propaily.is_my_unit("unitId"))
    OR ("documentId"  IS NOT NULL AND propaily.is_my_document("documentId"))
  );

-- -----------------------------------------------------------------------------
-- Vendor / Notification / ExchangeRate / ImportJob / ExportJob — directos
-- por managementCompanyId.
-- -----------------------------------------------------------------------------
ALTER TABLE propaily."Vendor" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS vendor_isolation ON propaily."Vendor";
CREATE POLICY vendor_isolation ON propaily."Vendor"
  USING ("managementCompanyId" = propaily.current_mc()::text)
  WITH CHECK ("managementCompanyId" = propaily.current_mc()::text);

ALTER TABLE propaily."Notification" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS notification_isolation ON propaily."Notification";
CREATE POLICY notification_isolation ON propaily."Notification"
  USING ("managementCompanyId" IS NULL OR "managementCompanyId" = propaily.current_mc()::text)
  WITH CHECK ("managementCompanyId" IS NULL OR "managementCompanyId" = propaily.current_mc()::text);

ALTER TABLE propaily."ExchangeRate" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS fx_isolation ON propaily."ExchangeRate";
CREATE POLICY fx_isolation ON propaily."ExchangeRate"
  USING ("managementCompanyId" = propaily.current_mc()::text)
  WITH CHECK ("managementCompanyId" = propaily.current_mc()::text);

ALTER TABLE propaily."ImportJob" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS import_isolation ON propaily."ImportJob";
CREATE POLICY import_isolation ON propaily."ImportJob"
  USING ("managementCompanyId" = propaily.current_mc()::text)
  WITH CHECK ("managementCompanyId" = propaily.current_mc()::text);

ALTER TABLE propaily."ExportJob" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS export_isolation ON propaily."ExportJob";
CREATE POLICY export_isolation ON propaily."ExportJob"
  USING ("managementCompanyId" = propaily.current_mc()::text)
  WITH CHECK ("managementCompanyId" = propaily.current_mc()::text);

-- -----------------------------------------------------------------------------
-- Subscription, AuditLog, Platform, ChangeHistory, PermissionTemplate,
-- PermissionGrant — sólo bypass. REVOKE para propaily_app y, por las dudas,
-- policy USING (false) que cierra todo si alguien grant-ea por accidente.
-- -----------------------------------------------------------------------------
REVOKE ALL ON propaily."Subscription"        FROM propaily_app;
REVOKE ALL ON propaily."AuditLog"            FROM propaily_app;
REVOKE ALL ON propaily."Platform"            FROM propaily_app;
REVOKE ALL ON propaily."ChangeHistory"       FROM propaily_app;
REVOKE ALL ON propaily."PermissionTemplate"  FROM propaily_app;
REVOKE ALL ON propaily."PermissionGrant"     FROM propaily_app;

ALTER TABLE propaily."Subscription"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE propaily."AuditLog"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE propaily."Platform"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE propaily."ChangeHistory"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE propaily."PermissionTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE propaily."PermissionGrant"    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS deny_all ON propaily."Subscription";
CREATE POLICY deny_all ON propaily."Subscription"        USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS deny_all ON propaily."AuditLog";
CREATE POLICY deny_all ON propaily."AuditLog"            USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS deny_all ON propaily."Platform";
CREATE POLICY deny_all ON propaily."Platform"            USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS deny_all ON propaily."ChangeHistory";
CREATE POLICY deny_all ON propaily."ChangeHistory"       USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS deny_all ON propaily."PermissionTemplate";
CREATE POLICY deny_all ON propaily."PermissionTemplate"  USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS deny_all ON propaily."PermissionGrant";
CREATE POLICY deny_all ON propaily."PermissionGrant"     USING (false) WITH CHECK (false);

-- -----------------------------------------------------------------------------
-- User — no tiene managementCompanyId. La sesión Supabase + el código
-- garantizan que un user accede sólo a su perfil. Por ahora SIN RLS aquí.
-- Si en el futuro queremos endurecer, agregar policy `id = current_user_uid()`
-- con un setting separado.
-- -----------------------------------------------------------------------------
