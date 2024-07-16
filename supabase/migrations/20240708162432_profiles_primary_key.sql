drop table if exists profiles;

create table profiles (
    userId uuid primary key references auth.users on delete cascade,
    name text not null
);
