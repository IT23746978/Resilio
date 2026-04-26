# Resilio Performance & Load Testing (JMeter)

This directory contains the Apache JMeter configurations and documentation for the performance testing conducted on the **Resilio** application.

## Testing Overview

**Target Feature:** Relief Request Submission
**Endpoint Tested:** `POST /api/requests`
**Target Infrastructure:** Azure App Service (F1 Free Tier) & Azure SQL Database (Basic)
**Testing Methodology:** Breakpoint Testing (incrementally scaling traffic until the server produces consistent failures).

The objective of these tests was to simulate high-traffic disaster scenarios to determine the absolute physical limits of the free-tier cloud infrastructure.

---

## 1. Spike Testing Results
**Goal:** Evaluate system behavior under sudden, extreme bursts of traffic (simulating a sudden natural disaster occurring).
**Configuration:** Synchronizing Timer used to hold threads and release them simultaneously with a 1 to 2-second ramp-up.

| Simulated Users | Ramp-Up | Error Rate | Observation |
| :---: | :---: | :---: | :--- |
| **100** | 1s | **0.00%** | Handled successfully. |
| **250** | 1s | **0.00%** | Handled successfully. The App Service successfully queued the sudden burst. |
| **500** | 2s | **20.80%** | **Glass Ceiling Reached.** The queue overflowed, causing the server to reject ~100 requests. |

---

## 2. Stress Testing Results
**Goal:** Evaluate system stability under a sustained, gradually increasing high load over a period of time.
**Configuration:** Threads looping infinitely throughout the set duration.

| Simulated Users | Ramp-Up | Duration | Error Rate | Observation |
| :---: | :---: | :---: | :---: | :--- |
| **25** | 30s | 90s | **0.00%** | Maintained steady processing, executing ~20+ insertions per second. |
| **125** | ~60s | ~120s | **100% (Crash)** | **Absolute Limit Reached.** The Azure SQL Database connection pool completely exhausted. Wait times exceeded limits, resulting in hard `500 Internal Server Errors`. |

---

## Conclusion

The JMeter Breakpoint Testing successfully mapped the limits of the Resilio API architecture. 

**Key Takeaways:**
1. The Azure F1 Free Tier is surprisingly resilient for minor bursts, handling up to 250 instantaneous requests without data loss.
2. Under heavy sustained load, the bottleneck is entirely dependent on the Database Connection Pool limitations imposed by the free tier.
