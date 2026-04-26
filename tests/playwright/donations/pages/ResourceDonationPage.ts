import { Page, expect } from '@playwright/test';

export class ResourceDonationPage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(process.env.BASE_URL || 'https://witty-bay-072ec5b00.7.azurestaticapps.net/');
    await this.page.getByRole('button', { name: 'Donate Now' }).click();
  }

  async expectPageLoaded() {
    await expect(this.page.getByRole('heading', { name: 'Donate Resources' })).toBeVisible();
    await expect(this.page.getByText('1. Select Resource Type')).toBeVisible();
  }

  async selectResourceType(type: string) {
    // There are buttons for each resource type with names like "Food", "Medicine", etc.
    // However, they also have an icon span and description. 
    // Wait, the component maps resourceTypes and creates buttons. The name is inside a span.
    await this.page.locator(`button.resourceCard:has-text("${type}")`).click();
  }

  async fillInputByName(name: string, value: string) {
    await this.page.locator(`input[name="${name}"]`).fill(value);
  }

  async selectByName(name: string, value: string) {
    await this.page.locator(`select[name="${name}"]`).selectOption(value);
  }

  async checkPickupRequired() {
    await this.page.locator('input[name="pickupRequired"]').check();
  }

  async enterManualLocation(location: string) {
    await this.page.getByRole('button', { name: 'Enter Manually' }).click();
    await this.page.locator('input[name="location"]').fill(location);
  }

  async submitDonation() {
    await this.page.getByRole('button', { name: 'Submit Donation' }).click();
  }

  async expectSuccessSummary(resourceType: string, quantity: string, location: string) {
    await expect(this.page.getByText('Donation Submitted')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Thank you for your contribution!' })).toBeVisible();
    await expect(this.page.getByText(`Resource Type: ${resourceType}`)).toBeVisible();
    await expect(this.page.getByText(`Quantity: ${quantity}`)).toBeVisible();
    await expect(this.page.getByText(`Location: ${location}`)).toBeVisible();
  }

  async donateAnotherResource() {
    await this.page.getByRole('button', { name: 'Donate Another Resource' }).click();
  }
}
