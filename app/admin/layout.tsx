import { createClient } from "@/lib/supabase/server";
import GoalWidget from "@/components/GoalWidget";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  const goal = goals?.[0] ?? null;

  return (
    <div className="flex gap-6 items-start">
      <aside className="w-56 flex-shrink-0 sticky top-24 space-y-4">
        <GoalWidget goal={goal} />
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
