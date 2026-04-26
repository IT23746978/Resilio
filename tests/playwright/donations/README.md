# Playwright E2E Testing — Resilio Resource Donation Module

## 1. Project Overview

This project contains the automated End-to-End (E2E) and UI testing suite for the Resilio **Resource Donation module**. The suite is built to support the Software Testing Life Cycle (STLC) phases and serves as the practical testing implementation for the SE3112 Advanced Software Engineering assignment.

The automation framework is developed using **Playwright with TypeScript** and is now organized under the root-level shared testing folder:

```text
tests/playwright/donations/
````

This structure allows multiple group members to keep their Playwright work in one common testing area while separating each module clearly.

---

## 2. Module Under Test

* **Module:** Resource Donation
* **Frontend Component:** `frontend/src/pages/Donation/ResourceDonation.jsx`
* **Testing Folder:** `tests/playwright/donations/`
* **Routing Approach:** Tests navigate to the application and access the donation flow through the available UI route/navigation.
* **Backend Endpoint:** `/api/Donations`
* **Backend Interception:** The donation API is mocked using Playwright network interception to avoid creating fake production donation records.

---

## 3. Testing Objectives

The primary objectives of this test suite are to validate:

* Page load and visibility of core elements.
* Default selection of the `Food` resource type.
* Dynamic field rendering for Food, Medicine, Clothes, Vehicle, and Other categories.
* Quantity and location required-field validation rules.
* Manual location entry and current geolocation behavior.
* Collection preferences and optional contact fields.
* Successful donation form submission.
* Correct API JSON payload generation.
* Offline mode handling.
* Success confirmation summary.
* “Donate Another Resource” reset flow.
* Dashboard navigation behavior.
* API failure handling.

---

## 4. Tools and Technologies

* **Testing Tool:** Playwright
* **Language:** TypeScript
* **Runtime:** Node.js / npm
* **Browsers Configured:** Chromium, Firefox, WebKit
* **Demo Browser Project:** `demo-chromium`
* **Reporting:** Playwright HTML Report
* **Debugging Artifacts:** Screenshots, traces, and videos
* **Data Management:** JSON test data
* **Design Pattern:** Page Object Model

---

## 5. Framework Architecture

The framework uses a clean modular structure:

* **Modular Framework:** Test files are separated by feature area.
* **Page Object Model:** Reusable UI actions are placed inside `ResourceDonationPage.ts`.
* **Data-Driven Testing:** JSON test data is used for testing multiple resource type partitions.
* **API Mocking / Network Interception:** `page.route()` is used to mock `/api/Donations`.
* **Strong Assertions:** Playwright assertions verify UI state, alerts, form values, API payload, and navigation.
* **Demo Separation:** Stable tests are tagged with `@demo`; environment-dependent tests are kept in the full suite only.

---

## 6. Folder Structure

```text
tests/playwright/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
└── donations/
    ├── pages/
    │   └── ResourceDonationPage.ts
    ├── test-data/
    │   └── donation-test-data.json
    ├── utils/
    │   └── donationApiMock.ts
    └── tests/
        ├── donation.api-failure.spec.ts
        ├── donation.dynamic-fields.spec.ts
        ├── donation.location.spec.ts
        ├── donation.navigation.spec.ts
        ├── donation.offline.spec.ts
        ├── donation.preferences-contact.spec.ts
        ├── donation.reset.spec.ts
        ├── donation.smoke.spec.ts
        ├── donation.submit.spec.ts
        └── donation.validation.spec.ts
