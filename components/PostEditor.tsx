"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PostEditor({ post }: { post?: Post }) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const isEdit = !!post;

  async function handleSave(shouldPublish?: boolean) {
    if (!title.trim()) { setError("Title is required."); return; }
    if (!content.trim()) { setError("Content is required."); return; }

    setSaving(true);
    setError("");
    const supabase = createClient();
    const willPublish = shouldPublish !== undefined ? shouldPublish : published;

    if (isEdit) {
      const { error } = await supabase
        .from("posts")
        .update({ title, content, published: willPublish, updated_at: new Date().toISOString() })
        .eq("id", post.id);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const slug = slugify(title) + "-" + Date.now();
      const { error } = await supabase
        .from("posts")
        .insert({ title, content, slug, published: willPublish });
      if (error) { setError(error.message); setSaving(false); return; }
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleDelete() {
    if (!post) return;
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", post.id);
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-bold bg-transparent border-b border-amber-200 pb-2 focus:outline-none focus:border-amber-500 placeholder:text-gray-300"
      />
      <textarea
        placeholder="Write your thoughts here…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={20}
        className="w-full bg-white border border-amber-100 rounded-lg p-4 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 text-sm bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
        {isEdit && (
          <button
            onClick={handleDelete}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
