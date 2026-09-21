export type TicketStatus = "open" | "pending" | "resolved";

export type MesaTicket = {
  id: string;
  subject: string;
  requester: string;
  status: TicketStatus;
  preview: string;
  body: string;
};

export const QA_PROFILE = {
  email: "qa@mesa.test",
  password: "mesa-qa",
  name: "QA profile",
};

export const seedTickets: MesaTicket[] = [
  {
    id: "MESA-104",
    subject: "Payouts stuck on retry",
    requester: "Nora Ellison",
    status: "open",
    preview: "Third day in a row. Customers are waiting on payouts.",
    body: "Payouts have been retrying since Friday. The merchant dashboard still shows Pending.",
  },
  {
    id: "MESA-105",
    subject: "Cannot attach invoice PDF",
    requester: "Ivo Park",
    status: "pending",
    preview: "Upload button does nothing on Firefox.",
    body: "The attach invoice control never opens a file picker on Firefox 142.",
  },
  {
    id: "MESA-106",
    subject: "Workspace invite bounced",
    requester: "Rae Quinn",
    status: "resolved",
    preview: "Invite email bounced; we resent it.",
    body: "The original invite bounced. A second send landed. Marking resolved.",
  },
];
