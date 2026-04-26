# Playwright E2E Testing — Resilio Resource Donation Module

## 1. Project Overview
This project contains the automated End-to-End (E2E) and UI testing suite for the Resilio **Resource Donation module**. The suite is built to strictly follow Software Testing Life Cycle (STLC) phases and serves as the practical implementation for the SE3112 Advanced Software Engineering testing assignment. The automation framework is developed using **Playwright with TypeScript**.

## 2. Module Under Test
*   **Module:** Resource Donation
*   **Frontend Component:** `src/pages/Donation/ResourceDonation.jsx`
*   **Routing Approach:** Tests navigate to the root `/` and click the "Donate Now" button to bypass static hosting client-side 404 routing limits.
*   **Backend Interception:** The live API endpoint `/api/Donations` is successfully mocked to prevent fake test data from polluting the production database.

## 3. Testing Objectives
The primary objectives of this test suite are to validate:
*   Page load and visibility of core elements.
*   Default selection of the 'Food' resource type.
*   Dynamic field toggling for Food, Medicine, Clothes, Vehicle, and Other categories.
*   Quantity and location required field validation rules.
*   Manual entry and current geolocation behavior.
*   Collection preferences and optional contact fields.
*   Successful donation form submission workflows.
*   Accurate API JSON payload generation.
*   Graceful handling of offline mode.
*   Accurate success confirmation summary rendering.
*   "Donate Another Resource" reset flow.
*   Dashboard navigation boundaries.
*   API failure (500 Error) handling gracefully.

## 4. Tools and Technologies
*   **Testing Tool:** Playwright
*   **Language:** TypeScript
*   **Runtime:** Node.js / npm
*   **Cross-Browser Support:** Chromium, Firefox, WebKit
*   **Reporting:** Playwright HTML Report
*   **Debugging Artifacts:** Screenshots (on failure), Traces (on first retry), Videos (retain on failure)
*   **Data Management:** JSON test data files
*   **Design Pattern:** Page Object Model (POM)

## 5. Framework Architecture
The framework is designed for maximum reusability, reliability, and speed:
*   **Modular Framework:** Tests are categorized logically by functionality (e.g., location, submit, dynamic fields).
*   **Page Object Model (POM):** UI locators and actions are encapsulated in a centralized class (`ResourceDonationPage.ts`).
*   **Data-Driven Testing (DDT):** Test cases loop through external JSON files to test multiple partitions efficiently.
*   **API Mocking / Network Interception:** Backend boundaries are intercepted (`page.route`) to guarantee test stability and isolate the frontend.
*   **Strong Assertions:** Strict Playwright locators (`getByRole`, `getByText`) ensure the UI represents exact state.
*   **Separation of Concerns:** Stable, live-demo-safe tests are tagged with `@demo`, while environment-dependent edge cases run in the extended suite.

## 6. Folder Structure
```text
frontend/
├── playwright.config.ts
├── pages/
│   └── ResourceDonationPage.ts
├── data/
│   └── donation-test-data.json
├── utils/
│   └── donationApiMock.ts
├── tests/
│   └── donation/
│       ├── donation.api-failure.spec.ts
│       ├── donation.dynamic-fields.spec.ts
│       ├── donation.location.spec.ts
│       ├── donation.navigation.spec.ts
│       ├── donation.offline.spec.ts
│       ├── donation.preferences-contact.spec.ts
│       ├── donation.reset.spec.ts
│       ├── donation.smoke.spec.ts
│       ├── donation.submit.spec.ts
│       └── donation.validation.spec.ts
├── docs/
│   └── playwright-implementation-audit.md
├── .env.example
└── .gitignore
```

## 7. File-by-File Explanation

*   **`playwright.config.ts`**: (Active) Configures Playwright workers, retries, reporting, browsers, and environment variables.
*   **`pages/ResourceDonationPage.ts`**: (Active) Page Object Model containing reusable DOM locators and interactions. Imported by all test scripts.
*   **`data/donation-test-data.json`**: (Active) JSON array providing partition inputs for Data-Driven Testing.
*   **`utils/donationApiMock.ts`**: (Active) Network interception utility used by submit/reset tests to mock API success.
*   **`tests/donation/*.spec.ts`**: (Active) The actual test suites implementing the DON-001 to DON-019 test cases.
*   **`docs/test-design-notes.md`**: (Documentation) Markdown file detailing the formal test specs, BVA, EP, and Decision Tables.
*   **`docs/playwright-implementation-audit.md`**: (Documentation) Comprehensive audit report tracking requirement coverage.
*   **`.env.example`**: (Documentation) Template illustrating required environment variables like `BASE_URL`.
*   **`.gitignore`**: (Active Config) Ensures the actual `.env` containing sensitive URIs is not committed.

