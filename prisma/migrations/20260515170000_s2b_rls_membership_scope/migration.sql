-- =============================================================================
-- S2b — Cierre del hallazgo del /security-review de S2
-- =============================================================================
-- El audit de S2 detectó que varias tablas scopeadas sólo por ManagementCompany
-- (`rls_rollout`) no recibieron el filtro `current_client()` del scoping dual.
--
-- `Membership` es la crítica: la pantalla de Usuarios (S6) la consulta vía
-- `withAppScope`. Sin este fix, un usuario family office vería los memberships
-- de TODA la MC — incluidos los de otros family offices.
--
-- Resolución por tabla:
--   · Membership  → se añade el filtro por Client (tiene columna `clientId`).
--   · Vendor, ExchangeRate → MC-level a propósito: datos operativos compartidos
--     de la ManagementCompany, no son datos de un Client. Se documenta aquí.
--   · ImportJob, ExportJob, Notification → MC-level por ahora: no tienen lineage
--     de Client y no hay UI client-facing que las exponga. Cuando se construya
--     esa UI (fuera de Bloque 1/2), esa fase añadirá el scoping adecuado.
--
-- SQL bruto. Sólo toca el schema `propaily`.
-- =============================================================================

DROP POLICY IF EXISTS membership_isolation ON propaily."Membership";
CREATE POLICY membership_isolation ON propaily."Membership"
  USING (
    "managementCompanyId" = propaily.current_mc()::text
    AND (
      propaily.current_client() IS NULL
      OR "clientId" = propaily.current_client()::text
    )
  )
  WITH CHECK (
    "managementCompanyId" = propaily.current_mc()::text
    AND (
      propaily.current_client() IS NULL
      OR "clientId" = propaily.current_client()::text
    )
  );
