const { expect } = require('@playwright/test');

class RequestHelpPage {
  constructor(page) {
    this.page = page;

    this.fullNameInput = page.getByLabel('Full Name');
    this.contactInput = page.getByLabel('Phone Number or Email');
    this.manualLocationButton = page.getByRole('button', { name: /enter manually/i });
    this.locationInput = page.locator('input').nth(2);
    this.helpTypeDropdown = page.locator('select#helpType');
    this.noteInput = page.getByLabel(/optional note/i);
    this.urgentToggle = page.getByText(/mark as urgent/i);
    this.submitButton = page.getByRole('button', { name: /submit request/i });
  }

  async goto() {
    await this.page.goto('/');

    const requestNowButton = this.page.getByRole('button', {
      name: /request now/i
    });

    await requestNowButton.waitFor({ state: 'visible' });
    await requestNowButton.click();

    await this.page.waitForURL('**/request-help');
    await expect(this.fullNameInput).toBeVisible();
  }

  async fillRequest(data, helpType = data.helpType || 'Food') {
    await this.fullNameInput.fill(data.name);
    await this.contactInput.fill(data.contact);

    await this.manualLocationButton.click();
    await this.locationInput.fill(data.location);

    await this.selectHelpType(helpType);

    if (data.note !== undefined) {
      await this.noteInput.fill(data.note);
    }
  }

  async selectHelpType(helpType) {
    await this.helpTypeDropdown.waitFor({ state: 'visible' });

    await this.helpTypeDropdown.evaluate((select, helpType) => {
      const options = Array.from(select.options);

      const matchedOption = options.find(option =>
        option.value.toLowerCase() === helpType.toLowerCase() ||
        option.textContent.toLowerCase().includes(helpType.toLowerCase())
      );

      if (!matchedOption) {
        throw new Error(
          `Help type "${helpType}" not found. Available options: ${options
            .map(option => `${option.value} / ${option.textContent}`)
            .join(', ')}`
        );
      }

      select.value = matchedOption.value;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }, helpType);
  }

  async markUrgent() {
    await this.urgentToggle.click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async enterVerificationCodeIfShown(code = '123456') {
    const otpInput = this.page.locator(
      'input[placeholder*="code" i], input[placeholder*="otp" i], input[name*="code" i], input[name*="otp" i]'
    );

    if (await otpInput.first().isVisible().catch(() => false)) {
      await otpInput.first().fill(code);

      const verifyButton = this.page.getByRole('button', {
        name: /verify|confirm|submit/i
      });

      if (await verifyButton.isVisible().catch(() => false)) {
        await verifyButton.click();
      }
    }
  }
}

module.exports = { RequestHelpPage };