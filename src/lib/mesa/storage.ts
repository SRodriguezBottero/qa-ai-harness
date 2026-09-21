"use client";

import { seedTickets, type MesaTicket, type TicketStatus } from "./catalog";

const KEY = "mesa-tickets-v1";

export function loadTickets(): MesaTicket[] {
  if (typeof window === "undefined") return seedTickets;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seedTickets;
    return JSON.parse(raw) as MesaTicket[];
  } catch {
    return seedTickets;
  }
}

export function saveTickets(tickets: MesaTicket[]) {
  window.localStorage.setItem(KEY, JSON.stringify(tickets));
}

export function updateTicketStatus(id: string, status: TicketStatus) {
  const tickets = loadTickets().map((ticket) =>
    ticket.id === id ? { ...ticket, status } : ticket,
  );
  saveTickets(tickets);
  return tickets;
}

export function resetTickets() {
  saveTickets(seedTickets);
  return seedTickets;
}
