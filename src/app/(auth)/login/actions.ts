"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { ensureUserSynced } from "@/server/auth/sync-user";

const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  // Token de Cloudflare Turnstile (el widget lo inyecta en el form). Supabase
  // lo verifica con su secret key; si el captcha está activo y falta, rechaza.
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
    await ensureUserSynced(data.user.id, data.user.email ?? parsed.data.email, data.user.user_metadata?.name);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
