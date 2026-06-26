import { expect, type Page } from '@playwright/test';

export class ChecklistPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page.getByTestId('checklist-page')).toBeVisible();
  }

  async createItem(title: string, description: string, referenceLink: string) {
    await this.page.getByTestId('checklist-title').fill(title);
    await this.page.getByTestId('checklist-description').fill(description);
    await this.page.getByTestId('checklist-reference-link').fill(referenceLink);
    await this.page.getByTestId('checklist-submit').click();
  }
}
