-- Allow read access to frames buckets
create policy "Read access to frames bucket only"
on storage.buckets
for SELECT TO public
using (
  id = 'frames'
);

-- Allow user to select a file from the frames bucket. This is needed for the Delete to work as well.
create policy "Select access based on team membership"
on storage.objects
for select TO authenticated
using (
  bucket_id = 'frames' AND
  exists (
    select 1
    from public."UserTeam" ut
    where ut."userId" = auth.uid() and ut."teamId" = path_tokens[1]::uuid
  )
);

-- Allow user to write to frames bucket. Note: We don't allow "update", because there is a CDN caching it.
create policy "Write access based on team membership"
on storage.objects
for INSERT TO authenticated
with CHECK (
  bucket_id = 'frames' AND
  exists (
    select 1
    from public."UserTeam" ut
    where ut."userId" = auth.uid() and ut."teamId" = path_tokens[1]::uuid
  )
);

-- Allow user to delete the file from the frames bucket.
create policy "Delete access based on team membership"
on storage.objects
for DELETE TO authenticated
using (
  bucket_id = 'frames' AND
  exists (
    select 1
    from public."UserTeam" ut
    where ut."userId" = auth.uid() and ut."teamId" = path_tokens[1]::uuid
  )
);
