-- create test users and their identities
-- source: https://gist.github.com/khattaksd/4e8f4c89f4e928a2ecaad56d4a17ecd1
insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) (
    select
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4(),
        'authenticated',
        'authenticated',
        't' || (ROW_NUMBER() OVER ()) || '@example.com',
        crypt('test123', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    from
        generate_series(1, 5)
);

insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
) (
    select
        uuid_generate_v4 (),
        id,
        id,
        format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
        'email',
        current_timestamp,
        current_timestamp,
        current_timestamp
    from
        auth.users
);

insert into communities (name, description, creatorId)
    select
        'Georgia Tech',
        'Measurement efforts for Georgia Tech''s campus and the surrounding area',
        id
    from auth.users
    where email = 't2@example.com';

insert into communities (name, description, creatorId)
    select
        'Emory',
        'Measurement efforts for Emory''s campus and the surrounding area',
        id
    from auth.users
    where email = 't3@example.com';

insert into collaborators (communityId, userId)
    select id, creatorId
    from communities;

insert into collaborators (communityId, userId)
    select communities.id, users.id
    from communities left outer join auth.users on true
    where users.email = 't1@example.com';

insert into campaigns (name, description, type, communityId, defaultForCommunity)
    select 'Default', 'Default campaign for Emory''s measurement efforts', 'other', id, true
    from communities where name = 'Georgia Tech';

insert into campaigns (name, description, type, communityId, defaultForCommunity)
    select 'Measure campus', 'Take measurements all over campus', 'measurement', id, null
    from communities where name = 'Georgia Tech';

insert into campaigns (name, description, type, communityId, defaultForCommunity)
    select 'Measure Home Park', null, 'event', id, null
    from communities where name = 'Georgia Tech';

insert into campaigns (name, description, type, communityId, defaultForCommunity)
    select 'Yet another campaign 1', 'A long description that surely will not fit on a single line because it is definitely too long for that.', 'education', id, null
    from communities where name = 'Georgia Tech';

insert into campaigns (name, description, type, communityId, defaultForCommunity)
    select 'Yet another campaign 2', 'A long description that surely will not fit on a single line because it is definitely too long for that.', 'event', id, null
    from communities where name = 'Georgia Tech';

insert into campaigns (name, description, type, communityId, defaultForCommunity)
    select 'Yet another campaign 3', 'A long description that surely will not fit on a single line because it is definitely too long for that.', 'measurement', id, null
    from communities where name = 'Georgia Tech';

insert into campaigns (name, description, type, communityId, defaultForCommunity)
    select 'Yet another campaign 4', 'A long description that surely will not fit on a single line because it is definitely too long for that.', 'measurement', id, null
    from communities where name = 'Georgia Tech';

insert into campaigns (name, description, type, communityId, defaultForCommunity)
    select 'Yet another campaign 5', 'A long description that surely will not fit on a single line because it is definitely too long for that.', 'education', id, null
    from communities where name = 'Georgia Tech';

insert into campaigns (name, description, type, communityId, defaultForCommunity)
    select 'Measure', 'Default campaign for Emory''s measurement efforts', 'education', id, true
    from communities where name = 'Emory';

insert into annotations (name, description, type, visible, communityId, geo)
    select 'Klaus', 'Advanced computing building', 'infra', true, id,
        ST_GeomFromGeoJSON('{"type": "Point", "coordinates": [-84.3963, 33.7772] }')
    from communities where name = 'Georgia Tech';

insert into annotations (name, description, type, visible, communityId, geo)
    select 'CoC', 'College of computing building', 'infra', true, id,
        ST_GeomFromGeoJSON('{"type": "Point", "coordinates": [-84.3972, 33.7773] }')
    from communities where name = 'Georgia Tech';

