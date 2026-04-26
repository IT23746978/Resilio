import { test, expect } from '@playwright/test';
import { ResourceDonationPage } from '../pages/ResourceDonationPage';

test.describe('Resource Donation - API Failure Negative Test', () => {
  test('DON-OPT-01: Verify application handles API failure gracefully', async ({ page }) => {
    // Mock the API to fail with 500 Internal Server Error
    await page.route('**/api/Donations', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    const donationPage = new ResourceDonationPage(page);
    await donationPage.goto();
    await donationPage.expectPageLoaded();

    // Fill form
    await donationPage.selectResourceType('Food');
    await donationPage.fillInputByName('quantity', '50 packs');
    await donationPage.enterManualLocation('Colombo');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.dismiss();
    });

    // Submit
    await donationPage.submitDonation();

    // The component does a fetch, then alerts on error. Give it a brief moment.
    await page.waitForTimeout(1000); 

    // Verify the alert message
    expect(alertMessage).toBe('An error occurred. Please try again.');
    
    // Verify we did NOT go to success screen
    await expect(page.getByText('Donation Submitted')).not.toBeVisible();
  });
});
