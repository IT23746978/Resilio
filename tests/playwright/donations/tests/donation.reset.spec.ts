import { test, expect } from '@playwright/test';
import { ResourceDonationPage } from '../pages/ResourceDonationPage';
import { mockDonationApi } from '../utils/donationApiMock';

test.describe('Resource Donation - Reset @demo', () => {
  test('DON-018: Reset form on Donate Another Resource', async ({ page }) => {
    await mockDonationApi(page);
    const donationPage = new ResourceDonationPage(page);
    
    await donationPage.goto();
    await donationPage.expectPageLoaded();

    // Fill form and submit
    await donationPage.selectResourceType('Food');
    await donationPage.fillInputByName('quantity', '50 packs');
    await donationPage.enterManualLocation('Colombo');
    await donationPage.submitDonation();

    // Assert success screen
    await donationPage.expectSuccessSummary('Food', '50 packs', 'Colombo');

    // Click Donate Another Resource
    await donationPage.donateAnotherResource();

    // Verify form returns to page
    await donationPage.expectPageLoaded();

    // Verify fields are empty
    await expect(page.locator('input[name="quantity"]')).toBeEmpty();
    await expect(page.locator('input[name="location"]')).toBeEmpty();
  });
});
