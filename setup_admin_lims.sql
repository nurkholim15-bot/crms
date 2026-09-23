DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'admin_lims') THEN
      CREATE USER admin_lims WITH ENCRYPTED PASSWORD 'Nkl@130200';
   ELSE
      ALTER USER admin_lims WITH ENCRYPTED PASSWORD 'Nkl@130200';
   END IF;
END
$do$;

SELECT 'CREATE DATABASE crms_db OWNER admin_lims'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'crms_db')\gexec

ALTER DATABASE crms_db OWNER TO admin_lims;
GRANT ALL PRIVILEGES ON DATABASE crms_db TO admin_lims;

-- Grant schema permissions
\c crms_db postgres
GRANT ALL ON SCHEMA public TO admin_lims;
ALTER SCHEMA public OWNER TO admin_lims;
