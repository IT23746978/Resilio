const { test, expect } = require('@playwright/test');
const { RequestHelpPage } = require('../pages/RequestHelpPage');
const testData = require('../test-data/request-help-data.json');

test.describe('Request Help Page - Playwright E2E Tests', () => {

  test('should load request-help page successfully', async ({ page }) => {
    const requestHelpPage = new RequestHelpPage(page);

    await requestHelpPage.goto();
    await expect(requestHelpPage.fullNameInput).toBeVisible();
    await expect(requestHelpPage.contactInput).toBeVisible();
    await expect(requestHelpPage.helpTypeDropdown).toBeVisible();
    await expect(requestHelpPage.submitButton).toBeVisible();
  });

  test('should submit disaster relief request with valid data and stub verification code', async ({ page }) => {
    const requestHelpPage = new RequestHelpPage(page);

    await requestHelpPage.goto();
    await requestHelpPage.fillRequest(testData.validRequest);
    await requestHelpPage.markUrgent();
    await requestHelpPage.submit();
    await requestHelpPage.enterVerificationCodeIfShown(testData.verificationCode);
    await expect(requestHelpPage.submitButton).toBeVisible();
  });

  test('should show validation when required fields are empty', async ({ page }) => {
    const requestHelpPage = new RequestHelpPage(page);

    await requestHelpPage.goto();
    await requestHelpPage.submit();
    await expect(requestHelpPage.fullNameInput).toBeVisible();
    await expect(requestHelpPage.contactInput).toBeVisible();
  });

  test('should not submit request with invalid contact details', async ({ page }) => {
    const requestHelpPage = new RequestHelpPage(page);

    await requestHelpPage.goto();
    await requestHelpPage.fillRequest(testData.invalidContactRequest);
    await requestHelpPage.submit();
    await expect(requestHelpPage.contactInput).toBeVisible();
  });

  test('should toggle urgent request option', async ({ page }) => {
    const requestHelpPage = new RequestHelpPage(page);

    await requestHelpPage.goto();
    await requestHelpPage.markUrgent();
    await expect(requestHelpPage.urgentToggle).toBeVisible();
  });

  test('should allow request submission without optional note', async ({ page }) => {
    const requestHelpPage = new RequestHelpPage(page);

    const requestWithoutNote = {
      ...testData.validRequest,
      note: ''
    };

    await requestHelpPage.goto();
    await requestHelpPage.fillRequest(requestWithoutNote);
    await requestHelpPage.submit();
    await requestHelpPage.enterVerificationCodeIfShown(testData.verificationCode);
    await expect(requestHelpPage.submitButton).toBeVisible();
  });

  for (const helpType of testData.helpTypes) {
    test(`should allow user to select help type: ${helpType}`, async ({ page }) => {
      const requestHelpPage = new RequestHelpPage(page);
      await requestHelpPage.goto();
      await requestHelpPage.fillRequest(testData.validRequest, helpType);
      await expect(requestHelpPage.helpTypeDropdown).toHaveValue(new RegExp(helpType, 'i'));
    });
  }

});