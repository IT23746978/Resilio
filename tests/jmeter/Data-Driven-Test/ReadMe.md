# JMeter Data-Driven Testing – Disaster Management System

## Overview

This project demonstrates **Data-Driven Testing** using Apache JMeter on a Disaster Management System API.

The test sends multiple requests to the backend using different input data from a CSV file to validate system behavior under varied conditions.

---

## Tools & Category

* Tool: Apache JMeter
* Category: Load / Performance Testing
* Technique: Data-Driven Testing

---

## Objective

* Validate API behavior with multiple input data
* Automate repeated requests using CSV
* Check system stability under multiple users

---

## Project Structure

```
/testing/jmeter/
│── disaster-test.jmx   # JMeter test plan
│── data.csv            # Input dataset
│── results.jtl         # (optional) test results
```

---

## How to Run the Test

1. Open Apache JMeter
2. Click **File → Open**
3. Select `disaster-test.jmx`
4. Ensure CSV file path is correct
5. Click **Start (▶)**

---

## Test Configuration

* Method: POST
* Endpoint: `/api/Requests`
* Protocol: HTTPS
* Data Source: CSV file
* Users: Multiple threads (simulated users)

---

## Test Data (CSV)

The CSV file contains:

* FullName
* Contact
* Location
* HelpType (Food, Medicine, Shelter, Rescue)

Each row represents a unique request.

---

## What was tested

* API request handling with different inputs
* Backend validation using real-like data
* System response under multiple users

---

## Issues Encountered & Fixes

* **415 Unsupported Media Type**
  → Fixed by adding `Content-Type: application/json`

* **500 Internal Server Error**
  → Caused by invalid/empty input data

---

## Results

* Requests successfully sent using CSV data
* System handled multiple users
* Valid responses received (200/201)

---

## Conclusion

Data-driven testing using JMeter helped automate API testing with varied inputs and validate system performance efficiently.

---

## Contribution

* Implemented CSV-based data-driven testing
* Configured JMeter test plan
* Executed and analyzed results
