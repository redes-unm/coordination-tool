alter table profiles enable row level security;

create policy "Any authenticated user can view profiles"
on profiles for select to authenticated
using (true);

create policy "User can create their own profiles"
on profiles for insert to authenticated
with check ((select auth.uid()) = userId);

create policy "Users can update their own profiles"
on profiles for update to authenticated
using ((select auth.uid()) = userId);

-- no profile deletion currently allowed
