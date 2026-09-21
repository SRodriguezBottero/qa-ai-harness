import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class TicketPage {
  readonly status: Locator;
  readonly save: Locator;

  constructor(private readonly page: Page) {
    this.status = page.getByLabel("Status");
    this.save = page.getByRole("button", { name: "Save" });
  }

  async expectDetails() {
    await expect(this.page.getByText(/requester/i)).toBeVisible();
    await expect(this.status).toBeVisible();
  }

  async resolveTicket() {
    await this.status.selectOption("resolved");
    await this.save.click();
    await expect(this.page.getByRole("status")).toContainText("resolved");
  }
}
