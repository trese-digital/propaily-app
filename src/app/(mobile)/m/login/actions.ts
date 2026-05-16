"use server";

/**
 * Server actions de la PWA mobile — misma autenticación que el portal de
 * escritorio (`(auth)/login/actions.ts`: Supabase password + Turnstile), pero
 * los redirects apuntan dentro de `/m` para que el usuario no salga de la PWA.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { ensureUserSynced } from "@/server/auth/sync-user";

const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export type MobileLoginState = { error?: string };

export async function mobileLogin(
  _prev: MobileLoginState,
  formData: FormData,
): Promise<MobileLoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const tk = formData.get("cf-turnstile-response");
  const captchaToken = typeof tk === "string" && tk ? tk : undefined;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    ...parsed.data,
    options: captchaToken ? { captchaToken } : undefined,
  });
  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await ensureUserSynced(
      data.user.id,
      data.user.email ?? parsed.data.email,
      data.user.user_metadata?.name,
    );
  }

  revalidatePath("/", "layout");
  redirect("/m/inicio");
}

export async function mobileLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/m/login");
}
