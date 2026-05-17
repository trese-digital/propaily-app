-- =============================================================================
-- Bloque 2 — Plan standalone "Visor Catastral"
-- =============================================================================
-- Agrega el valor `catastro` al enum SubscriptionPlan. Es el plan de un tenant
-- que solo visualiza el mapa de catastro, sin módulo de gestión de propiedades.
--
-- Migración aditiva y segura: ALTER TYPE ... ADD VALUE no reescribe filas ni
-- toca otros schemas. `IF NOT EXISTS` la hace idempotente.
-- =============================================================================

ALTER TYPE "propaily"."SubscriptionPlan" ADD VALUE IF NOT EXISTS 'catastro';
