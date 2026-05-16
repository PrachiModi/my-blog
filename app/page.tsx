import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome</h1>
      <p className="text-gray-500 mb-10 text-sm">A place for my thoughts, stories, and daily life.</p>

      {!posts || posts.length === 0 ? (
        <p className="text-gray-400 italic">No entries yet. Check back soon.</p>
      ) : (
        <ul className="space-y-6">
          {(posts as Pick<Post, "id" | "title" | "slug" | "created_at">[]).map((post) => (
            <li key={post.id} className="border-b border-amber-100 pb-6">
              <time className="text-xs text-gray-400 uppercase tracking-wide">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="text-xl font-semibold mt-1">
                <Link
                  href={`/posts/${post.slug}`}
                  className="hover:text-amber-700 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
