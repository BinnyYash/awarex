import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AwareX — Civic infrastructure for collective courage",
  description: "Report incidents with AI-verified credibility, anonymity, and direct routing to government departments. Speak together, with proof.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="relative z-10">{children}</main>
        <footer className="relative z-10 border-t border-line mt-24">
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
            <div className="font-display text-2xl">AwareX</div>
            <div className="text-muted">
              Built for the Governance & Collaboration track. v0.1 — Hackathon Demo.
            </div>
            <div className="text-muted">
              Identity is encrypted. Truth is collective.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
