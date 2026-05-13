/**
 * Sincroniza el User de Supabase Auth con propaily.User en la DB.
 *
 * Supabase Auth maneja las credenciales y la identidad; nuestro modelo
 * `User` en Prisma guarda la información de negocio (relaciones con
 * memberships, comments, tasks, etc.). El `id` debe coincidir con el UUID
 * que Supabase genera para que las relaciones referencien la misma identidad.
 */
// User no tiene RLS pero está en schema propaily. Usar dbBypass para evitar
// depender del rol gfc en runtime.
import { dbBypass } from "@/server/db/scoped";

export async function ensureUserSynced(
  supabaseUserId: string,
  email: string,
  name?: string | null,
) {
  return dbBypass.user.upsert({
    where: { id: supabaseUserId },
    update: {
      email,
      ...(name ? { name } : {}),
    },
    create: {
      id: supabaseUserId,
      email,
      name: name ?? null,
      status: "active",
    },
  });
}
