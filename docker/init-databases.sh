#!/bin/bash
set -e

# Create all 10 SSMS databases
for db in ssms_user_management ssms_customer ssms_product ssms_inventory ssms_order ssms_billing ssms_payment ssms_digital_marketing ssms_supplier ssms_installation; do
  echo "Creating database: $db"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE $db;
EOSQL
done

echo "All 10 databases created successfully."
