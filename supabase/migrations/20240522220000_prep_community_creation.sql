alter table collaborators add column id uuid primary key default gen_random_uuid();
alter table collaborators alter column userId drop not null;
alter table collaborators add column name text not null;
alter table collaborators add column role text not null;
alter table collaborators add column editable boolean not null;

alter table communities add column mapCenter point;

create table profiles (
    userId uuid not null references auth.users on delete cascade,
    name text not null
);

create function createCommunity(
    community communities,
    collabs collaborators[]
)
    returns communities
    language plpgsql
as
$$
declare
    collab collaborators%rowtype;
begin
    insert into communities select community.*;

    foreach collab in array collabs loop
        insert into collaborators select collab.*;
    end loop;

    insert into campaigns (communityId, name, type, defaultForCommunity)
        select community.id, 'Default', 'measurement', true;

    return community;
end;
$$;
