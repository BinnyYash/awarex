import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-28 md:pb-36">
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8 stagger">
            <div className="text-xs uppercase tracking-[0.2em] text-muted mb-6 font-mono">
              [ Track 04 — Governance & Collaboration ]
            </div>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95] tracking-tight">
              Speak together.
              <br />
              <span className="italic text-saffron">With proof.</span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted max-w-2xl leading-relaxed">
              AwareX is civic infrastructure for the people who have evidence
              of wrongdoing but are too afraid to come forward alone.
              Anonymous reporting, AI-verified credibility, direct routing to
              government — built so courage doesn&apos;t require isolation.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/submit"
                className="bg-ink text-cream px-7 py-4 rounded-full hover:bg-saffron transition text-sm tracking-wide"
              >
                Report an Incident →
              </Link>
              <Link
                href="/feed"
                className="border border-ink px-7 py-4 rounded-full hover:bg-ink hover:text-cream transition text-sm tracking-wide"
              >
                Browse Verified Reports
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 fade-in">
            <div className="border border-line bg-white/40 p-6 rounded-sm">
              <div className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Live Counter</div>
              <div className="font-display text-5xl">12,847</div>
              <div className="text-sm text-muted mt-1">Reports verified to date</div>
              <div className="divider-line my-5" />
              <div className="font-display text-5xl">3,108</div>
              <div className="text-sm text-muted mt-1">Routed for government action</div>
              <div className="divider-line my-5" />
              <div className="font-display text-5xl text-saffron">412</div>
              <div className="text-sm text-muted mt-1">Resolved with citizen support</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-muted mb-4 font-mono">
            [ How it works ]
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-16 max-w-3xl">
            A pipeline designed so no single actor — citizen, AI, or state —
            holds unilateral power.
          </h2>

          <div className="grid md:grid-cols-4 gap-8 stagger">
            {[
              { n: "01", t: "Citizen Reports", d: "With evidence and an anonymity choice. Identity is encrypted at rest, accessible only via legal warrant." },
              { n: "02", t: "AI Triages", d: "Claude analyzes credibility signals, flags red-flags, categorizes the issue, and recommends the right department." },
              { n: "03", t: "Human Reviews", d: "Moderators verify before public posting. Accused parties have a right to respond. No one-click public accusations." },
              { n: "04", t: "Community Acts", d: "Verified reports gain supporters. Officers update status. Resolution is visible. Loops close." },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-mono text-saffron text-sm mb-3">{s.n}</div>
                <div className="font-display text-2xl mb-3">{s.t}</div>
                <div className="text-sm text-muted leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ETHICS */}
      <section className="border-t border-line bg-ink text-cream relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-saffron mb-4 font-mono">
            [ Hard questions, answered ]
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-16 max-w-3xl">
            Track 4 asked five hard questions about civic platforms.
            <span className="italic text-saffron"> So did we.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              ["How is this prevented from being weaponized for harassment?", "Reports never auto-publish. Human moderation queue + accused-party notice before any public posting."],
              ["Whose voices get centered vs. drowned out?", "Category-based feeds, not engagement-driven. Verified reports rank by credibility & support, not virality."],
              ["How do you handle factual disputes without lazy both-sidesing?", "AI flags credibility signals; humans verify; status is always visible to citizens. No false neutrality on settled facts."],
              ["What about privacy of whistleblowers?", "Identities encrypted at rest. Even AwareX cannot access them. Unlock requires court warrant — by design."],
              ["How transparent are AI recommendations?", "Every report shows its credibility breakdown — what the AI flagged, what it weighed. No black box."],
            ].map(([q, a], i) => (
              <div key={i}>
                <div className="font-display text-xl mb-3 text-saffron">{q}</div>
                <div className="text-sm text-cream/70 leading-relaxed">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-5xl md:text-7xl leading-tight">
          One person speaking up is fragile.
          <br />
          <span className="italic text-saffron">A thousand is infrastructure.</span>
        </h2>
        <div className="mt-10 flex justify-center gap-3">
          <Link
            href="/submit"
            className="bg-ink text-cream px-7 py-4 rounded-full hover:bg-saffron transition"
          >
            Submit Your Report →
          </Link>
        </div>
      </section>
    </div>
  );
}
