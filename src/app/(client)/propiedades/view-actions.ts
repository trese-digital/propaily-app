"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { VIEW_COOKIE, type PropertyView } from "./view-config";

export async function setPropertyView(view: PropertyView) {
  const c = await cookies();
  c.set(VIEW_COOKIE, view, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath("/propiedades");
}
