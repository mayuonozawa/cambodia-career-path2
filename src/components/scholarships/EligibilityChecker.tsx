"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

type Answer = "yes" | "no" | null;

interface EligibilityCheckerProps {
  title: string;
  questions: [string, string, string];
  yesLabel: string;
  noLabel: string;
  resultSuccess: string;
  resultPartial: string;
  ctaLabel: string;
}

export function EligibilityChecker({
  title,
  questions,
  yesLabel,
  noLabel,
  resultSuccess,
  resultPartial,
  ctaLabel,
}: EligibilityCheckerProps) {
  const [answers, setAnswers] = useState<[Answer, Answer, Answer]>([null, null, null]);

  const setAnswer = (i: 0 | 1 | 2, val: Answer) => {
    setAnswers((prev) => {
      const next = [...prev] as [Answer, Answer, Answer];
      next[i] = prev[i] === val ? null : val;
      return next;
    });
  };

  const allAnswered = answers.every((a) => a !== null);
  const allYes = answers.every((a) => a === "yes");

  return (
    <section className="mb-8">
      <h2 className="text-base font-bold mb-3 text-gray-800">{title}</h2>
      <div className="space-y-2.5">
        {questions.map((q, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{q}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setAnswer(i as 0 | 1 | 2, "yes")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  answers[i] === "yes"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {yesLabel}
              </button>
              <button
                onClick={() => setAnswer(i as 0 | 1 | 2, "no")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  answers[i] === "no"
                    ? "bg-red-400 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {noLabel}
              </button>
            </div>
          </div>
        ))}
      </div>

      {allAnswered && (
        <div
          className={`mt-4 p-4 rounded-xl border ${
            allYes
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <p
            className={`font-semibold text-sm mb-3 leading-relaxed ${
              allYes ? "text-green-800" : "text-amber-800"
            }`}
          >
            {allYes ? resultSuccess : resultPartial}
          </p>
          <Link
            href="/scholarships"
            className="inline-block bg-brand-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-brand-primary/90 transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </section>
  );
}
