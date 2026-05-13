import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ensureUserSynced } from "@/server/auth/sync-user";
import Visor from "@/components/cartografia/Visor";

export default async function CartografiaPage({
  searchParams,
}: {
  searchParams: Promise<{ linkProperty?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await ensureUserSynced(
    user.id,
    user.email ?? "",
    (user.user_metadata?.name as string | undefined) ?? null,
  );

  const sp = await searchParams;

  return (
    <Visor
      user={{
        email: dbUser.email,
        name: dbUser.name ?? dbUser.email,
      }}
      linkPropertyId={sp.linkProperty ?? null}
    />
  );
}
