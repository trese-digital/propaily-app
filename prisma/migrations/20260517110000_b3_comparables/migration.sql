-- =============================================================================
-- Bloque 3 — Comparables de mercado (backoffice GF)
-- =============================================================================
-- Agrega el modelo `Comparable`: datos de mercado recopilados por GF
-- (avalúos, portales, etc.) que alimentan a Insights.
--
-- `Comparable` NO es tenant-scoped: es inteligencia de mercado compartida,
-- propiedad de GF. Excepción legítima a la regla de multi-tenancy (AGENTS.md
-- §2). Los comparables crudos solo los ve staff GF → la tabla se bloquea para
-- el rol `propaily_app` y solo `propaily_bypass` (BYPASSRLS) la lee/escribe.
--
-- Migración escrita a mano (no hay DB local). Sigue el patrón RLS del proyecto:
-- roles `propaily_app` / `propaily_bypass`, `ENABLE ROW LEVEL SECURITY` sin
-- `FORCE` (ver migración `rls_rollout`).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) Enums nuevos (schema propaily)
-- -----------------------------------------------------------------------------
CREATE TYPE propaily."ComparableTipo" AS ENUM (
  'avaluo',
  'pagina_web',
  'portal_inmobiliario',
  'valuacion_propaily',
  'otro'
);

CREATE TYPE propaily."ComparableLocationStatus" AS ENUM (
  'geolocalizado',
  'colonia_manual',
  'sin_ubicar'
);

-- -----------------------------------------------------------------------------
-- 2) Tabla Comparable — NO tenant-scoped (data de mercado de GF)
-- -----------------------------------------------------------------------------
CREATE TABLE propaily."Comparable" (
  "id"                TEXT PRIMARY KEY,
  "valueCents"        BIGINT NOT NULL,
  "currency"          propaily."Currency" NOT NULL DEFAULT 'MXN',
  "comparableDate"    TIMESTAMP(3) NOT NULL,
  "tipo"              propaily."ComparableTipo" NOT NULL,
  "propertyType"      propaily."PropertyType" NOT NULL,
  "landAreaSqm"       DECIMAL(14,2),
  "builtAreaSqm"      DECIMAL(14,2),
  "ageYears"          INTEGER,
  "usoSuelo"          TEXT,
  "latitude"          DECIMAL(10,7),
  "longitude"         DECIMAL(10,7),
  "coloniaId"         UUID,            -- apunta a public.colonias (sin FK declarada)
  "sectorNumber"      INTEGER,
  "locationStatus"    propaily."ComparableLocationStatus" NOT NULL,
  "address"           TEXT,
  "source"            TEXT,
  "notes"             TEXT,
  "sourceValuationId" TEXT,            -- si el comparable deriva de un Valuation comercial (Valuation.id es TEXT)
  "createdById"       TEXT,            -- User.id es TEXT
  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt"         TIMESTAMP(3) NOT NULL,
  "deletedAt"         TIMESTAMP(3)
);

COMMENT ON TABLE propaily."Comparable" IS
  'Comparables de mercado de GF (no tenant-scoped). Solo accesible por staff GF via propaily_bypass.';

-- -----------------------------------------------------------------------------
-- 3) Índices
-- -----------------------------------------------------------------------------
CREATE INDEX "Comparable_coloniaId_idx"      ON propaily."Comparable"("coloniaId");
CREATE INDEX "Comparable_sectorNumber_idx"   ON propaily."Comparable"("sectorNumber");
CREATE INDEX "Comparable_comparableDate_idx" ON propaily."Comparable"("comparableDate");
CREATE INDEX "Comparable_tipo_idx"           ON propaily."Comparable"("tipo");

-- -----------------------------------------------------------------------------
-- 4) Property: flag de exclusión de comparables (confidencialidad)
-- -----------------------------------------------------------------------------
ALTER TABLE propaily."Property"
  ADD COLUMN "excluirDeComparables" BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN propaily."Property"."excluirDeComparables" IS
  'Si true, los avaluos de esta propiedad NO generan comparables automaticos.';

-- -----------------------------------------------------------------------------
-- 5) RLS — Comparable es GF-only
-- -----------------------------------------------------------------------------
-- `ALTER DEFAULT PRIVILEGES` (migración de RLS inicial) le otorga a `propaily_app`
-- privilegios sobre toda tabla nueva del schema. Aquí se los revocamos: solo
-- `propaily_bypass` puede tocar Comparable. Además se habilita RLS con una
-- policy deny-all como defensa en profundidad.
REVOKE ALL ON propaily."Comparable" FROM propaily_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON propaily."Comparable" TO propaily_bypass;

ALTER TABLE propaily."Comparable" ENABLE ROW LEVEL SECURITY;

CREATE POLICY comparable_gf_only ON propaily."Comparable"
  USING (false)
  WITH CHECK (false);

COMMENT ON POLICY comparable_gf_only ON propaily."Comparable" IS
  'Deny-all para propaily_app. Solo propaily_bypass (BYPASSRLS) accede a comparables.';
