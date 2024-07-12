create table tracking (
    id uuid primary key default gen_random_uuid(),
    element text not null,
    event text not null,
    timestamp timestamp not null,
    userId uuid not null references auth.users on delete cascade
);

alter table tracking enable row level security;

create policy "Users can create their own tracking entries"
on tracking for insert to authenticated
with check ((select auth.uid()) = userId);
