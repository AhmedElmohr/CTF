"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface FlagSubmitFormProps {
  challengeId: string;
  isSolved: boolean;
  onSolve: () => void;
}

export default function FlagSubmitForm({ challengeId, isSolved, onSolve }: FlagSubmitFormProps) {
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim() || isSolved) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/submit-flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId, flag }),
      });

      const data = await res.json();

      if (res.ok && data.correct) {
        setStatus("success");
        setMessage(`Correct! +${data.points} points.`);
        onSolve();
      } else {
        setStatus("error");
        setMessage(data.message || "Incorrect flag. Try again.");
        if (res.status === 429) {
          setMessage("Rate limit exceeded. Please wait.");
        }
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  if (isSolved) {
    return (
      <div className="mt-4 p-3 bg-hacker-green/10 border border-hacker-green/30 rounded-md flex items-center gap-3 text-hacker-green">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        <span className="font-bold text-sm">Challenge Solved!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          placeholder="flag{...}"
          disabled={status === "loading" || isSolved}
          className="flex-1 bg-black/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-hacker-green focus:ring-1 focus:ring-hacker-green disabled:opacity-50 transition-colors font-mono"
        />
        <button
          type="submit"
          disabled={status === "loading" || !flag.trim()}
          className="bg-gray-800 hover:bg-hacker-green hover:text-black border border-gray-700 hover:border-hacker-green text-gray-300 font-bold py-2 px-4 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
        >
          {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
        </button>
      </div>
      
      {status === "error" && (
        <div className="mt-2 text-hacker-red text-xs flex items-center gap-1 animate-pulse">
          <AlertCircle className="w-3 h-3" />
          <span>{message}</span>
        </div>
      )}
      {status === "success" && (
        <div className="mt-2 text-hacker-green text-xs flex items-center gap-1 animate-pulse">
          <CheckCircle2 className="w-3 h-3" />
          <span>{message}</span>
        </div>
      )}
    </form>
  );
}
