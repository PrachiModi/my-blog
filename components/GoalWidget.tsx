"use client";

import { useState, useTransition } from "react";
import { saveGoal } from "@/app/actions/goals";

type Goal = {
  id: string;
  title: string;
  end_date: string;
  created_at: string;
};

function daysRemaining(endDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function GoalWidget({ goal }: { goal: Goal | null }) {
  const [editing, setEditing] = useState(!goal);
  const [title, setTitle] = useState(goal?.title ?? "");
  const [endDate, setEndDate] = useState(goal?.end_date ?? "");
  const [isPending, startTransition] = useTransition();

  const days = goal ? daysRemaining(goal.end_date) : 0;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !endDate) return;
    startTransition(async () => {
      await saveGoal({ title, end_date: endDate });
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <div className="bg-white border border-amber-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Set a Goal</p>
        <form onSubmit={handleSave} className="space-y-3">
          <input
            type="text"
            placeholder="e.g. I am engaged"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <div>
            <label className="text-xs text-gray-400 mb-1 block">End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-amber-600 text-white text-sm py-1.5 rounded-md hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Saving…" : "Save"}
            </button>
            {goal && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-sm text-gray-400 hover:text-gray-600 px-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-amber-100 rounded-xl p-4 space-y-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Your Goal</p>
      <p className="text-sm font-medium text-gray-800 leading-snug">{goal?.title}</p>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-4xl font-bold text-amber-600">{days}</span>
          <span className="text-sm text-gray-400 ml-1">days left</span>
        </div>
        {days === 0 && (
          <span className="text-xs text-green-600 font-medium">Completed!</span>
        )}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-amber-400 h-1.5 rounded-full transition-all"
          style={{
            width: `${Math.min(100, Math.max(0, (() => {
              const total = Math.ceil((new Date(goal!.end_date).getTime() - new Date(goal!.created_at).getTime()) / 86400000);
              return total > 0 ? ((total - days) / total) * 100 : 100;
            })()))}%`,
          }}
        />
      </div>
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-gray-400 hover:text-amber-600 transition-colors"
      >
        Edit goal
      </button>
    </div>
  );
}
