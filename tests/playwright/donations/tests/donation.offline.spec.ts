import { test, expect } from '@playwright/test';
import { ResourceDonationPage } from '../pages/ResourceDonationPage';

test.describe('Resource Donation - Offline', () => {
  test('DON-016: Verify offline donation handling', async ({ page, context }) => {
    // Note: Not tagged with @demo because offline behavior can be tricky in some CI setups
    
    const donationPage = new ResourceDonationPage(page);
    await donationPage.goto();
    await donationPage.expectPageLoaded();

    // Fill form
    await donationPage.selectResourceType('Food');
    await donationPage.fillInputByName('quantity', '50 packs');
    await donationPage.enterManualLocation('Colombo');

    // Simulate offline
    await context.setOffline(true);

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.dismiss();
    });

    // Submit
    await donationPage.submitDonation();
    
    // Give it a brief moment to process the submit
    await page.waitForTimeout(500);

    // The frontend logic shows an alert: "You are offline. Your donation form is saved safely and will sync when the internet returns!"
    expect(alertMessage).toBe('You are offline. Your donation form is saved safely and will sync when the internet returns!');

    // Success screen should still show up
    await donationPage.expectSuccessSummary('Food', '50 packs', 'Colombo');
    
    // Restore network
    await context.setOffline(false);
  });
});
