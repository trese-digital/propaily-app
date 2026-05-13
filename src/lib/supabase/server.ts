/**
 * Supabase client para Server Components, Server Actions y Route Handlers.
 * Lee/escribe cookies de sesión vía la API de Next.js. La service-role key
 * se reserva para `createAdminClient()` y NUNCA se manda al cliente.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // En Server Components puros, set() falla; el middleware se encarga
            // de mantener la sesión fresca, así que ignoramos.
          }
        },
      },
    },
  );
}

/**
 * Cliente con privilegios admin (service_role). Sólo para operaciones que
 * requieran saltarse RLS o crear usuarios desde el servidor.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
