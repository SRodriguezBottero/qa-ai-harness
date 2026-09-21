import type { Page, Locator } from "@playwright/test";

export class InboxPage {
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Inbox" });
  }

  async expectTicketList() {
    await this.heading.waitFor();
    await this.page.getByRole("link").first().waitFor();
  }

  async openTicket(id = "MESA-104") {
    await this.page.getByTestId(`ticket-${id}`).click();
  }

  async filterByStatus(status: "open" | "pending" | "resolved" | "all") {
    await this.page.getByRole("button", { name: status, exact: true }).click();
  }
}
