-- Allows a scholarship to be listed before it has been classified as
-- full/partial/grant. Run this once in the Supabase SQL Editor.
--
-- Note: the existing CHECK (type IN ('full', 'partial', 'grant')) constraint
-- does NOT need to change — in Postgres/SQL, a CHECK constraint only
-- rejects rows where the expression evaluates to FALSE; `NULL IN (...)`
-- evaluates to NULL (unknown), which Postgres treats as satisfying the
-- constraint. So the only change needed is dropping NOT NULL.

ALTER TABLE scholarships ALTER COLUMN type DROP NOT NULL;
