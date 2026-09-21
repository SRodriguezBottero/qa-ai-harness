import { test, expect } from "../fixtures/tests";
import { LoginPage } from "../../page_objects/pages/web/LoginPage";
import { InboxPage } from "../../page_objects/pages/web/InboxPage";
import { TicketPage } from "../../page_objects/pages/web/TicketPage";

test.describe("Agent can resolve an inbox ticket", () => {
  test("Verify that the QA profile can open Inbox", async ({ page, defaultUserTest }) => {
    const loginPage = new LoginPage(page);
    const inboxPage = new InboxPage(page);
    await loginPage.goto();
    await loginPage.loginAsDefault(defaultUserTest);
    await inboxPage.expectTicketList();
  });

  test("Verify that a ticket can be marked resolved", async ({ page, defaultUserTest }) => {
    const loginPage = new LoginPage(page);
    const inboxPage = new InboxPage(page);
    const ticketPage = new TicketPage(page);
    await loginPage.goto();
    await loginPage.loginAsDefault(defaultUserTest);
    await inboxPage.openTicket("MESA-104");
    await ticketPage.expectDetails();
    await ticketPage.resolveTicket();
    await page.goto("/mesa/inbox");
    await expect(page.getByTestId("ticket-MESA-104")).toContainText("resolved");
  });
});
