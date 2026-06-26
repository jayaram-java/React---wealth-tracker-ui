import { expect, type Page } from '@playwright/test';

export class WebsiteLinkPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page.getByTestId('website-link-page')).toBeVisible();
  }

  async createLink(url: string, description: string, remarks: string, categoryName: string) {
    await this.page.getByTestId('website-link-url').fill(url);
    await this.page.getByTestId('website-link-description').fill(description);
    await this.page.getByTestId('website-link-remarks').fill(remarks);
    await this.page.getByTestId('website-link-category-search').fill(categoryName);
    await this.page.getByTestId('website-link-submit').click();
  }
}
