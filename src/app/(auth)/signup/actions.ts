"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { ensureUserSynced } from "@/server/auth/sync-user";

const SignupSchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type SignupState = { error?: string; needsConfirmation?: boolean };

export async function signup(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { name: parsed.data.name } },
  });
  if (error) {
    return { error: error.message };
  }

  // Si Supabase requiere confirmar email, no hay sesión todavía.
  if (!data.session) {
    return { needsConfirmation: true };
  }

  if (data.user) {
    await ensureUserSynced(data.user.id, parsed.data.email, parsed.data.name);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
