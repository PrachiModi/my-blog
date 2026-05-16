"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveGoal({ title, end_date }: { title: string; end_date: string }) {
  const supabase = await createClient();

  // Always keep only one goal — delete existing and insert new
  await supabase.from("goals").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("goals").insert({ title, end_date });

  revalidatePath("/admin");
}
