"use client";

import { useState } from "react";

export default function Submit() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    anonymous: true,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-[0.2em] text-muted mb-4 font-mono">
        [ Submit a Report ]
      </div>
      <h1 className="font-display text-5xl md:text-6xl mb-4 leading-tight">
        Tell us what happened.
        <br />
        <span className="italic text-saffron">Bring proof if you have it.</span>
      </h1>
      <p className="text-muted max-w-2xl mb-12 leading-relaxed">
        Your submission goes through AI credibility triage and human moderation
        before any public posting. Identity remains encrypted unless required
        by court order.
      </p>

      <div className="grid lg:grid-cols-5 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <Field label="Report Title" hint="Be specific. One sentence.">
            <input
              required
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Public school in Anantapur lacks drinking water for 3 weeks"
              className="w-full bg-transparent border-b-2 border-line focus:border-ink py-3 outline-none text-lg"
            />
          </Field>

          <Field label="Description" hint="Include dates, numbers, and what evidence you have.">
            <textarea
              required
              rows={6}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what you witnessed. When did it happen? Who is affected? What evidence do you have (photos, documents, witnesses)?"
              className="w-full bg-transparent border-b-2 border-line focus:border-ink py-3 outline-none resize-none"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Category">
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-transparent border-b-2 border-line focus:border-ink py-3 outline-none"
              >
                <option value="">Select…</option>
                <option>Education</option>
                <option>Healthcare</option>
                <option>Municipal Corruption</option>
                <option>Public Safety</option>
                <option>Environment</option>
                <option>Labor Rights</option>
                <option>Women & Child Safety</option>
                <option>Consumer Fraud</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Location">
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="District, State"
                className="w-full bg-transparent border-b-2 border-line focus:border-ink py-3 outline-none"
              />
            </Field>
          </div>

          <Field label="Evidence (Photos / Documents)">
            <div className="border-2 border-dashed border-line rounded-sm p-6 text-center text-muted text-sm">
              Drag files here, or <span className="underline cursor-pointer">browse</span>
              <div className="text-xs mt-1 opacity-60">Demo build — file upload simulated</div>
            </div>
          </Field>

          <label className="flex items-start gap-3 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={form.anonymous}
              onChange={(e) => setForm({ ...form, anonymous: e.target.checked })}
              className="mt-1 accent-saffron"
            />
            <div>
              <div className="text-sm font-medium">Post anonymously</div>
              <div className="text-xs text-muted">
                Your identity is encrypted. Even AwareX administrators cannot view it without a court order.
              </div>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-cream py-4 rounded-full hover:bg-saffron transition disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-3">
                Running AI Triage
                <span className="dot-loader"><span></span><span></span><span></span></span>
              </span>
            ) : (
              "Submit for Verification →"
            )}
          </button>

          {error && (
            <div className="text-crimson text-sm border-l-2 border-crimson pl-3">{error}</div>
          )}
        </form>

        {/* AI Result Panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <div className="text-xs uppercase tracking-[0.2em] text-muted mb-4 font-mono">
              [ AI Triage Result ]
            </div>
            {!result && !loading && (
              <div className="border border-line bg-white/30 p-6 rounded-sm text-sm text-muted">
                Submit your report to see real-time AI credibility analysis here. The AI flags red flags, identifies credibility signals, and routes the report to the right department — but does <span className="italic text-ink">not</span> determine truth on its own.
              </div>
            )}
            {loading && (
              <div className="border border-line bg-white/30 p-6 rounded-sm text-sm">
                <div className="dot-loader text-saffron mb-3"><span></span><span></span><span></span></div>
                <div>Analyzing credibility signals…</div>
                <div className="text-muted text-xs mt-1">This usually takes 3-6 seconds.</div>
              </div>
            )}
            {result && <ResultCard result={result} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="text-sm font-medium uppercase tracking-wider">{label}</label>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ResultCard({ result }) {
  const score = result.credibility ?? 0;
  const scoreColor = score >= 75 ? "text-forest" : score >= 50 ? "text-saffron" : "text-crimson";

  return (
    <div className="border border-ink bg-white/60 rounded-sm fade-in overflow-hidden">
      <div className="p-6 border-b border-line">
        <div className="text-xs uppercase tracking-widest text-muted mb-2">Credibility Score</div>
        <div className={`font-display text-7xl ${scoreColor}`}>{score}<span className="text-2xl text-muted">/100</span></div>
        <div className="text-sm text-muted mt-2">{result.reasoning}</div>
      </div>

      <div className="p-6 border-b border-line">
        <div className="text-xs uppercase tracking-widest text-muted mb-2">Routing Decision</div>
        <div className="inline-block bg-ink text-cream px-3 py-1 text-xs uppercase tracking-wider rounded-full">
          {result.routing}
        </div>
        <div className="text-sm mt-3">→ {result.recommendedDepartment}</div>
      </div>

      {result.credibilitySignals?.length > 0 && (
        <div className="p-6 border-b border-line">
          <div className="text-xs uppercase tracking-widest text-forest mb-2">Credibility Signals</div>
          <ul className="text-sm space-y-1">
            {result.credibilitySignals.map((s, i) => (
              <li key={i} className="flex gap-2"><span className="text-forest">+</span>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {result.redFlags?.length > 0 && (
        <div className="p-6">
          <div className="text-xs uppercase tracking-widest text-crimson mb-2">Red Flags</div>
          <ul className="text-sm space-y-1">
            {result.redFlags.map((s, i) => (
              <li key={i} className="flex gap-2"><span className="text-crimson">!</span>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
