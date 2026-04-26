import { test, expect } from '@playwright/test';
import { ResourceDonationPage } from '../pages/ResourceDonationPage';

test.describe('Resource Donation - Location', () => {
  test('DON-010: Verify manual location entry @demo', async ({ page }) => {
    const donationPage = new ResourceDonationPage(page);
    await donationPage.goto();
    await donationPage.expectPageLoaded();
    
    // Manual location
    await donationPage.enterManualLocation('Colombo');
    
    // Assert value
    await expect(page.locator('input[name="location"]')).toHaveValue('Colombo');
  });

  test('DON-011: Verify current location using mocked geolocation', async ({ page, context }) => {
    // Note: Not tagged with @demo because geolocation permissions can be flaky in CI/Live demo
    
    // Grant geolocation permissions
    await context.grantPermissions(['geolocation']);
    // Set a mocked geolocation
    await context.setGeolocation({ latitude: 6.9271, longitude: 79.8612 });

    const donationPage = new ResourceDonationPage(page);
    await donationPage.goto();
    await donationPage.expectPageLoaded();

    // Click Use Current Location
    await page.getByRole('button', { name: 'Use Current Location' }).click();

    // The component fetches and formats to Lat/Lng
    // Wait for the value to change from empty to Lat: ..., Lng: ...
    const locationInput = page.locator('input[name="location"]');
    await expect(locationInput).toHaveValue(/Lat: 6\.92710, Lng: 79\.86120/);
  });
});
