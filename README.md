# WealthWise – Mutual Fund & SIP Tracking Platform

**WealthWise** is a comprehensive financial management platform designed to help users simulate mutual fund investments and track Systematic Investment Plans (SIPs). The platform provides a structured way to browse funds by Asset Management Companies (AMCs), manage goal-based portfolios, and monitor historical performance through NAV (Net Asset Value) tracking.

## 🚀 Project Objective

The goal of **WealthWise** is to provide a risk-free environment for users to learn and simulate wealth-building strategies using real-world mutual fund structures and automated SIP logic.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Hooks, Axios, React Router)
* **Backend:** Java (Spring Boot, Spring Security, Hibernate/JPA)
* **Database:** MySQL (WorkBench)
* **API Testing:** Postman
* **Version Control:** Git & GitHub

---

## 📌 Key Features

* **Role-Based Access (RBAC):
* **Admin:** Manage AMC Master Data, list new Mutual Funds, and update daily NAV prices.
* **User:** Create portfolios, set up SIPs, and track investment growth.


* **AMC & Fund Discovery:** Browse mutual funds categorized by AMC (e.g., SBI, HDFC).
* **Portfolio Management:** Create multiple "Virtual Folders" for different financial goals (e.g., Retirement, Education).
* **Automated SIP Engine:** Simulated recurring investments based on defined frequencies.
* **Historical NAV Tracking:** Track price movements of funds over time.
* **Transaction Logging:** Complete audit trail of all "Buy" and "SIP" activities.

---

## 📂 Database Architecture

The database is designed using 3NF (Third Normal Form) to ensure data integrity and zero redundancy.

### Core Entities

1. **Users:** Stores investor profiles and authentication roles.
2. **Admins:** Specialized accounts for platform data management.
3. **AMC (Asset Management Companies):** The master list of fund houses.
4. **Mutual Funds:** Detailed fund schemes linked to specific AMCs.
5. **NAV History:** A weak entity tracking the daily price of each fund.
6. **Portfolios:** User-defined folders to group specific investments.
7. **SIP Plans:** Recurring investment instructions (Amount, Date, Frequency).
8. **Investment Logs:** The "Meeting Point" for Portfolios and Funds (Transaction history).

---

## 🔐 Authentication & Security Module

* **JWT-Based Auth:** Secure session management for React-Spring Boot communication.
* **Role-Based Security:** Spring Security filters to ensure only Admins can modify Master Data (AMC/Funds).
* **Password Encryption:** BCrypt hashing for user credentials.
* **API Validation:** Postman-tested endpoints for Signup, Login, and Portfolio creation.

---

## 📊 Development Plan (Sprint 1)

**Duration:** March 9 – March 13

| Task | Description |
| --- | --- |
| **ER Mapping** | Applying the 7 Mapping Algorithms to the WealthWise entities. |
| **Database DDL** | Creating tables in MySQL with PK/FK constraints. |
| **Admin Module** | Implementing APIs to add AMCs and Mutual Funds. |
| **Auth Setup** | Implementing Spring Security and JWT Login logic. |
| **Portfolio Logic** | Enabling users to create and name their virtual portfolios. |
| **API Testing** | Comprehensive validation of all Sprint 1 endpoints via Postman. |

---

## 👥 Team Responsibilities

### **Backend Database Team**

* Designing ER Diagrams and Logical Mapping.
* Implementing DDL scripts and Foreign Key constraints.
* Managing NAV History weak entity relationships.

### **Backend Authentication Team**

* Implementing User/Admin registration and Login.
* Configuring Role-Based Access Control (RBAC).
* Developing JWT filter logic for secure API calls.

### **Coordination Team**

* Managing the Sprint backlog and daily progress.
* Ensuring smooth integration between MySQL and Spring Boot Entities.
* Reviewing documentation and Postman test results.

---

## 📈 Future Enhancements

* **Real-time API Integration:** Fetching actual market NAVs via financial APIs.
* **Advanced Analytics:** Visualizing portfolio growth with charts and graphs.
* **Redemption Logic:** Enabling users to "sell" units and track realized gains.
* **Tax Simulation:** Estimating Capital Gains Tax (LTCG/STCG) on simulated returns.

---

## 📌 Project Status

**Current Phase:** Active Development 

---
