--- Hack to allow us to alter the default privileges on the public schema. We remove it at the end.
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


-- Allow read access to frames buckets
DO $$
BEGIN
  -- Check if the policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Read access to frames bucket only' 
      AND tablename = 'buckets' 
      AND schemaname = 'storage'
  ) THEN
    -- Create the policy if it does not exist
    CREATE POLICY "Read access to frames bucket only"
    ON storage.buckets
    FOR SELECT
    TO public
    USING (id = 'frames');
  END IF;
END
$$;

-- Policy for selecting files based on team membership
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Select access based on team membership' 
      AND tablename = 'objects' 
      AND schemaname = 'storage'
  ) THEN
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
  END IF;
END
$$;

-- Policy for inserting files based on team membership
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Write access based on team membership' 
      AND tablename = 'objects' 
      AND schemaname = 'storage'
  ) THEN
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
  END IF;
END
$$;

-- Policy for deleting files based on team membership
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Delete access based on team membership' 
      AND tablename = 'objects' 
      AND schemaname = 'storage'
  ) THEN
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
  END IF;
END
$$;

REVOKE supabase_storage_admin FROM postgres;