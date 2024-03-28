create extension postgis with schema extensions;

create table communities (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text
);

create table campaigns (
    id uuid primary key default gen_random_uuid(),
    communityId uuid not null references communities on delete cascade,
    name text not null,
    description text,

    -- only allow a single campaign to be default for a given community
    defaultForCommunity boolean check (defaultForCommunity = true),
    unique (communityId, defaultForCommunity)
);

create type annotationType as enum (
    'infra',
    'equipment',
    'person',
    'poi',
    'region'
);

create table annotations (
    id uuid primary key default gen_random_uuid(),
    communityId uuid not null references communities on delete cascade,
    name text not null,
    description text,
    type annotationType not null,
    visible boolean not null,
    geo geometry not null
);

create table campaignAnnotations (
    campaignId uuid not null references campaigns on delete cascade,
    annotationId uuid not null references annotations on delete cascade,
    unique (campaignId, annotationId)
);

create type taskPriority as enum ('low', 'medium', 'high');
create type taskStatus as enum ('todo', 'in progress', 'done');

create table tasks (
    id uuid primary key default gen_random_uuid(),
    campaignId uuid not null references campaigns on delete cascade,
    name text not null,
    description text,
    priority taskPriority not null,
    status taskStatus not null
);
