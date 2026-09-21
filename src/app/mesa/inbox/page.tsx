"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadTickets, resetTickets } from "@/lib/mesa/storage";
import type { MesaTicket, TicketStatus } from "@/lib/mesa/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SESSION = "mesa-session";

export default function InboxPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<MesaTicket[]>([]);
  const [filter, setFilter] = useState<TicketStatus | "all">("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!window.sessionStorage.getItem(SESSION)) {
      router.replace("/mesa/login");
      return;
    }
    const frame = requestAnimationFrame(() => {
      setTickets(loadTickets());
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [router]);

  const visible = useMemo(
    () => (filter === "all" ? tickets : tickets.filter((ticket) => ticket.status === filter)),
    [tickets, filter],
  );

  if (!ready) {
    return (
      <main className="px-4 py-10 sm:px-8">
        <p>Loading inbox…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-4xl">Inbox</h1>
          <p className="text-sm text-[#5c6a62]">{visible.length} tickets</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "open", "pending", "resolved"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              variant={filter === value ? "default" : "outline"}
              onClick={() => setFilter(value)}
            >
              {value}
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setTickets(resetTickets())}
          >
            Reset data
          </Button>
        </div>
      </div>
      {visible.length === 0 ? (
        <p role="status">No tickets match this filter.</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((ticket) => (
            <li key={ticket.id}>
              <Link
                href={`/mesa/tickets/${ticket.id}`}
                data-testid={`ticket-${ticket.id}`}
                className="block rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#d7cfc0] hover:ring-[#3f6f5b]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{ticket.subject}</p>
                  <Badge variant="secondary">{ticket.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-[#5c6a62]">
                  {ticket.requester} · {ticket.preview}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
