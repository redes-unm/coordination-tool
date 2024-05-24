create function editCommunity(
    community communities,
    collabs collaborators[]
)
    returns communities
    language plpgsql
as
$$
declare
    collab collaborators%rowtype;
    collabIds uuid[];
begin
    update communities
        set creatorid = community.creatorid,
            name = community.name,
            description = community.description,
            mapcenter = community.mapcenter
        where id = community.id;

    if not found then
        raise exception 'community % not found', community.id;
    end if;

    foreach collab in array collabs loop
        insert into collaborators select collab.*
            on conflict (id) do update
            set userid = collab.userid,
                name = collab.name,
                role = collab.role,
                editable = collab.editable;

        collabIds := collabIds || collab.id;
    end loop;

    delete from collaborators
        where communityid = community.id
        and not (id = any (collabIds));

    return community;
end;
$$;
