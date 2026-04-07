import React from "react";

export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`}
    />
  );
}
