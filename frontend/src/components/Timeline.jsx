import React from "react";

const steps = [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "submitted_to_authority"
];

export default function Timeline({ status }) {
  const currentIndex = steps.indexOf(status);

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-4">
          <div
            className={`h-3 w-3 rounded-full ${
              index <= currentIndex ? "bg-mint-500" : "bg-slate-300 dark:bg-slate-600"
            }`}
          />
          <div className="flex-1">
            <p className="text-sm font-medium capitalize">
              {step.replace(/_/g, " ")}
            </p>
            <div
              className={`h-1 rounded-full ${
                index < currentIndex ? "bg-mint-500" : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