```

---

## 7. File-by-File Explanation

| File / Folder                                 | Status        | Purpose                                                                    |
| --------------------------------------------- | ------------- | -------------------------------------------------------------------------- |
| `tests/playwright/playwright.config.ts`       | Active        | Shared Playwright configuration for all group Playwright tests             |
| `tests/playwright/package.json`               | Active        | Contains Playwright dependencies and scripts                               |
| `tests/playwright/.env.example`               | Template      | Shows required environment variables safely                                |
| `tests/playwright/.gitignore`                 | Active config | Prevents `.env`, `node_modules`, reports, and results from being committed |
| `donations/pages/ResourceDonationPage.ts`     | Active        | Page Object Model for donation page interactions                           |
| `donations/test-data/donation-test-data.json` | Active        | JSON data used for data-driven resource type tests                         |
| `donations/utils/donationApiMock.ts`          | Active        | Mocks `/api/Donations` and captures request payloads                       |
| `donations/tests/*.spec.ts`                   | Active        | Executable Playwright test files for DON-001 to DON-019 and DON-OPT-01     |

---

## 8. Test Cases Implemented

| Test ID        | Test Case Title                                | File                                   | Type                       | Status | `@demo`? |
| -------------- | ---------------------------------------------- | -------------------------------------- | -------------------------- | ------ | -------- |
| **DON-001**    | Verify donation page loads correctly           | `donation.smoke.spec.ts`               | Smoke                      | Passed | Yes      |
| **DON-002**    | Verify default Food type is selected           | `donation.smoke.spec.ts`               | UI                         | Passed | Yes      |
| **DON-003**    | Verify Food dynamic fields                     | `donation.dynamic-fields.spec.ts`      | Data-Driven/UI             | Passed | Yes      |
| **DON-004**    | Verify Medicine dynamic fields                 | `donation.dynamic-fields.spec.ts`      | Data-Driven/UI             | Passed | Yes      |
| **DON-005**    | Verify Clothes dynamic fields                  | `donation.dynamic-fields.spec.ts`      | Data-Driven/UI             | Passed | Yes      |
| **DON-006**    | Verify Vehicle dynamic fields                  | `donation.dynamic-fields.spec.ts`      | Data-Driven/UI             | Passed | Yes      |
| **DON-007**    | Verify Other dynamic fields                    | `donation.dynamic-fields.spec.ts`      | Data-Driven/UI             | Passed | Yes      |
| **DON-008**    | Verify empty quantity validation               | `donation.validation.spec.ts`          | Negative                   | Passed | Yes      |
| **DON-009**    | Verify empty location validation               | `donation.validation.spec.ts`          | Negative                   | Passed | Yes      |
| **DON-010**    | Verify manual location entry                   | `donation.location.spec.ts`            | Functional                 | Passed | Yes      |
| **DON-011**    | Verify current location using geolocation mock | `donation.location.spec.ts`            | UI/Reliability             | Passed | No       |
| **DON-012**    | Verify collection preference                   | `donation.preferences-contact.spec.ts` | Functional                 | Passed | No       |
| **DON-013**    | Verify optional contact details                | `donation.preferences-contact.spec.ts` | Functional                 | Passed | No       |
| **DON-014**    | Verify successful Food donation                | `donation.submit.spec.ts`              | E2E                        | Passed | Yes      |
| **DON-015**    | Verify API payload                             | `donation.submit.spec.ts`              | API-through-UI             | Passed | Yes      |
| **DON-016**    | Verify offline donation handling               | `donation.offline.spec.ts`             | Reliability/Error Handling | Passed | No       |
| **DON-017**    | Verify success confirmation summary            | `donation.submit.spec.ts`              | Functional                 | Passed | Yes      |
| **DON-018**    | Verify Donate Another Resource reset           | `donation.reset.spec.ts`               | Regression                 | Passed | Yes      |
| **DON-019**    | Verify dashboard navigation                    | `donation.navigation.spec.ts`          | Navigation                 | Passed | No       |
| **DON-OPT-01** | Verify application handles API failure         | `donation.api-failure.spec.ts`         | Negative/Error Handling    | Passed | No       |

---

## 9. Testing Types Used

| Testing Type                | Status                        | Evidence                                                      | Explanation                                            |
| --------------------------- | ----------------------------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| Smoke Testing               | Implemented                   | `donation.smoke.spec.ts`                                      | Verifies the donation page loads correctly             |
| Functional Testing          | Implemented                   | Multiple `.spec.ts` files                                     | Verifies donation form behavior against requirements   |
| UI Testing                  | Implemented                   | `donation.dynamic-fields.spec.ts`                             | Verifies visible UI changes for resource types         |
| Regression Testing          | Implemented as reusable suite | Full test suite                                               | Can be rerun after future changes                      |
| Negative Testing            | Implemented                   | `donation.validation.spec.ts`, `donation.api-failure.spec.ts` | Tests missing fields and API failure                   |
| Data-Driven Testing         | Implemented                   | `donation-test-data.json`                                     | Tests multiple resource categories using external data |
| API-through-UI Testing      | Implemented                   | `donation.submit.spec.ts`                                     | Verifies the UI generates the correct API payload      |
| Mock Testing / Interception | Implemented                   | `donationApiMock.ts`                                          | Uses Playwright route mocking                          |
| Error Handling Testing      | Implemented                   | `donation.api-failure.spec.ts`, `donation.offline.spec.ts`    | Verifies graceful failure behavior                     |
| Cross-Browser Testing       | Configured                    | `playwright.config.ts`                                        | Chromium, Firefox, and WebKit are configured           |
| Reliability Support         | Configured                    | `playwright.config.ts`                                        | Uses retries, traces, screenshots, and videos          |

---

## 10. Test Design Techniques

### Equivalence Partitioning

Resource types are treated as valid equivalence partitions:

* Food
* Medicine
* Clothes
* Vehicle
* Other

Each partition is tested through the data-driven dynamic field tests: `DON-003` to `DON-007`.

### Boundary Value Analysis

BVA is applied around confirmed required-field boundaries:

* **Quantity**

  * Empty quantity = invalid boundary
  * Minimum non-empty quantity = valid boundary

* **Location**

  * Empty location = invalid boundary
  * Minimum non-empty location = valid boundary

No unsupported maximum character boundaries are claimed because the requirements do not define maximum lengths.

### Decision Table Testing

Decision table logic is applied to validation and submission behavior:

| Quantity Provided? | Location Provided? | Expected Result                |
| ------------------ | ------------------ | ------------------------------ |
| No                 | Yes                | Quantity validation alert      |
| Yes                | No                 | Location validation alert      |
| Yes                | Yes                | Form can proceed to submission |
| Yes                | Yes + API failure  | Error alert                    |
| Yes                | Yes + Offline      | Offline saved behavior         |

---

## 11. Requirement Traceability Summary

| FRS/BRD Requirement                       | Validated By Test Case IDs                  |
| ----------------------------------------- | ------------------------------------------- |
| Page load and resource selection          | DON-001, DON-002                            |
| Dynamic form fields                       | DON-003, DON-004, DON-005, DON-006, DON-007 |
| Quantity and location validation          | DON-008, DON-009                            |
| Manual and current location behavior      | DON-010, DON-011                            |
| Collection preference and contact details | DON-012, DON-013                            |
| Online submission and API payload         | DON-014, DON-015                            |
| Offline mode handling                     | DON-016                                     |
| Success confirmation                      | DON-017                                     |
| Reset flow                                | DON-018                                     |
| Dashboard navigation                      | DON-019                                     |
| API failure handling                      | DON-OPT-01                                  |

---

## 12. Environment Setup

Run these commands from:

```text
tests/playwright/
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

A safe `.env.example` file is provided. Create your own local `.env` file if required.

Do not commit:

```text
.env
node_modules/
playwright-report/
test-results/
```

---

## 13. How to Run Tests

Run these commands from:

```text
tests/playwright/
```

### List all configured tests

```bash
npx playwright test --list
```

### Run all donation tests

```bash
npx playwright test donations/tests --project=chromium
```

### Run the stable demo suite

```bash
npx playwright test donations/tests --grep "@demo" --project=chromium --headed
```

### Run the slow-motion demo suite

```bash
npx playwright test donations/tests --grep "@demo" --project=demo-chromium --headed
```

### Open the Playwright HTML report

```bash
npx playwright show-report
```

---

## 14. Demo Strategy

The `@demo` tests are stable, deterministic, and suitable for the 2-minute viva demonstration.

The full suite contains all 20 tests, but the live demo focuses on the stable 14-test subset. Tests such as geolocation, offline handling, collection/contact deep checks, and dashboard navigation are included in the full suite but are not tagged as `@demo` because they are more environment-dependent than the core UI flow.

The API is mocked during submission-related tests, so the tests do not create fake donation records in the production backend.

---

## 15. Test Execution Results

The full donation suite was executed from the migrated root-level Playwright folder:

```bash
D:\RESILIO NEW PROJECT\Resilio\tests\playwright>npx playwright test donations/tests --project=chromium
```

Result:

```text
Running 20 tests using 4 workers
20 passed (40.1s)
```

This confirms that the migration to `tests/playwright/donations` was successful and all donation tests are executable from the new shared Playwright structure.

---

## 16. Evidence and Reporting

Playwright generates:

* Interactive HTML report
* Screenshots on failure
* Traces on first retry
* Videos retained on failure

Open the report using:

```bash
npx playwright show-report
```

---

## 17. Group Structure Compatibility

The shared structure is designed to support multiple group members’ Playwright modules.

Example:

```text
tests/playwright/
├── donations/
│   └── tests/
└── request-help/
    └── tests/
```

The shared Playwright config supports both:

```text
**/tests/**/*.spec.ts
**/tests/**/*.spec.js
```

This means the Donation module can use TypeScript tests, while another group member’s Request Help module can use JavaScript tests.



