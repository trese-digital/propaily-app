/**
 * Sincroniza el User de Supabase Auth con propaily.User en la DB.
 *
 * Supabase Auth maneja las credenciales y la identidad; nuestro modelo
 * `User` en Prisma guarda la información de negocio (relaciones con
 * memberships, comments, tasks, etc.). El `id` debe coincidir con el UUID
 * que Supabase genera para que las relaciones referencien la misma identidad.
 */
import { db } from "@/server/db/client";

export async function ensureUserSynced(
  supabaseUserId: string,
  email: string,
  name?: string | null,
) {
  return db.user.upsert({
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
