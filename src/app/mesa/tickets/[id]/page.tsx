"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadTickets, updateTicketStatus } from "@/lib/mesa/storage";
import type { MesaTicket, TicketStatus } from "@/lib/mesa/catalog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SESSION = "mesa-session";

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<MesaTicket | null | undefined>(undefined);
  const [status, setStatus] = useState<TicketStatus>("open");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!window.sessionStorage.getItem(SESSION)) {
      router.replace("/mesa/login");
      return;
    }
    const frame = requestAnimationFrame(() => {
      const found = loadTickets().find((item) => item.id === params.id) ?? null;
      setTicket(found);
      if (found) setStatus(found.status);
    });
    return () => cancelAnimationFrame(frame);
  }, [params.id, router]);

  if (ticket === undefined) {
    return (
      <main className="px-4 py-10">
        <p>Loading ticket…</p>
      </main>
    );
  }

  if (ticket === null) {
    return (
      <main className="px-4 py-10">
        <h1 className="font-heading text-4xl">Ticket not found</h1>
        <p className="mt-2">There is no ticket with that id in this workspace.</p>
        <Link href="/mesa/inbox" className="mt-4 inline-block text-[#3f6f5b] underline">
          Back to Inbox
        </Link>
      </main>
    );
  }

  function save() {
    if (!ticket) return;
    updateTicketStatus(ticket.id, status);
    setTicket({ ...ticket, status });
    setSaved(true);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8">
      <Link href="/mesa/inbox" className="text-sm text-[#3f6f5b] underline">
        Inbox
      </Link>
      <h1 className="font-heading mt-4 text-4xl">{ticket.subject}</h1>
      <p className="mt-2 text-sm text-[#5c6a62]">
        {ticket.id} · requester {ticket.requester}
      </p>
      <p className="mt-6 rounded-xl bg-white p-4 leading-relaxed ring-1 ring-[#d7cfc0]">{ticket.body}</p>
      <form
        className="mt-6 space-y-3 rounded-xl bg-white p-4 ring-1 ring-[#d7cfc0]"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          className="h-9 w-full rounded-lg border border-[#d7cfc0] bg-white px-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as TicketStatus)}
        >
          <option value="open">open</option>
          <option value="pending">pending</option>
          <option value="resolved">resolved</option>
        </select>
        <Button type="submit">Save</Button>
        {saved ? (
          <p role="status" className="text-sm text-[#3f6f5b]">
            Ticket saved as {status}.
          </p>
        ) : null}
      </form>
    </main>
  );
}
