-- Quita FORCE ROW LEVEL SECURITY de las 3 tablas con RLS del spike.
-- FORCE obliga al owner (gfc) a respetar las policies, lo que rompe los
-- scripts de seed que conectan como gfc para crear datos multi-tenant.
--
-- Con NO FORCE:
--   · gfc (owner)          → bypassea RLS (back door para mantenimiento + seeds)
--   · propaily_app         → RLS aplica (no es owner)
--   · propaily_bypass      → RLS no aplica (BYPASSRLS attribute del rol)
--
-- El smoke test (scripts/test-rls.mjs) sigue pasando porque conecta como
-- propaily_app / propaily_bypass, ninguno owner.

ALTER TABLE propaily."Client"    NO FORCE ROW LEVEL SECURITY;
ALTER TABLE propaily."Portfolio" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE propaily."Property"  NO FORCE ROW LEVEL SECURITY;
