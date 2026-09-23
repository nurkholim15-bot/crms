DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'crms_user') THEN
      CREATE USER crms_user WITH ENCRYPTED PASSWORD 'crms_pass123';
   END IF;
END
$do$;

SELECT 'CREATE DATABASE crms_db OWNER crms_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'crms_db')\gexec

GRANT ALL PRIVILEGES ON DATABASE crms_db TO crms_user;
ALTER DATABASE crms_db OWNER TO crms_user;
