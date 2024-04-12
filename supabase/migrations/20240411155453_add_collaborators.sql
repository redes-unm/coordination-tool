create table collaborators (
    communityId uuid not null references communities on delete cascade,
    userId uuid not null references auth.users on delete cascade
);
