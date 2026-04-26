// tests/volunteers.spec.js
// Based on actual AdminVolunteers.jsx and AdminLogin.jsx

import { test, expect } from '@playwright/test';

async function adminLogin(page) {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await page.getByPlaceholder('Enter password (admin123)').fill('admin123');
    await page.getByRole('button', { name: 'Access Control Panel' }).click();
    await page.waitForURL('**/admin/dashboard');
}

async function goToVolunteers(page) {
    await adminLogin(page);
    await page.getByRole('link', { name: /volunteer/i })
        .or(page.locator('text=Volunteer Management'))
        .first().click();
    await page.waitForLoadState('networkidle');
}

test.describe('Admin Login', () => {

    test('TC-LOGIN-01 | Login page loads correctly', async ({ page }) => {
        await page.goto('/admin');
        await expect(page.locator('text=Resilio Admin Control')).toBeVisible();
        await expect(page.getByPlaceholder('Enter password (admin123)')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Access Control Panel' })).toBeVisible();
    });

    test('TC-LOGIN-02 | Wrong password shows error message', async ({ page }) => {
        await page.goto('/admin');
        await page.getByPlaceholder('Enter password (admin123)').fill('wrongpassword');
        await page.getByRole('button', { name: 'Access Control Panel' }).click();
        await expect(page.locator('.adminError')).toContainText('Invalid credentials');
    });

    test('TC-LOGIN-03 | Correct password redirects to dashboard', async ({ page }) => {
        await page.goto('/admin');
        await page.getByPlaceholder('Enter password (admin123)').fill('admin123');
        await page.getByRole('button', { name: 'Access Control Panel' }).click();
        await expect(page).toHaveURL(/admin\/dashboard/);
    });

    test('TC-LOGIN-04 | Return to Public Site button navigates to /', async ({ page }) => {
        await page.goto('/admin');
        await page.getByRole('button', { name: 'Return to Public Site' }).click();
        await expect(page).toHaveURL('/');
    });

    test('TC-LOGIN-05 | Error clears when user starts typing again', async ({ page }) => {
        await page.goto('/admin');
        await page.getByPlaceholder('Enter password (admin123)').fill('wrong');
        await page.getByRole('button', { name: 'Access Control Panel' }).click();
        await expect(page.locator('.adminError')).toBeVisible();
        await page.getByPlaceholder('Enter password (admin123)').fill('a');
        await expect(page.locator('.adminError')).not.toBeVisible();
    });

});

test.describe('Volunteer Management', () => {

    test.beforeEach(async ({ page }) => {
        await goToVolunteers(page);
    });

    test('TC-VOL-01 | Volunteer Management heading is visible', async ({ page }) => {
        await expect(page.locator('text=Volunteer Management')).toBeVisible();
    });

    test('TC-VOL-02 | Admin table renders on page', async ({ page }) => {
        await expect(page.locator('table.adminTable')).toBeVisible();
    });

    test('TC-VOL-03 | Table has correct column headers', async ({ page }) => {
        const headers = ['ID', 'Volunteer Info', 'Location', 'Skills / Roles', 'Vehicle', 'System Status', 'Actions'];
        for (const header of headers) {
            await expect(page.locator(`th:has-text("${header}")`)).toBeVisible();
        }
    });

    // Skipped: DB always has volunteer data in this environment
    test.skip('TC-VOL-04 | Empty state shows correct message', async ({ page }) => { });

    test('TC-VOL-05 | Volunteer rows show ID starting with #', async ({ page }) => {
        const firstCell = page.locator('tbody tr td').first();
        if (!await firstCell.isVisible()) { test.skip(); return; }
        await expect(firstCell).toContainText('#');
    });

    test('TC-VOL-06 | Status dropdown has Active, Busy, Blocked options', async ({ page }) => {
        const dropdown = page.locator('select.assignSelect').first();
        if (!await dropdown.isVisible()) { test.skip(); return; }
        const options = await dropdown.locator('option').allTextContents();
        expect(options.some(o => o.includes('Active'))).toBe(true);
        expect(options.some(o => o.includes('Busy'))).toBe(true);
        expect(options.some(o => o.includes('Blocked'))).toBe(true);
    });

    test('TC-VOL-07 | Changing status triggers API and shows toast', async ({ page }) => {
        const dropdown = page.locator('select.assignSelect').first();
        if (!await dropdown.isVisible()) { test.skip(); return; }
        await dropdown.selectOption('Blocked');
        const toast = page.locator('.adminToast');
        await expect(toast).toBeVisible({ timeout: 6000 });
    });

    test('TC-VOL-08 | Delete button opens confirmation modal', async ({ page }) => {
        const deleteBtn = page.locator('button[title="Remove volunteer"]').first();
        if (!await deleteBtn.isVisible() || !await deleteBtn.isEnabled()) { test.skip(); return; }
        await deleteBtn.click();
        await expect(page.locator('.modalOverlay')).toBeVisible();
        await expect(page.locator('.confirmModal h3')).toContainText('Remove Volunteer');
    });

    test('TC-VOL-09 | Modal shows volunteer name in warning text', async ({ page }) => {
        const firstRow = page.locator('tbody tr').first();
        if (!await firstRow.isVisible()) { test.skip(); return; }
        const name = await firstRow.locator('td strong').textContent();
        const deleteBtn = firstRow.locator('button[title="Remove volunteer"]');
        if (!await deleteBtn.isEnabled()) { test.skip(); return; }
        await deleteBtn.click();
        await expect(page.locator('.confirmModal p strong')).toContainText(name);
    });

    test('TC-VOL-10 | Modal shows warning about irreversible action', async ({ page }) => {
        const deleteBtn = page.locator('button[title="Remove volunteer"]').first();
        if (!await deleteBtn.isVisible() || !await deleteBtn.isEnabled()) { test.skip(); return; }
        await deleteBtn.click();
        await expect(page.locator('.confirmModal')).toContainText('cannot be undone');
    });

    test('TC-VOL-11 | Cancel button closes modal without deleting', async ({ page }) => {
        const rows = page.locator('tbody tr');
        const countBefore = await rows.count();
        if (countBefore === 0) { test.skip(); return; }
        const deleteBtn = rows.first().locator('button[title="Remove volunteer"]');
        if (!await deleteBtn.isEnabled()) { test.skip(); return; }
        await deleteBtn.click();
        await page.locator('.btnCancel').click();
        await expect(page.locator('.modalOverlay')).not.toBeVisible();
        expect(await rows.count()).toBe(countBefore);
    });

    test('TC-VOL-12 | Confirm delete removes row and shows toast', async ({ page }) => {
        const rows = page.locator('tbody tr');
        const countBefore = await rows.count();
        if (countBefore === 0) { test.skip(); return; }
        const deleteBtn = rows.first().locator('button[title="Remove volunteer"]');
        if (!await deleteBtn.isEnabled()) { test.skip(); return; }
        await deleteBtn.click();
        await page.locator('.btnDelete').click();
        await expect(page.locator('.adminToast')).toBeVisible({ timeout: 6000 });
        await page.waitForTimeout(500);
        expect(await rows.count()).toBeLessThan(countBefore);
    });

    test('TC-VOL-13 | Busy volunteer delete button is disabled', async ({ page }) => {
        const dropdown = page.locator('select.assignSelect').first();
        if (!await dropdown.isVisible()) { test.skip(); return; }
        await dropdown.selectOption('Busy');
        await page.waitForTimeout(1000);
        const deleteBtn = page.locator('tbody tr').first().locator('button[title="Remove volunteer"]');
        await expect(deleteBtn).toBeDisabled();
    });

    test('TC-VOL-14 | Vehicle column shows emoji or No vehicle text', async ({ page }) => {
        const rows = page.locator('tbody tr');
        if (await rows.count() === 0) { test.skip(); return; }
        const vehicleCell = rows.first().locator('td').nth(4);
        const text = await vehicleCell.textContent();
        expect(text.includes('🚐') || text.includes('❌')).toBe(true);
    });

    test('TC-VOL-15 | Page does not stay stuck on loading', async ({ page }) => {
        await page.waitForTimeout(3000);
        await expect(page.locator('.loadingState')).not.toBeVisible();
    });

});