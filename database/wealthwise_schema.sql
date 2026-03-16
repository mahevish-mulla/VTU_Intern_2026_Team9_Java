-- ============================================================
--  WealthWise — MySQL Database Schema
--  Project: Mutual Fund & SIP Tracking Platform
--  Tech Stack: Java Spring Boot + MySQL + React
-- ============================================================

CREATE DATABASE IF NOT EXISTS wealthwise;
USE wealthwise;

-- ============================================================
-- TABLE 1: users
-- ============================================================
CREATE TABLE users (
    user_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) UNIQUE,
    phone       VARCHAR(15)  UNIQUE,
    password    VARCHAR(255),
    role        ENUM('ADMIN', 'INVESTOR') NOT NULL DEFAULT 'INVESTOR',
    status      ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    admin_key   VARCHAR(100) UNIQUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Admin once (do not register via frontend)
INSERT INTO users (name, role, admin_key)
VALUES ('Admin', 'ADMIN', 'ADMIN@2026');


-- ============================================================
-- TABLE 2: amc
-- ============================================================
CREATE TABLE amc (
    amc_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    amc_name    VARCHAR(150) NOT NULL UNIQUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- TABLE 3: mutual_funds
-- ============================================================
CREATE TABLE mutual_funds (
    fund_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    fund_name     VARCHAR(200) NOT NULL UNIQUE,
    category      ENUM('EQUITY', 'DEBT', 'HYBRID') NOT NULL,
    risk_level    ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
    current_nav   DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    scheme_code   INT UNIQUE,
    amc_id        BIGINT NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_fund_amc
        FOREIGN KEY (amc_id)
        REFERENCES amc(amc_id)
        ON DELETE RESTRICT
);


-- ============================================================
-- TABLE 4: nav_history
-- ============================================================
CREATE TABLE nav_history (
    nav_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    fund_id     BIGINT NOT NULL,
    nav_price   DECIMAL(10,4) NOT NULL,
    nav_date    DATE NOT NULL,

    CONSTRAINT fk_nav_fund
        FOREIGN KEY (fund_id)
        REFERENCES mutual_funds(fund_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_fund_nav_date
        UNIQUE (fund_id, nav_date)
);


-- ============================================================
-- TABLE 5: investments
-- ============================================================
CREATE TABLE investments (
    investment_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT NOT NULL,
    fund_id             BIGINT NOT NULL,
    investment_type     ENUM('SIP', 'LUMPSUM') NOT NULL,
    amount              DECIMAL(12,2) NOT NULL,
    nav_at_investment   DECIMAL(10,4) NOT NULL,
    units_purchased     DECIMAL(12,4) NOT NULL,
    investment_date     DATE NOT NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inv_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_inv_fund
        FOREIGN KEY (fund_id)
        REFERENCES mutual_funds(fund_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_inv_amount
        CHECK (amount > 0),

    CONSTRAINT chk_inv_units
        CHECK (units_purchased > 0)
);


-- ============================================================
-- TABLE 6: sips
-- ============================================================
CREATE TABLE sips (
    sip_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    fund_id         BIGINT NOT NULL,
    amount          DECIMAL(12,2) NOT NULL,
    frequency       ENUM('MONTHLY', 'QUARTERLY') NOT NULL DEFAULT 'MONTHLY',
    start_date      DATE NOT NULL,
    next_due_date   DATE NOT NULL,
    end_date        DATE,
    status          ENUM('ACTIVE', 'PAUSED', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sip_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_sip_fund
        FOREIGN KEY (fund_id)
        REFERENCES mutual_funds(fund_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_sip_amount
        CHECK (amount > 0),

    CONSTRAINT chk_sip_dates
        CHECK (end_date IS NULL OR end_date > start_date)
);


-- ============================================================
-- TABLE 7: sip_transactions
-- ============================================================
CREATE TABLE sip_transactions (
    txn_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    sip_id      BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,
    fund_id     BIGINT NOT NULL,
    amount      DECIMAL(12,2) NOT NULL,
    due_date    DATE NOT NULL,
    paid_date   DATE,
    status      ENUM('PAID', 'MISSED', 'PENDING') NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_txn_sip
        FOREIGN KEY (sip_id)
        REFERENCES sips(sip_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_txn_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_txn_fund
        FOREIGN KEY (fund_id)
        REFERENCES mutual_funds(fund_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_txn_amount
        CHECK (amount > 0)
);


-- ============================================================
-- TABLE 8: portfolio
-- ============================================================
CREATE TABLE portfolio (
    portfolio_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    fund_id         BIGINT NOT NULL,
    total_units     DECIMAL(14,4) NOT NULL DEFAULT 0.0000,
    total_invested  DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_port_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_port_fund
        FOREIGN KEY (fund_id)
        REFERENCES mutual_funds(fund_id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_user_fund
        UNIQUE (user_id, fund_id)
);


-- ============================================================
-- TABLE 9: alerts
-- ============================================================
CREATE TABLE alerts (
    alert_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    sent_by     BIGINT NOT NULL,
    sent_to     BIGINT NOT NULL,
    alert_type  ENUM('SIP_DUE', 'MISSED_SIP', 'SIP_COMPLETION', 'GENERAL') NOT NULL,
    message     TEXT NOT NULL,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alert_sender
        FOREIGN KEY (sent_by)
        REFERENCES users(user_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_alert_receiver
        FOREIGN KEY (sent_to)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- ============================================================
-- SAMPLE DATA (for testing)
-- ============================================================

-- AMCs
INSERT INTO amc (amc_name) VALUES
('SBI Mutual Fund'),
('HDFC Mutual Fund'),
('ICICI Prudential'),
('Axis Mutual Fund'),
('Kotak Mahindra MF');

-- Mutual Funds
INSERT INTO mutual_funds (fund_name, category, risk_level, current_nav, scheme_code, amc_id) VALUES
('SBI Bluechip Fund',               'EQUITY', 'LOW',    78.45,  119551, 1),
('HDFC Mid-Cap Opportunities',      'EQUITY', 'MEDIUM', 124.30, 119205, 2),
('ICICI Prudential Technology Fund','EQUITY', 'HIGH',   195.60, 120586, 3),
('Axis Long Term Equity',           'EQUITY', 'MEDIUM', 65.20,  120503, 4),
('Kotak Small Cap Fund',            'EQUITY', 'HIGH',   210.80, 120255, 5),
('SBI Liquid Fund',                 'DEBT',   'LOW',    32.10,  119597, 1),
('HDFC Corporate Bond Fund',        'DEBT',   'LOW',    28.50,  118989, 2),
('Axis Balanced Advantage Fund',    'HYBRID', 'MEDIUM', 18.90,  120504, 4);

-- ============================================================
-- END OF SCHEMA
-- ============================================================