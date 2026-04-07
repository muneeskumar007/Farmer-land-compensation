import React from "react";

const styles = {
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
  under_review: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200",
  submitted: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200",
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200"
};

export default function StatusBadge({ status }) {
  const key = status || "pending";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[key] || styles.pending
      }`}
    >
      {key.replace(/_/g, " ")}
    </span>
  );
}