## 8. Test Cases Implemented

| Test ID | Test Case Title | File | Type | Status | `@demo`? |
|---|---|---|---|---|---|
| **DON-001** | Verify donation page loads correctly | `donation.smoke.spec.ts` | Smoke | Passed | Yes |
| **DON-002** | Verify default Food type is selected | `donation.smoke.spec.ts` | UI | Passed | Yes |
| **DON-003** | Verify Food dynamic fields | `donation.dynamic-fields.spec.ts` | DDT | Passed | Yes |
| **DON-004** | Verify Medicine dynamic fields | `donation.dynamic-fields.spec.ts` | DDT | Passed | Yes |
| **DON-005** | Verify Clothes dynamic fields | `donation.dynamic-fields.spec.ts` | DDT | Passed | Yes |
| **DON-006** | Verify Vehicle dynamic fields | `donation.dynamic-fields.spec.ts` | DDT | Passed | Yes |
| **DON-007** | Verify Other dynamic fields | `donation.dynamic-fields.spec.ts` | DDT | Passed | Yes |
| **DON-008** | Verify empty quantity validation | `donation.validation.spec.ts` | Negative | Passed | Yes |
| **DON-009** | Verify empty location validation | `donation.validation.spec.ts` | Negative | Passed | Yes |
| **DON-010** | Verify manual location entry | `donation.location.spec.ts` | Functional | Passed | Yes |
| **DON-011** | Verify current location via geolocation mock | `donation.location.spec.ts` | Functional | Passed | No |
| **DON-012** | Verify collection preference | `donation.preferences-contact.spec.ts` | Functional | Passed | No |
| **DON-013** | Verify optional contact details | `donation.preferences-contact.spec.ts` | Functional | Passed | No |
| **DON-014** | Verify successful Food donation | `donation.submit.spec.ts` | E2E | Passed | Yes |
| **DON-015** | Verify API payload | `donation.submit.spec.ts` | API-UI | Passed | Yes |
| **DON-016** | Verify offline donation handling | `donation.offline.spec.ts` | Error Handling | Passed | No |
| **DON-017** | Verify success confirmation summary | `donation.submit.spec.ts` | Functional | Passed | Yes |
| **DON-018** | Verify Donate Another Resource reset | `donation.reset.spec.ts` | Functional | Passed | Yes |
| **DON-019** | Verify dashboard navigation | `donation.navigation.spec.ts` | Functional | Passed | No |
| **DON-OPT-01** | Verify application handles API failure | `donation.api-failure.spec.ts` | Negative | Passed | No |

## 9. Testing Types Used

| Testing Type | Status | Evidence | Explanation |
|---|---|---|---|
| **Smoke Testing** | Implemented | `donation.smoke.spec.ts` | Quick validation of critical path UI rendering. |
| **Functional Testing** | Implemented | `donation.location.spec.ts`, `donation.reset.spec.ts` | Validates business requirements and inputs. |
| **UI Testing** | Implemented | `donation.dynamic-fields.spec.ts` | Verifies dynamic visual rendering based on state. |
| **Regression Testing** | Configured | Playwright execution | The whole automated suite protects against future regressions. |
| **Negative Testing** | Implemented | `donation.validation.spec.ts`, `donation.api-failure.spec.ts` | Forces invalid blank inputs and 500 server errors. |
| **Data-Driven Testing** | Implemented | `donation.dynamic-fields.spec.ts`, `donation-test-data.json` | JSON mapping loops 5 separate iterations for resource types. |
| **API-through-UI Testing** | Implemented | `donation.submit.spec.ts` | Validates the UI accurately translates data to backend format. |
| **Mock Testing / Interception** | Implemented | `utils/donationApiMock.ts` | Bypasses live databases using `page.route` fulfillment. |
| **Error Handling Testing** | Implemented | `donation.api-failure.spec.ts`, `donation.offline.spec.ts` | Asserts the UI safely alerts users upon system failures. |
| **Cross-Browser Testing** | Configured | `playwright.config.ts` | Configuration projects run across Chromium, Firefox, and WebKit. |
| **Reliability Support** | Configured | `playwright.config.ts` | Auto-retries, automatic UI tracing, and video capture on failure. |

