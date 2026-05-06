import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="relative z-20 border-b border-line bg-cream/80 backdrop-blur-sm sticky top-0">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Aware<span className="italic text-saffron">X</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/feed" className="hover:text-saffron transition">Feed</Link>
          <Link href="/schemes" className="hover:text-saffron transition">For You</Link>
          <Link href="/gov" className="hover:text-saffron transition">Officer</Link>
          <Link
            href="/submit"
            className="bg-ink text-cream px-4 py-2 rounded-full hover:bg-saffron transition"
          >
            Report Incident →
          </Link>
        </div>
      </div>
    </nav>
  );
}