insert into annotations (name, description, type, visible, communityId, geo)
    select 'main campus', null, 'region', false, id,
        ST_GeomFromGeoJSON('{
            "type": "Polygon",
            "coordinates": [[
                [-84.40721130335966, 33.78146868021399],
                [-84.39179443631156, 33.781410567041206],
                [-84.39078062872775, 33.771617934347674],
                [-84.39885613051518, 33.77141451467952],
                [-84.40004473250934, 33.770978613764214],
                [-84.40245689538126, 33.77301279906288],
                [-84.40556823589634, 33.77420422802362],
                [-84.40682675565535, 33.775802460364275],
                [-84.40584790695397, 33.777284430982164],
                [-84.4064072490692, 33.77818522412362],
                [-84.40714138559542, 33.779434695701255],
                [-84.40721130335966, 33.78146868021399]
            ]]
        }')
    from communities where name = 'Georgia Tech';

insert into annotations (name, description, type, visible, communityId, geo)
    select 'Tech Square', null, 'region', true, id,
        ST_GeomFromGeoJSON('{
            "type": "Polygon",
            "coordinates": [[
                [-84.39042545928058, 33.77893750425781],
                [-84.38294442480331, 33.77893750425781],
                [-84.38294442480331, 33.774610477507025],
                [-84.39042545928058, 33.774610477507025],
                [-84.39042545928058, 33.77893750425781]
            ]]
        }')
    from communities where name = 'Georgia Tech';

insert into annotations (name, description, type, visible, communityId, geo)
    select 'Home Park park', 'a park in Home Park', 'poi', true, id,
        ST_GeomFromGeoJSON('{"type": "Point", "coordinates": [-84.39990549471283, 33.78242533958185]}')
    from communities where name = 'Georgia Tech';

insert into campaignAnnotations (campaignId, annotationId)
    select campaigns.id, annotations.id
    from annotations
    cross join (select id from campaigns where name = 'Default') as campaigns;

insert into campaignAnnotations (campaignId, annotationId)
    select campaigns.id, annotations.id
    from annotations
    cross join (select id from campaigns where name = 'Measure campus') as campaigns
    where name in ('Klaus', 'CoC', 'main campus', 'Tech Square');

insert into campaignAnnotations (campaignId, annotationId)
    select campaigns.id, annotations.id
    from annotations
    cross join (select id from campaigns where name = 'Measure Home Park') as campaigns
    where name = 'Home Park park';

insert into tasks (name, description, priority, status, dueDate, campaignId)
    select 'recruit students to measure', 'We need 10-20 people.', 'high', 'in progress', '2024-06-01', id
    from campaigns where name = 'Measure campus';

insert into tasks (name, description, priority, status, dueDate, campaignId)
    select 'plan measurement areas', 'Pick 5-10 initial spots.', 'high', 'done', '2024-04-01', id
    from campaigns where name = 'Measure campus';

insert into tasks (name, description, priority, status, dueDate, campaignId)
    select 'measure around Klaus building', null, 'medium', 'todo', '2024-12-01', id
    from campaigns where name = 'Measure campus';

insert into tasks (name, description, priority, status, dueDate, campaignId)
    select 'measure around CoC building', null, 'low', 'todo', '2024-12-01', id
    from campaigns where name = 'Measure campus';

insert into tasks (name, description, priority, status, dueDate, campaignId)
    select 'measure around TSRB', 'Get all sides, including the courtyard area.', 'medium', 'done', '2025-03-01', id
    from campaigns where name = 'Measure campus';

insert into tasks (name, description, priority, status, dueDate, campaignId)
    select 'measure around Coda', null, 'medium', 'in progress', null, id
    from campaigns where name = 'Measure campus';

insert into tasks (name, description, priority, status, dueDate, campaignId)
    select 'determine houses for measurements', null, 'high', 'in progress', null, id
    from campaigns where name = 'Measure Home Park';

insert into tasks (name, description, priority, status, dueDate, campaignId)
    select 'obtain permission to measure at selected houses', 'Be sure to get permission in writing.', 'high', 'todo', null, id
    from campaigns where name = 'Measure Home Park';

insert into tasks (name, description, priority, status, dueDate, campaignId)
    select 'plan measurement campaigns', null, 'high', 'in progress', '2024-04-01', id
    from campaigns where name = 'Default';
