import { test, expect } from '@playwright/test';
import { ResourceDonationPage } from '../pages/ResourceDonationPage';
import { mockDonationApi } from '../utils/donationApiMock';

test.describe('Resource Donation - Navigation', () => {
  test('DON-019: Verify dashboard navigation', async ({ page }) => {
    // Note: Not tagged with @demo because dashboard requires authentication state,
    // which may cause a redirect or an empty page if we aren't logged in.
    
    await mockDonationApi(page);
    const donationPage = new ResourceDonationPage(page);
    await donationPage.goto();
    await donationPage.expectPageLoaded();

    // Submit to reach the success screen
    await donationPage.selectResourceType('Food');
    await donationPage.fillInputByName('quantity', '50 packs');
    await donationPage.enterManualLocation('Colombo');
    await donationPage.submitDonation();

    // Click Go to Dashboard
    await page.getByRole('button', { name: 'Go to Dashboard' }).click();

    // Wait for URL to contain /dashboard (or redirect to /login if unauthenticated)
    // The frontend logic: navigate("/dashboard")
    await page.waitForURL('**/dashboard**', { timeout: 5000 }).catch(() => {});
    
    // As long as the button triggered a navigation attempt out of the donation success screen, 
    // we consider the routing wire-up successful.
    const url = page.url();
    expect(url.includes('/dashboard') || url.includes('/login')).toBeTruthy();
  });
});
