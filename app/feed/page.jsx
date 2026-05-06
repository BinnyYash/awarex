import Link from "next/link";
import { demoReports, statusColors } from "@/lib/data";

export default function Feed() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-[0.2em] text-muted mb-4 font-mono">
        [ Public Feed ]
      </div>
      <h1 className="font-display text-5xl md:text-6xl mb-4">
        Verified reports.
        <br />
        <span className="italic text-saffron">Tracked to resolution.</span>
      </h1>
      <p className="text-muted max-w-2xl mb-12">
        Every report here passed AI credibility triage and human moderation.
        Status updates come from the relevant government office, not from us.
      </p>

      <div className="flex flex-wrap gap-2 mb-8 text-xs">
        {["All", "Education", "Public Safety", "Municipal Corruption", "Healthcare", "Environment"].map((c) => (
          <button
            key={c}
            className="px-4 py-2 border border-line rounded-full hover:bg-ink hover:text-cream hover:border-ink transition"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-4 stagger">
        {demoReports.map((r) => (
          <article
            key={r.id}
            className="border border-line bg-white/40 rounded-sm p-6 hover:border-ink transition"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
              <span className="font-mono text-muted">{r.id}</span>
              <span className="w-1 h-1 bg-line rounded-full" />
              <span className="text-muted">{r.location}</span>
              <span className="w-1 h-1 bg-line rounded-full" />
              <span className="text-muted">{r.submittedAgo}</span>
              {r.anonymous && (
                <>
                  <span className="w-1 h-1 bg-line rounded-full" />
                  <span className="text-muted italic">Anonymous reporter</span>
                </>
              )}
              <span className={`ml-auto px-3 py-1 rounded-full ${statusColors[r.status] || "bg-line"}`}>
                {r.status}
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl mb-3 leading-tight">{r.title}</h2>
            <p className="text-muted mb-5 leading-relaxed">{r.summary}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div>
                <span className="text-muted text-xs uppercase tracking-wider mr-2">Credibility</span>
                <span className={`font-display text-xl ${r.credibility >= 80 ? "text-forest" : "text-saffron"}`}>
                  {r.credibility}/100
                </span>
              </div>
              <div className="text-muted text-xs">
                <span className="uppercase tracking-wider">Routed →</span> {r.department}
              </div>
              <div className="ml-auto flex items-center gap-4 text-xs">
                <span>👥 {r.supporters.toLocaleString()} supporters</span>
                <span>💬 {r.comments} comments</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 pt-6 border-t border-line">
              <div className="text-xs uppercase tracking-wider text-muted mb-3">Status Timeline</div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                {r.timeline.map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-saffron" />
                    <span className="font-medium">{t.stage}</span>
                    <span className="text-muted">— {t.at}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-muted">
        Demo build — these are seeded illustrative reports.
        <Link href="/submit" className="ml-2 underline hover:text-saffron">Submit your own →</Link>
      </div>
    </div>
  );
}
