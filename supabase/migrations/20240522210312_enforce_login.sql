alter table communities enable row level security;
alter table campaigns enable row level security;
alter table annotations enable row level security;
alter table campaignAnnotations enable row level security;
alter table tasks enable row level security;
alter table collaborators enable row level security;

alter table communities add column creatorId uuid references auth.users on delete set null;

create schema if not exists private;

create function private.is_allowed_community(cid uuid)
returns boolean
language plpgsql
security definer
as $$
begin
    perform id from communities where creatorId = (select auth.uid())
        and id = cid;
    if found then
        return true;
    end if;

    perform communityId from collaborators where userId = (select auth.uid())
        and communityId = cid;
    return found;
end;
$$;

-- communities policies

create policy "Users can view their communities"
on communities for select to authenticated
using (private.is_allowed_community(id));

create policy "Users can create communities with themselves as creator"
on communities for insert to authenticated
with check ((select auth.uid()) = creatorId);

create policy "Users can edit their communities"
on communities for update to authenticated
using (private.is_allowed_community(id));

create policy "Users can delete their communities"
on communities for delete to authenticated
using (private.is_allowed_community(id));

-- campaigns policies

create policy "Users can view campaigns in their communities"
on campaigns for select to authenticated
using (private.is_allowed_community(communityId));

create policy "Users can create campaigns in their communities"
on campaigns for insert to authenticated
with check (private.is_allowed_community(communityId));

create policy "Users can edit campaigns in their communities"
on campaigns for update to authenticated
using (private.is_allowed_community(communityId));

create policy "Users can delete campaigns in their communities"
on campaigns for delete to authenticated
using (private.is_allowed_community(communityId));

-- annotations policies

create policy "Users can view annotations in their communities"
on annotations for select to authenticated
using (private.is_allowed_community(communityId));

create policy "Users can create annotations in their communities"
on annotations for insert to authenticated
with check (private.is_allowed_community(communityId));

create policy "Users can edit annotations in their communities"
on annotations for update to authenticated
using (private.is_allowed_community(communityId));

create policy "Users can delete annotations in their communities"
on annotations for delete to authenticated
using (private.is_allowed_community(communityId));

-- campaignAnnotations policies

create policy "Users can view campaignAnnotations in their communities"
on campaignAnnotations for select to authenticated
using (
    private.is_allowed_community((select communityId from campaigns where id = campaignId))
);

create policy "Users can create campaignAnnotations in their communities"
on campaignAnnotations for insert to authenticated
with check (
    private.is_allowed_community((select communityId from campaigns where id = campaignId))
);

create policy "Users can edit campaignAnnotations in their communities"
on campaignAnnotations for update to authenticated
using (
    private.is_allowed_community((select communityId from campaigns where id = campaignId))
);

create policy "Users can delete campaignAnnotations in their communities"
on campaignAnnotations for delete to authenticated
using (
    private.is_allowed_community((select communityId from campaigns where id = campaignId))
);

-- tasks policies

create policy "Users can view tasks in their communities"
on tasks for select to authenticated
using (
    private.is_allowed_community((select communityId from campaigns where id = campaignId))
);

create policy "Users can create tasks in their communities"
on tasks for insert to authenticated
with check (
    private.is_allowed_community((select communityId from campaigns where id = campaignId))
);

create policy "Users can edit tasks in their communities"
on tasks for update to authenticated
using (
    private.is_allowed_community((select communityId from campaigns where id = campaignId))
);

create policy "Users can delete tasks in their communities"
on tasks for delete to authenticated
using (
    private.is_allowed_community((select communityId from campaigns where id = campaignId))
);

-- collaborators policies

create policy "Users can view collaborators in their communities"
on collaborators for select to authenticated
using (private.is_allowed_community(communityId));

create policy "Users can create collaborators in their communities"
on collaborators for insert to authenticated
with check (private.is_allowed_community(communityId));

create policy "Users can edit collaborators in their communities"
on collaborators for update to authenticated
using (private.is_allowed_community(communityId));

create policy "Users can delete collaborators in their communities"
on collaborators for delete to authenticated
using (private.is_allowed_community(communityId));
