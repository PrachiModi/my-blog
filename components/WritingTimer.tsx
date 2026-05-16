"use client";

import { useState, useEffect, useRef } from "react";

const FIFTEEN_MINUTES = 15 * 60;

export default function WritingTimer() {
  const [seconds, setSeconds] = useState(FIFTEEN_MINUTES);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            setDone(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function toggle() {
    if (done) return;
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setDone(false);
    setSeconds(FIFTEEN_MINUTES);
  }

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const progress = ((FIFTEEN_MINUTES - seconds) / FIFTEEN_MINUTES) * 100;

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border text-sm transition-colors ${
      done
        ? "bg-green-50 border-green-200 text-green-700"
        : running
        ? "bg-amber-50 border-amber-200 text-amber-700"
        : "bg-white border-gray-200 text-gray-500"
    }`}>
      <div className="relative w-7 h-7 flex-shrink-0">
        <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="11" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
          <circle
            cx="14" cy="14" r="11"
            fill="none"
            stroke={done ? "#16a34a" : running ? "#d97706" : "#d1d5db"}
            strokeWidth="2.5"
            strokeDasharray={`${2 * Math.PI * 11}`}
            strokeDashoffset={`${2 * Math.PI * 11 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
      </div>

      <span className="font-mono font-semibold tabular-nums text-base w-12">
        {done ? "Done!" : `${mins}:${secs}`}
      </span>

      {done ? (
        <span className="text-green-600 text-xs">Great writing session!</span>
      ) : (
        <button
          onClick={toggle}
          className="text-xs font-medium underline underline-offset-2 hover:no-underline"
        >
          {running ? "Pause" : seconds === FIFTEEN_MINUTES ? "Start 15 min" : "Resume"}
        </button>
      )}

      {(running || seconds < FIFTEEN_MINUTES) && (
        <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">
          Reset
        </button>
      )}
    </div>
  );
}