## 10. Test Design Techniques

*   **Equivalence Partitioning (EP):** 
    Applied heavily to the Resource Type categories. "Food, Medicine, Clothes, Vehicle, Other" represent unique equivalence partitions. Each partition is tested via Data-Driven loops (`DON-003` to `DON-007`).
*   **Boundary Value Analysis (BVA):** 
    BVA is applied explicitly around required-field boundaries.
    *   **Quantity:** Empty quantity = Invalid boundary. Minimum non-empty quantity (e.g., "1") = Valid boundary.
    *   **Location:** Empty location = Invalid boundary. Minimum non-empty location (e.g., "A") = Valid boundary.
*   **Decision Table Testing:** 
    Applied conceptually to form validation (`DON-008`, `DON-009`). If Quantity = Yes & Location = No, trigger Location Error. If Quantity = No & Location = Yes, trigger Quantity Error.

## 11. Requirement Traceability Summary

| FRS/BRD Requirement | Validated By Test Case IDs |
|---|---|
| Page load & Resource Selection | DON-001, DON-002 |
| Dynamic form fields | DON-003, DON-004, DON-005, DON-006, DON-007 |
| Quantity and Location validation | DON-008, DON-009 |
| Manual / Current location behavior | DON-010, DON-011 |
| Collection & Contact details | DON-012, DON-013 |
| Online submission & Payload | DON-014, DON-015 |
| Offline mode handling | DON-016 |
| Success Confirmation | DON-017 |
| Reset Flow | DON-018 |
| Dashboard Navigation | DON-019 |

## 12. Environment Setup

To initialize the testing environment:
```bash
npm install
npm install -D @playwright/test
npx playwright install
```
*Note: A `.env.example` file is provided. Create your own `.env` file locally with `BASE_URL`. Do not commit the `.env` file.*

## 13. How to Run Tests

**List all configured tests:**
```bash
npx playwright test --list
```

**Run all 20 donation tests (Full Suite):**
```bash
npx playwright test tests/donation --project=chromium
```

**Run the stable Demo Suite (14 Tests):**
```bash
npx playwright test --grep "@demo" --project=chromium --headed
```

**Open the Playwright HTML Report:**
```bash
npx playwright show-report
```

## 14. Demo Strategy
*   The tests tagged with `@demo` are completely stable, deterministic, and highly suitable for the **2-minute viva**.
*   Tests involving Geolocation, Offline mode, and Dashboard routing are included in the full suite (DON-011, DON-016, DON-019) but intentionally kept off `@demo` because they are highly environment-dependent and prone to flaky permission popups.
*   Live production data is fully protected because the `utils/donationApiMock.ts` strictly mocks the API response.

## 15. Test Execution Results
*   **Full Suite Execution:** All 20 tests passed successfully (`DON-001` to `DON-019` + `DON-OPT-01`).
*   **Demo Suite Execution:** The 14 highly stable `@demo` tests successfully passed executing in approximately ~25 seconds.

## 16. Evidence and Reporting
When tests execute, Playwright strictly generates:
*   An interactive **HTML Report**.
*   **Screenshots** immediately attached upon failure.
*   Full DOM snapshots and network **Traces** on the first retry.
*   **Video recordings** retained specifically upon failure.

## 17. Viva Explanation
> *"I automated all 19 planned Resource Donation test cases using Playwright with TypeScript. The suite leverages a modular Page Object Model, Data-Driven Testing for equivalence partitions, and intercepts the backend API to guarantee stable, production-safe test executions."*

## 18. Important Notes
*   `.env` is explicitly ignored via `.gitignore` to prevent secret leakage.
*   The API is mocked for all form submission test cases.
*   Cross-browser logic is fully configured, but Chromium is utilized as the baseline execution engine for optimal live demo speed and stability.
*   Do not attempt to run risky environment-dependent tests (Offline/Geolocation) blindly during a fast-paced presentation demo.
