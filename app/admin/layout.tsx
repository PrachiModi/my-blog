import { createClient } from "@/lib/supabase/server";
import GoalWidget from "@/components/GoalWidget";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="flex gap-8 items-start">
      <aside className="w-48 flex-shrink-0 sticky top-24">
        <GoalWidget initialGoals={goals ?? []} />
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
