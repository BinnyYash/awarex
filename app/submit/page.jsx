"use client";

import { useState } from "react";

export default function Submit() {
  // Smart Assist state
  const [rawText, setRawText] = useState("");
  const [assistLoading, setAssistLoading] = useState(false);
  const [assistResult, setAssistResult] = useState(null);
  const [assistError, setAssistError] = useState("");

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    anonymous: true,
  });

  // Triage state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleAssist() {
    if (rawText.trim().length < 20) {
      setAssistError("Tell us a bit more — at least a sentence or two.");
      return;
    }
    setAssistLoading(true);
    setAssistError("");
    setAssistResult(null);
    try {
      const res = await fetch("/api/prefill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAssistResult(data);
      setForm({
        title: data.suggestedTitle || "",
        description: data.polishedDescription || rawText,
        category: data.detectedCategory || "",
        location: data.detectedLocation || "",
        anonymous: data.anonymityRecommendation?.recommend ?? true,
      });
    } catch (err) {
      setAssistError(err.message || "Smart Assist failed. Try the manual form below.");
    } finally {
      setAssistLoading(false);
    }
  }

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
        <span className="italic text-saffron">AI helps you file. Humans verify.</span>
      </h1>
      <p className="text-muted max-w-2xl mb-12 leading-relaxed">
        Two stages of AI in the loop — one helps you structure your report,
        one triages credibility. You stay in control. Nothing publishes
        without human review.
      </p>

      {/* STEP 1 — SMART ASSIST */}
      <section className="mb-16">
        <div className="flex items-baseline gap-3 mb-4">
          <div className="font-mono text-sm text-saffron">STEP 01</div>
          <div className="text-xs uppercase tracking-wider text-muted">Smart Assist (Optional but recommended)</div>
        </div>
        <h2 className="font-display text-3xl mb-3">Just describe what happened.</h2>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          In your own words. Mixed languages, incomplete sentences, panicked typing — all fine.
          AI will extract structured fields from your account so you don&apos;t have to.
        </p>

        <div className="border border-line bg-white/40 rounded-sm p-6">
          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="e.g. The school where my children study has had no drinking water for almost a month now. The principal keeps saying it will be fixed but nothing happens. Last week one of the students fainted from dehydration. There are about 240 children in this school. We have photos of the broken pump and the empty water tanks. I have already complained to the BEO twice but received no response."
            className="w-full bg-transparent focus:outline-none text-base resize-none placeholder:text-muted/60"
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-line">
            <div className="text-xs text-muted">
              {rawText.length} characters · {rawText.trim().split(/\s+/).filter(Boolean).length} words
            </div>
            <button
              onClick={handleAssist}
              disabled={assistLoading || rawText.trim().length < 20}
              className="bg-saffron text-cream px-5 py-3 rounded-full hover:bg-ink transition disabled:opacity-40 text-sm"
            >
              {assistLoading ? (
                <span className="inline-flex items-center gap-2">
                  AI Reading
                  <span className="dot-loader"><span></span><span></span><span></span></span>
                </span>
              ) : (
                "✨ Help Me Structure This"
              )}
            </button>
          </div>
        </div>

        {assistError && (
          <div className="mt-4 text-crimson text-sm border-l-2 border-crimson pl-3">{assistError}</div>
        )}

        {assistResult && (
          <div className="mt-6 border border-saffron/40 bg-saffron/5 rounded-sm p-6 fade-in">
            <div className="text-xs uppercase tracking-widest text-saffron mb-4 font-mono">
              ✨ AI extracted the following — review and edit anything in Step 02 below
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs uppercase text-muted tracking-wider mb-1">Detected Category</div>
                <div className="font-medium">{assistResult.detectedCategory}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted tracking-wider mb-1">Routed To</div>
                <div className="font-medium">{assistResult.suggestedDepartment}</div>
              </div>
              {assistResult.detectedLocation && (
                <div>
                  <div className="text-xs uppercase text-muted tracking-wider mb-1">Location Mentioned</div>
                  <div className="font-medium">{assistResult.detectedLocation}</div>
                </div>
              )}
              <div>
                <div className="text-xs uppercase text-muted tracking-wider mb-1">Language</div>
                <div className="font-medium">{assistResult.languageDetected}</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-saffron/30">
              <div className="text-xs uppercase tracking-widest text-ink mb-2 font-mono">
                🔒 Anonymity Recommendation
              </div>
              <div className="flex items-start gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  assistResult.anonymityRecommendation?.recommend
                    ? "bg-ink text-cream"
                    : "bg-line text-ink"
                }`}>
                  {assistResult.anonymityRecommendation?.recommend ? "Anonymous Recommended" : "Public OK"}
                </div>
                <div className="text-sm text-ink/80 flex-1">
                  {assistResult.anonymityRecommendation?.reasoning}
                </div>
              </div>
            </div>

            {assistResult.extractedFacts?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-saffron/30">
                <div className="text-xs uppercase tracking-widest text-forest mb-2 font-mono">
                  Extracted Facts
                </div>
                <ul className="text-sm space-y-1">
                  {assistResult.extractedFacts.map((f, i) => (
                    <li key={i} className="flex gap-2"><span className="text-forest">•</span>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {assistResult.missingEvidence?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-saffron/30">
                <div className="text-xs uppercase tracking-widest text-crimson mb-2 font-mono">
                  Consider Adding (not required)
                </div>
                <ul className="text-sm space-y-1">
                  {assistResult.missingEvidence.map((e, i) => (
                    <li key={i} className="flex gap-2"><span className="text-crimson">+</span>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="divider-line my-12" />

      {/* STEP 2 — STRUCTURED FORM + TRIAGE */}
      <section>
        <div className="flex items-baseline gap-3 mb-4">
          <div className="font-mono text-sm text-saffron">STEP 02</div>
          <div className="text-xs uppercase tracking-wider text-muted">Review, edit, and submit</div>
        </div>
        <h2 className="font-display text-3xl mb-3">
          {assistResult ? "Review the AI-prefilled fields." : "Or fill the form manually."}
        </h2>
        <p className="text-muted text-sm mb-8 max-w-2xl">
          You can edit anything below. Your submission then goes through AI credibility triage and human moderation before any public posting.
        </p>

        <div className="grid lg:grid-cols-5 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <Field label="Report Title" hint="One specific sentence.">
              <input
                required
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Public school in Anantapur lacks drinking water for 3 weeks"
                className="w-full bg-transparent border-b-2 border-line focus:border-ink py-3 outline-none text-lg"
              />
            </Field>

            <Field label="Description" hint="Dates, numbers, evidence you have.">
              <textarea
                required
                rows={6}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what you witnessed. When? Who is affected? What evidence?"
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
                  Your identity is encrypted at rest. Even AwareX cannot view it without a court order.
                  {assistResult?.anonymityRecommendation?.recommend && (
                    <span className="text-saffron"> · AI recommends anonymity for this case.</span>
                  )}
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

          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="text-xs uppercase tracking-[0.2em] text-muted mb-4 font-mono">
                [ AI Triage Result ]
              </div>
              {!result && !loading && (
                <div className="border border-line bg-white/30 p-6 rounded-sm text-sm text-muted">
                  Submit your report to see real-time AI credibility analysis here.
                  AI flags red flags, identifies credibility signals, and routes the
                  report to the right department — but does <span className="italic text-ink">not</span> determine truth.
                  Humans always review before publishing.
                </div>
              )}
              {loading && (
                <div className="border border-line bg-white/30 p-6 rounded-sm text-sm">
                  <div className="dot-loader text-saffron mb-3"><span></span><span></span><span></span></div>
                  <div>Analyzing credibility signals…</div>
                  <div className="text-muted text-xs mt-1">3-6 seconds.</div>
                </div>
              )}
              {result && <ResultCard result={result} />}
            </div>
          </div>
        </div>
      </section>
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
