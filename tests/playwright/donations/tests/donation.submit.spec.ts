import { test, expect } from '@playwright/test';
import { ResourceDonationPage } from '../pages/ResourceDonationPage';
import { mockDonationApi } from '../utils/donationApiMock';

test.describe('Resource Donation - Submit @demo', () => {
  test('DON-014: Verify successful Food donation @demo', async ({ page }) => {
    await mockDonationApi(page);
    const donationPage = new ResourceDonationPage(page);
    
    await donationPage.goto();
    await donationPage.expectPageLoaded();

    await donationPage.selectResourceType('Food');
    await donationPage.selectByName('foodType', 'Dry Rations');
    await donationPage.fillInputByName('itemName', 'Rice Pack');
    await donationPage.fillInputByName('quantity', '50 packs');
    await donationPage.enterManualLocation('Colombo');

    await donationPage.submitDonation();

    // Assert success screen appears
    await expect(page.getByText('Donation Submitted')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Thank you for your contribution!' })).toBeVisible();
  });

  test('DON-015: Verify API payload @demo', async ({ page }) => {
    const apiMock = await mockDonationApi(page);
    const donationPage = new ResourceDonationPage(page);
    
    await donationPage.goto();
    await donationPage.expectPageLoaded();

    await donationPage.selectResourceType('Food');
    await donationPage.selectByName('foodType', 'Dry Rations');
    await donationPage.fillInputByName('itemName', 'Rice Pack');
    await donationPage.fillInputByName('quantity', '50 packs');
    await donationPage.checkPickupRequired();
    await donationPage.selectByName('availability', 'Available Immediately');
    await donationPage.enterManualLocation('Colombo');

    await donationPage.submitDonation();

    const requestPayload = apiMock.getCapturedRequest();
    expect(requestPayload).not.toBeNull();
    const payload = typeof requestPayload === 'string' ? JSON.parse(requestPayload) : requestPayload;
    
    expect(payload.resourceType).toBe('Food');
    expect(payload.foodType).toBe('Dry Rations');
    expect(payload.itemName).toBe('Rice Pack');
    expect(payload.quantity).toBe('50 packs');
    expect(payload.location).toBe('Colombo');
    expect(payload.pickupRequired).toBe(true);
    expect(payload.availability).toBe('Available Immediately');
  });

  test('DON-017: Verify success confirmation summary @demo', async ({ page }) => {
    await mockDonationApi(page);
    const donationPage = new ResourceDonationPage(page);
    
    await donationPage.goto();
    await donationPage.expectPageLoaded();

    await donationPage.selectResourceType('Vehicle');
    await donationPage.fillInputByName('quantity', '1 Van');
    await donationPage.enterManualLocation('Galle');

    await donationPage.submitDonation();

    // Assert summary shows
    await expect(page.getByText('Resource Type: Vehicle')).toBeVisible();
    await expect(page.getByText('Quantity: 1 Van')).toBeVisible();
    await expect(page.getByText('Location: Galle')).toBeVisible();
  });
});
