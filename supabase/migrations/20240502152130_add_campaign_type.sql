create type campaignType as enum (
    'measurement',
    'education',
    'event',
    'other'
);

alter table campaigns add column type campaignType;
update campaigns set type = 'measurement';
alter table campaigns alter column type set not null;
