import Link from "next/link";

export default function MesaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mesa-root min-h-full bg-[#f3eee3] text-[#1d2a24]">
      <header className="flex items-center justify-between border-b border-[#d7cfc0] px-4 py-3 sm:px-8">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#5c6a62] uppercase">Mesa</p>
          <p className="text-lg font-medium">Support inbox</p>
        </div>
        <Link href="/" className="text-sm text-[#3f6f5b] underline-offset-4 hover:underline">
          Back to harness
        </Link>
      </header>
      {children}
    </div>
  );
}
