import { test, expect } from '@playwright/test';
import { ResourceDonationPage } from '../pages/ResourceDonationPage';

test.describe('Resource Donation - Validation @demo', () => {
  let donationPage: ResourceDonationPage;

  test.beforeEach(async ({ page }) => {
    donationPage = new ResourceDonationPage(page);
    await donationPage.goto();
    await donationPage.expectPageLoaded();
  });

  test('DON-008: Validation for empty quantity @demo', async ({ page }) => {
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.dismiss();
    });

    await donationPage.selectResourceType('Food');
    // quantity left empty
    await donationPage.enterManualLocation('Colombo');
    await donationPage.submitDonation();
    
    expect(alertMessage).toBe('Please enter the quantity.');
  });

  test('DON-009: Validation for empty location @demo', async ({ page }) => {
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.dismiss();
    });

    await donationPage.selectResourceType('Food');
    await donationPage.fillInputByName('quantity', '50 packs');
    // location left empty (which it is by default on manual mode)
    await page.getByRole('button', { name: 'Enter Manually' }).click();
    await donationPage.submitDonation();
    
    expect(alertMessage).toBe('Please provide the donation location.');
  });
});
