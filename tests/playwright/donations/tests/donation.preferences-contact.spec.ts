import { test, expect } from '@playwright/test';
import { ResourceDonationPage } from '../pages/ResourceDonationPage';

test.describe('Resource Donation - Preferences & Contact', () => {
  test('DON-012: Verify collection preference', async ({ page }) => {
    // Note: Not tagged with @demo because it's an extended form test, but we can if stable
    const donationPage = new ResourceDonationPage(page);
    await donationPage.goto();
    await donationPage.expectPageLoaded();
    
    // Tick Pickup Required
    await donationPage.checkPickupRequired();
    await expect(page.locator('input[name="pickupRequired"]')).toBeChecked();

    // Change availability
    await donationPage.selectByName('availability', 'Schedule for Later');
    await expect(page.locator('select[name="availability"]')).toHaveValue('Schedule for Later');
  });

  test('DON-013: Verify optional contact details', async ({ page }) => {
    const donationPage = new ResourceDonationPage(page);
    await donationPage.goto();
    await donationPage.expectPageLoaded();

    // Fill contact details
    await donationPage.fillInputByName('donorName', 'Bruce Wayne');
    await donationPage.fillInputByName('contactNumber', 'bruce@wayne.com');
    await donationPage.selectByName('contactMethod', 'Email');

    await expect(page.locator('input[name="donorName"]')).toHaveValue('Bruce Wayne');
    await expect(page.locator('input[name="contactNumber"]')).toHaveValue('bruce@wayne.com');
    await expect(page.locator('select[name="contactMethod"]')).toHaveValue('Email');
  });
});
