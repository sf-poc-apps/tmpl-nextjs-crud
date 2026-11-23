"use server";

import { revalidatePath } from "next/cache";
import { getStore } from "@/lib/store";

const clean = (v: FormDataEntryValue | null, max = 500) => String(v ?? "").trim().slice(0, max);

export async function addItem(form: FormData) {
  const name = clean(form.get("name"));
  if (!name) return;
  await getStore().create("items", { name, note: clean(form.get("note")) });
  revalidatePath("/");
}

export async function deleteItem(form: FormData) {
  await getStore().remove("items", clean(form.get("id"), 40));
  revalidatePath("/");
}
