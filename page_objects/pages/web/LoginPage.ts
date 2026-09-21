import type { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(private readonly page: Page) {
    this.email = page.getByLabel("Email");
    this.password = page.getByLabel("Password");
    this.submit = page.getByRole("button", { name: "Sign in" });
  }

  async goto() {
    await this.page.goto("/mesa/login");
  }

  async loginAsDefault(profile: { email: string; password: string }) {
    await this.email.fill(profile.email);
    await this.password.fill(profile.password);
    await this.submit.click();
    await this.page.getByRole("heading", { name: "Inbox" }).waitFor();
  }
}
