"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveGoal({ title, end_date }: { title: string; end_date: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("goals")
    .insert({ title, end_date })
    .select()
    .single();
  revalidatePath("/admin");
  return data;
}

export async function deleteGoal(id: string) {
  const supabase = await createClient();
  await supabase.from("goals").delete().eq("id", id);
  revalidatePath("/admin");
}
