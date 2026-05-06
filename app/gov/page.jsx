"use client";

import { useState } from "react";
import { demoReports, statusColors } from "@/lib/data";

export default function GovDashboard() {
  const [reports, setReports] = useState(demoReports);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? reports : reports.filter(r => r.status === filter);

  function updateStatus(id, newStatus) {
    setReports(reports.map(r =>
      r.id === id ? {
        ...r,
        status: newStatus,
        timeline: [...r.timeline, { stage: newStatus, at: "just now", note: "Updated by officer" }]
      } : r
    ));
  }

  const stats = {
    total: reports.length,
    review: reports.filter(r => r.status === "Under Review").length,
    forwarded: reports.filter(r => r.status === "Forwarded to Department").length,
    closed: reports.filter(r => r.status === "Action Taken").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-[0.2em] text-muted font-mono">
          [ Officer Console — Demo Mode ]
        </div>
        <div className="text-xs text-muted font-mono">Officer: District Magistrate, Kurnool</div>
      </div>
      <h1 className="font-display text-5xl md:text-6xl mb-2">Inbox</h1>
      <p className="text-muted mb-10">Reports routed to your jurisdiction. Update status to keep citizens informed.</p>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="Total in Queue" value={stats.total} />
        <Stat label="Under Review" value={stats.review} accent="text-saffron" />
        <Stat label="Forwarded" value={stats.forwarded} accent="text-forest" />
        <Stat label="Resolved" value={stats.closed} accent="text-forest" />
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6 text-xs">
        {["All", "Under Review", "Forwarded to Department", "Action Taken"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full border transition ${
              filter === s ? "bg-ink text-cream border-ink" : "border-line hover:border-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Reports table */}
      <div className="border border-line bg-white/40 rounded-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-line text-xs uppercase tracking-wider text-muted bg-ink/5">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">Report</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1 text-center">Cred.</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filtered.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-line last:border-0 items-center hover:bg-cream/50 transition"
          >
            <div className="col-span-1 font-mono text-xs text-muted">{r.id}</div>
            <div className="col-span-4">
              <div className="font-display text-lg leading-tight">{r.title}</div>
              <div className="text-xs text-muted mt-1">{r.location} · {r.submittedAgo}</div>
            </div>
            <div className="col-span-2 text-sm">{r.category}</div>
            <div className="col-span-1 text-center">
              <span className={`font-display text-xl ${r.credibility >= 80 ? "text-forest" : "text-saffron"}`}>
                {r.credibility}
              </span>
            </div>
            <div className="col-span-2">
              <span className={`px-3 py-1 rounded-full text-xs ${statusColors[r.status] || "bg-line"}`}>
                {r.status}
              </span>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              {r.status === "Under Review" && (
                <button
                  onClick={() => updateStatus(r.id, "Forwarded to Department")}
                  className="text-xs px-3 py-2 bg-ink text-cream rounded-full hover:bg-saffron transition"
                >
                  Forward
                </button>
              )}
              {r.status === "Forwarded to Department" && (
                <button
                  onClick={() => updateStatus(r.id, "Action Taken")}
                  className="text-xs px-3 py-2 bg-forest text-cream rounded-full hover:opacity-90 transition"
                >
                  Mark Resolved
                </button>
              )}
              {r.status === "Action Taken" && (
                <span className="text-xs text-muted">✓ Closed</span>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-6 py-16 text-center text-muted text-sm">
            No reports match this filter.
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-line pt-6 text-xs text-muted">
        <strong>Note for judges:</strong> In production, this view would be access-controlled to verified government officers only,
        with audit logs on every status change. For the hackathon demo, it&apos;s open access at /gov.
      </div>
    </div>
  );
}

function Stat({ label, value, accent = "text-ink" }) {
  return (
    <div className="border border-line bg-white/40 rounded-sm p-5">
      <div className="text-xs uppercase tracking-wider text-muted mb-2">{label}</div>
      <div className={`font-display text-4xl ${accent}`}>{value}</div>
    </div>
  );
}
