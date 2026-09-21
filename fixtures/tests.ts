import { test as base } from "@playwright/test";

export const defaultUserTest = {
  email: "qa@mesa.test",
  password: "mesa-qa",
};

export const test = base.extend<{ defaultUserTest: typeof defaultUserTest }>({
  defaultUserTest: async ({}, use) => {
    await use(defaultUserTest);
  },
});

export { expect } from "@playwright/test";
