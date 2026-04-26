import { Page } from '@playwright/test';

export async function mockDonationApi(page: Page) {
  let capturedRequest: any = null;

  await page.route('**/api/Donations', async (route) => {
    if (route.request().method() === 'POST') {
      const postData = route.request().postDataJSON();
      capturedRequest = postData;
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Donation submitted successfully' }),
      });
    } else {
      await route.continue();
    }
  });

  return {
    getCapturedRequest: () => capturedRequest,
  };
}
