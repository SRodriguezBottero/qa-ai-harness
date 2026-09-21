"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const links = [
  { href: "/", label: "Overview" },
  { href: "/scaffold", label: "Scaffold" },
  { href: "/sync", label: "Sync" },
  { href: "/self-heal", label: "Self-heal" },
  { href: "/guardrail", label: "Jev guardrail" },
  { href: "/triage", label: "Jev triage" },
  { href: "/config", label: "Config" },
  { href: "/mesa/login", label: "Mesa app" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onMesa = pathname.startsWith("/mesa");
  if (onMesa) return <>{children}</>;

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <aside className="border-b border-border bg-sidebar lg:w-64 lg:border-r lg:border-b-0">
        <div className="px-5 py-6">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            QA AI Harness
          </p>
          <h1 className="font-heading mt-1 text-xl leading-tight">Playwright · Cursor · Jev</h1>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm whitespace-nowrap",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 px-4 py-6 sm:px-8">{children}</main>
    </div>
  );
}
