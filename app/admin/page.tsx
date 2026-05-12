import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Post } from "@/lib/types";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Entries</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/new"
            className="bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            + New Entry
          </Link>
          <LogoutButton />
        </div>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="text-gray-400 italic">No entries yet. Write your first one!</p>
      ) : (
        <ul className="space-y-3">
          {(posts as Post[]).map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-amber-100"
            >
              <div>
                <span className="font-medium">{post.title}</span>
                <span className="ml-2 text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                {!post.published && (
                  <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    Draft
                  </span>
                )}
              </div>
              <Link
                href={`/admin/edit/${post.id}`}
                className="text-sm text-amber-700 hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
