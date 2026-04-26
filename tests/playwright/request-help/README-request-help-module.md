# Playwright E2E Testing – Request Help Feature

## Branch
ase/tests/playwright/IT23596870

---

## Overview
This module implements End-to-End (E2E) testing for the **Request Help** feature of the Resilio web application using Playwright.

The objective is to simulate real user behavior and validate that the system correctly handles form submission, validation, and UI interactions.

---

## Testing Tool
- **Playwright**
- Category: E2E / UI Testing

---

## Tested Application
https://witty-bay-072ec5b00.7.azurestaticapps.net

---

## Feature Covered
**Request Help Form**

This feature allows disaster victims to submit requests by providing:
- Full Name
- Contact information (Email / Phone)
- Location
- Type of help required
- Optional note
- Urgency status

---

## Test Scenarios Implemented

### 1. Page Load Verification
- Navigates from homepage to request-help page
- Verifies all essential form fields are visible

---

### 2. Valid Request Submission
- Submits form with valid input data
- Includes urgent toggle interaction
- Handles verification code (stubbed as `123456`)

---

### 3. Required Field Validation
- Attempts to submit empty form
- Confirms that submission is blocked

---

### 4. Invalid Input Handling
- Uses incorrect contact format
- Ensures system does not accept invalid data

---

### 5. UI Interaction Testing
- Toggles “Mark as urgent” option
- Verifies that user interaction works correctly

---

### 6. Optional Field Handling
- Submits form without optional note
- Confirms system accepts partial input

---

### 7. Data-Driven Testing
- Tests multiple help types dynamically:
  - Food
  - Medicine
  - Shelter
  - Rescue

---

## Testing Approach

### Page Object Model (POM)
- Separates UI logic from test logic
- Improves maintainability and readability

---

### Data-Driven Testing
- Test data stored in JSON file:


---

### Dynamic Dropdown Handling
- Custom logic implemented to select help types dynamically
- Handles variations in value and label matching

---

## Setup & Execution

### Install dependencies and run tests
```bash
npm install
npx playwright install
npx playwright test --project=demo-chromium
```
### View HTML report
```bash
npx playwright show-report
```
