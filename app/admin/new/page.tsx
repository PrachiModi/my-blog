import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PostEditor from "@/components/PostEditor";

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Entry</h1>
      <PostEditor />
    </div>
  );
}
