"use client";

import { useState, useTransition } from "react";
import { saveGoal, deleteGoal } from "@/app/actions/goals";

type Goal = {
  id: string;
  title: string;
  end_date: string;
};

function daysRemaining(endDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

function parseDuration(input: string): Date | null {
  const match = input.trim().toLowerCase().match(/^(\d+)\s*(day|days|week|weeks|month|months|year|years)$/);
  if (!match) return null;
  const amount = parseInt(match[1]);
  const unit = match[2];
  const date = new Date();
  if (unit.startsWith("day")) date.setDate(date.getDate() + amount);
  else if (unit.startsWith("week")) date.setDate(date.getDate() + amount * 7);
  else if (unit.startsWith("month")) date.setMonth(date.getMonth() + amount);
  else if (unit.startsWith("year")) date.setFullYear(date.getFullYear() + amount);
  return date;
}

function GoalRow({ goal, onDelete }: { goal: Goal; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const days = daysRemaining(goal.end_date);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between py-2 text-left gap-2 hover:text-amber-700 transition-colors"
      >
        <span className="text-sm font-medium truncate">{goal.title}</span>
        <span className="text-xs text-amber-600 font-semibold flex-shrink-0">
          {days === 0 ? "Done!" : `${days}d`}
        </span>
      </button>
      {expanded && (
        <div className="pb-3 space-y-2">
          <div className="w-full bg-gray-100 rounded-full h-1">
            <div className="bg-amber-400 h-1 rounded-full" style={{ width: `${Math.min(100, 100 - (days / 90) * 100)}%` }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              {days === 0 ? "Completed!" : `${days} days left`}
            </span>
            <button
              onClick={() => onDelete(goal.id)}
              className="text-xs text-red-300 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GoalWidget({ initialGoals }: { initialGoals: Goal[] }) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [durationError, setDurationError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteGoal(id);
      setGoals((g) => g.filter((goal) => goal.id !== id));
    });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setDurationError("");
    if (!title.trim()) return;
    const endDate = parseDuration(duration);
    if (!endDate) {
      setDurationError('Try "90 days", "3 months", or "1 year"');
      return;
    }
    startTransition(async () => {
      const end_date = endDate.toISOString().split("T")[0];
      const newGoal = await saveGoal({ title, end_date });
      if (newGoal) setGoals((g) => [...g, newGoal]);
      setTitle("");
      setDuration("");
      setAdding(false);
    });
  }

  return (
    <div className="bg-white border border-amber-100 rounded-xl overflow-hidden">
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Goals</p>
        {goals.length === 0 && !adding && (
          <p className="text-xs text-gray-300 italic pb-2">No goals yet</p>
        )}
        {goals.map((goal) => (
          <GoalRow key={goal.id} goal={goal} onDelete={handleDelete} />
        ))}
      </div>

      {adding ? (
        <form onSubmit={handleSave} className="px-4 pb-4 pt-2 border-t border-gray-50 space-y-2">
          <input
            type="text"
            placeholder="Goal name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
            className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input
            type="text"
            placeholder="90 days / 3 months / 1 year"
            value={duration}
            onChange={(e) => { setDuration(e.target.value); setDurationError(""); }}
            required
            className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          {durationError && <p className="text-xs text-red-400">{durationError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-amber-600 text-white text-xs py-1.5 rounded-md hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Saving…" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setDurationError(""); }}
              className="text-xs text-gray-400 hover:text-gray-600 px-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full text-xs text-amber-600 hover:bg-amber-50 py-2 border-t border-gray-50 transition-colors"
        >
          + Add goal
        </button>
      )}
    </div>
  );
}
