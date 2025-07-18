# SQL Folder Instructions

This folder contains SQL scripts for setting up and populating the currency management database.

## Recommended Execution Order

1. **create_currencies_table.sql**  
   Creates the `currencies` table.  
   _Must be run first, as other tables depend on it._

2. **create_currency_rates_table.sql**  
   Creates the `currency_rates` table, which references `currencies` via a foreign key.

3. **insert_initial_currencies.sql**  
   Inserts initial currency records into the `currencies` table.

4. **insert_initial_currency_rates.sql**  
   Inserts initial exchange rates into the `currency_rates` table.  
   _Requires that the corresponding currencies already exist in the `currencies` table._

## Notes

- Always create tables before inserting data.
- The `currency_rates` table references the `currencies` table by `iso_code` (foreign key).
- If you insert a rate for a currency that does not exist in `currencies`, you will get a foreign key error.

---
**Looks good to me, but I hate working on