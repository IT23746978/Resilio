import { test, expect } from '@playwright/test';
import { ResourceDonationPage } from '../pages/ResourceDonationPage';

test.describe('Resource Donation - Smoke Tests', () => {
  test('DON-001: Verify donation page loads correctly @demo', async ({ page }) => {
    const donationPage = new ResourceDonationPage(page);
    await donationPage.goto();
    
    // Verify headings
    await expect(page.getByRole('heading', { name: 'Donate Resources' })).toBeVisible();
    await expect(page.getByText('1. Select Resource Type')).toBeVisible();
    
    // Verify submit button
    await expect(page.getByRole('button', { name: 'Submit Donation' })).toBeVisible();
  });

  test('DON-002: Verify default Food type is selected @demo', async ({ page }) => {
    const donationPage = new ResourceDonationPage(page);
    await donationPage.goto();
    await donationPage.expectPageLoaded();
    
    // Food-specific fields should be visible by default
    await expect(page.locator('select[name="foodType"]')).toBeVisible();
    await expect(page.locator('input[name="itemName"]')).toBeVisible();
  });
});
