# SQL Folder Instructions

This folder contains SQL scripts for setting up and populating the currency management database.

## File Explanations

### 1. **create_currencies_table.sql**
- **Purpose:**  
  Creates the `currencies` table.
- **Table Description:**  
  Stores information about each currency, including ISO code, name, symbol, country, flag URL, and status (active/inactive).
- **Key Columns:**  
  - `iso_code`: The official ISO 4217 currency code (e.g., USD, EUR).
  - `name`: Full name of the currency.
  - `symbol`: Currency symbol (e.g., $, €, ¥).
  - `country`: Associated country or region.
  - `flag_url`: Link to the country or region flag.
  - `is_active`: Indicates if the currency is active.
- **Notes:**  
  This table is the foundation for all currency data in the system.

---

### 2. **create_currency_rates_table.sql**
- **Purpose:**  
  Creates the `currency_rates` table.
- **Table Description:**  
  Stores the exchange rate of each currency relative to USD.
- **Key Columns:**  
  - `iso_code`: Foreign key referencing the `currencies` table.
  - `rate_to_usd`: The exchange rate (how much 1 unit of the currency is in USD).
  - `last_updated`: Timestamp of the last update.
- **Notes:**  
  This table depends on the `currencies` table via a foreign key on `iso_code`.

---

### 3. **insert_initial_currencies.sql**
- **Purpose:**  
  Inserts a set of initial currencies into the `currencies` table.
- **Description:**  
  Populates the database with major world currencies, their symbols, countries, and flag URLs.

---

### 4. **insert_initial_currency_rates.sql**
- **Purpose:**  
  Inserts initial exchange rates into the `currency_rates` table.
- **Description:**  
  Provides starting exchange rates for the currencies listed in the `currencies` table.

---

## Table Relationships

- The `currency_rates` table references the `currencies` table via the `iso_code` column (foreign key).
- You must create and populate the `currencies` table before inserting data into `currency_rates`.

---

**Looks good to me, but I hate working on weekend!**