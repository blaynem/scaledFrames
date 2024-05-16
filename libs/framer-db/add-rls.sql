--- Modify default privileges on the public schema, removal at the end.
GRANT supabase_storage_admin TO postgres;

-- START: PRISMA LOVES DELETING ALL THE GRANTS. REEE
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;
---- END: PRISMA DELETING GRANTS

--- Enable RLS for the UserTeam table.
DO $$
BEGIN
  DROP POLICY IF EXISTS "User can view self in UserTeam" ON "UserTeam";
  CREATE POLICY "User can view self in UserTeam" ON "UserTeam"
  FOR SELECT to authenticated
  USING ("userId" = auth.uid());
END
$$;

-- Create or replace read access policy for frames buckets
DO $$
BEGIN
  DROP POLICY IF EXISTS "Read access to frames bucket only" ON storage.buckets;
  CREATE POLICY "Read access to frames bucket only"
  ON storage.buckets
  FOR SELECT
  TO public
  USING (id = 'frames');
END
$$;

-- Create or replace policy for selecting files based on team membership
DO $$
BEGIN
  DROP POLICY IF EXISTS "Select access based on team membership" ON storage.objects;
  CREATE POLICY "Select access based on team membership"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'frames' AND
    EXISTS (
      SELECT 1
      FROM public."UserTeam" ut
      WHERE ut."userId" = auth.uid() AND ut."teamId" = path_tokens[1]::uuid
    )
  );
END
$$;

-- Create or replace policy for INSERTING files based on team membership
DO $$
BEGIN
  DROP POLICY IF EXISTS "Write access based on team membership" ON storage.objects;
  CREATE POLICY "Write access based on team membership"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'frames' AND
    EXISTS (
      SELECT 1
      FROM public."UserTeam" ut
      WHERE ut."userId" = auth.uid() AND ut."teamId" = path_tokens[1]::uuid
    )
  );
END
$$;

-- Create or replace policy for UPDATING files based on team membership
DO $$
BEGIN
  DROP POLICY IF EXISTS "Update access based on team membership" ON storage.objects;
  CREATE POLICY "Update access based on team membership"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'frames' AND
    EXISTS (
      SELECT 1
      FROM public."UserTeam" ut
      WHERE ut."userId" = auth.uid() AND ut."teamId" = path_tokens[1]::uuid
    )
  );
END
$$;

-- Create or replace policy for DELETING files based on team membership
DO $$
BEGIN
  DROP POLICY IF EXISTS "Delete access based on team membership" ON storage.objects;
  CREATE POLICY "Delete access based on team membership"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'frames' AND
    EXISTS (
      SELECT 1
      FROM public."UserTeam" ut
      WHERE ut."userId" = auth.uid() AND ut."teamId" = path_tokens[1]::uuid
    )
  );
END
$$;

REVOKE supabase_storage_admin FROM postgres;
