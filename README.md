# AwareX 🛡️

> Civic infrastructure for the people who are afraid to speak alone.

A platform where citizens can report incidents, corruption, and civic issues with AI-powered credibility triage and direct routing to the right government departments — protected by anonymity, amplified by community support.

🌐 **Live Demo:** [Add your Vercel URL here]
🎥 **Walkthrough Video:** [Add your Loom URL here]
🏛️ **Track:** Governance & Collaboration

---

## The Problem

Democratic institutions are strained. Citizens have evidence of wrongdoing — corruption, civic neglect, public safety issues — but no safe channel to surface it. Reporting alone is intimidating. Reports vanish into bureaucracy. Communities can't coordinate. Misinformation makes everything worse.

## The Solution

AwareX is a four-stage civic pipeline: **Citizen reports → AI triages credibility → Humans verify → Community amplifies.** Every stage is visible. No single actor — citizen, AI, or government — holds unilateral power. Identity is encrypted by default. Status is tracked from submission to resolution.

## Key Features

- 🤖 **AI Credibility Triage** — Claude analyzes every report for red flags, credibility signals, categorization, and routing. AI does not determine truth — it triages, humans verify.
- 🔒 **Anonymity with Accountability** — Identities encrypted at rest. Even AwareX administrators cannot view them. Unlock requires a court warrant.
- 🏛️ **Government Officer Console** — Officers triage reports routed to their jurisdiction, update status, and close the loop with citizens.
- 📢 **Verified Public Feed** — Every visible report has been triaged by AI and confirmed by human moderators. No engagement-driven ranking.
- 🎯 **Schemes For You** — Static-tag personalization (v1) of relevant government schemes, scholarships, and bills. ML-driven (v2 roadmap).
- 📊 **Status Timelines** — Submitted → Under Review → Forwarded → Action Taken. Citizens see exactly where their report stands.

## How AwareX Addresses Track 4 Ethics

| Ethical Concern | Our Approach |
|---|---|
| Weaponization for harassment | Reports never auto-publish. Human moderation queue + accused-party right to respond. |
| Whose voices get centered | Category-based feeds, not engagement-driven. Verified credibility ranks ahead of virality. |
| Truth vs. lazy "both-sidesing" | AI flags credibility signals; humans verify; status is always visible. No false neutrality on settled facts. |
| Privacy of whistleblowers | Identity encrypted at rest. Unlock requires court warrant — by design, not by policy. |
| Transparency of AI recommendations | Every report displays its credibility breakdown — what AI flagged, what it weighed. No black box. |

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Next.js API Routes
- **AI:** Anthropic Claude API (Claude Sonnet 4)
- **Storage:** In-memory + seeded JSON (demo); Postgres planned for v2
- **Deployment:** Vercel

## Pages

- `/` — Landing
- `/submit` — Citizen report submission with live AI triage
- `/feed` — Public feed of verified reports with status timelines
- `/gov` — Government officer console (open in demo; access-controlled in v2)
- `/schemes` — Personalized government schemes & bills

## Getting Started

```bash
git clone https://github.com/yourusername/awarex.git
cd awarex
npm install
cp .env.example .env       # Add your Anthropic API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Demo without API key:** The `/api/verify` endpoint includes a heuristic mock fallback, so the UI fully works even without an Anthropic key. For the live AI moment in your demo, set the key in `.env`.

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Roadmap (Post-Hackathon)

- [ ] Real authentication with encrypted identity vault (zero-knowledge architecture)
- [ ] Database persistence (Postgres) with audit logs on every status change
- [ ] ML-driven personalization for "Schemes For You"
- [ ] Multi-language support (Hindi, Telugu, Tamil + 8 more Indian languages)
- [ ] Image forensics and metadata verification on uploaded evidence
- [ ] Coordinated-behavior detection to prevent brigading and manipulation
- [ ] Real government department API integrations (district-level pilots first)
- [ ] Mobile app (React Native)
- [ ] Accused-party notification & response system before public posting
- [ ] Community moderator program

## Why This Matters

> One person speaking up is fragile. A thousand is infrastructure.

The cost of speaking up about wrongdoing in India — and most places — is borne entirely by the individual. AwareX shifts that cost to the collective. It does not promise to fix democracy. It builds the missing rails.

## Built By

Solo build for the Governance & Collaboration track. 24-hour hackathon.

## License

MIT
