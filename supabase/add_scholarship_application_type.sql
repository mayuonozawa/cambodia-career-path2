-- Adds an application_type column to scholarships, recording how a student
-- actually applies for it. Run this once in the Supabase SQL Editor.
--
-- Values:
--   'direct'            -- student applies for the scholarship themselves
--   'via_school'        -- student is selected/nominated through their school
--   'after_enrollment'  -- student applies only after enrolling
--   NULL                -- not yet classified
--
-- As with scholarships.type (see allow_unclassified_scholarship_type.sql),
-- the CHECK constraint below does not need special-casing for NULL:
-- `NULL IN (...)` evaluates to NULL (unknown), which Postgres treats as
-- satisfying the constraint, so unclassified rows are allowed.

ALTER TABLE scholarships
  ADD COLUMN IF NOT EXISTS application_type TEXT
    CHECK (application_type IN ('direct', 'via_school', 'after_enrollment'));
