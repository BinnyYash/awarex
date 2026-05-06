"use client";

import { useState } from "react";
import { demoSchemes, interestTags } from "@/lib/data";

export default function Schemes() {
  const [selected, setSelected] = useState(["student", "youth"]);

  function toggle(id) {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  }

  const matched = demoSchemes.filter(s =>
    s.audience.some(a => selected.includes(a))
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-[0.2em] text-muted mb-4 font-mono">
        [ For You ]
      </div>
      <h1 className="font-display text-5xl md:text-6xl mb-4">
        Government schemes,
        <br />
        <span className="italic text-saffron">matched to you.</span>
      </h1>
      <p className="text-muted max-w-2xl mb-12">
        Bills, scholarships, schemes, and consultations relevant to your situation.
        AwareX surfaces opportunities citizens often miss — because the platform shouldn&apos;t
        only be about reporting problems.
      </p>

      <div className="border border-line bg-white/40 rounded-sm p-6 mb-10">
        <div className="text-xs uppercase tracking-wider text-muted mb-3">Tell us who you are</div>
        <div className="flex flex-wrap gap-2">
          {interestTags.map((t) => (
            <button
              key={t.id}
              onClick={() => toggle(t.id)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                selected.includes(t.id)
                  ? "bg-ink text-cream border-ink"
                  : "border-line hover:border-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-muted mt-3">
          {matched.length} schemes matched · v1 uses tag matching, v2 will use ML personalization
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 stagger">
        {matched.map((s) => (
          <article key={s.id} className="border border-line bg-white/60 rounded-sm p-6 hover:border-ink transition">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-saffron font-mono">{s.type}</span>
              <span className="text-xs text-muted font-mono">{s.id}</span>
            </div>
            <h2 className="font-display text-2xl mb-3 leading-tight">{s.title}</h2>
            <p className="text-sm text-muted mb-5 leading-relaxed">{s.summary}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {s.audience.map((a) => (
                <span key={a} className="text-xs bg-ink/5 px-2 py-1 rounded-full">#{a}</span>
              ))}
            </div>
            <div className="border-t border-line pt-4 flex items-center justify-between text-xs">
              <span className="text-muted">{s.deadline}</span>
              <button className="underline hover:text-saffron">Read more →</button>
            </div>
            <div className="text-xs text-muted mt-2">{s.source}</div>
          </article>
        ))}
        {matched.length === 0 && (
          <div className="md:col-span-2 text-center py-16 text-muted">
            Pick at least one tag to see matched schemes.
          </div>
        )}
      </div>
    </div>
  );
}
