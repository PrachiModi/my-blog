import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  return (
    <article>
      <time className="text-xs text-gray-400 uppercase tracking-wide">
        {new Date(post.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <h1 className="text-3xl font-bold mt-2 mb-8">{post.title}</h1>
      <div className="prose prose-stone max-w-none leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
      <div className="mt-12 pt-6 border-t border-amber-100">
        <a href="/" className="text-sm text-amber-700 hover:underline">
          ← Back to all entries
        </a>
      </div>
    </article>
  );
}
