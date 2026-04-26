import { test, expect } from '@playwright/test';
import { ResourceDonationPage } from '../pages/ResourceDonationPage';
import testData from '../test-data/donation-test-data.json' assert { type: 'json' };

test.describe('Resource Donation - Dynamic Fields @demo', () => {
  let donationPage: ResourceDonationPage;

  test.beforeEach(async ({ page }) => {
    donationPage = new ResourceDonationPage(page);
    await donationPage.goto();
    await donationPage.expectPageLoaded();
  });

  const testIdMap: Record<string, string> = {
    'Food': 'DON-003',
    'Medicine': 'DON-004',
    'Clothes': 'DON-005',
    'Vehicle': 'DON-006',
    'Other': 'DON-007'
  };

  for (const data of testData) {
    const testId = testIdMap[data.resourceType];
    test(`${testId}: Verify dynamic fields for ${data.resourceType}`, async ({ page }) => {
      await donationPage.selectResourceType(data.resourceType);
      
      if (data.resourceType === 'Food') {
        await expect(page.locator('select[name="foodType"]')).toBeVisible();
        await expect(page.locator('input[name="itemName"]')).toBeVisible();
      } else if (data.resourceType === 'Medicine') {
        await expect(page.locator('input[name="medicineType"]')).toBeVisible();
      } else if (data.resourceType === 'Clothes') {
        await expect(page.locator('input[name="clothingType"]')).toBeVisible();
        await expect(page.locator('select[name="size"]')).toBeVisible();
      } else if (data.resourceType === 'Vehicle') {
        await expect(page.locator('select[name="vehicleType"]')).toBeVisible();
        await expect(page.locator('input[name="vehicleCapacity"]')).toBeVisible();
        await expect(page.locator('input[name="availableTime"]')).toBeVisible();
      } else if (data.resourceType === 'Other') {
        await expect(page.locator('input[name="otherDetails"]')).toBeVisible();
      }

      // Quantity is common to all
      await expect(page.locator('input[name="quantity"]')).toBeVisible();
    });
  }
});
