'use client';

import CommunityEditForm from '@/components/CommunityEditForm';
import { Collaborator, Community, Profile } from '@/types';
import { useRouter } from 'next/navigation';
import { newDb } from '@/db/client';
import { v4 as uuid } from 'uuid';
import { useMemo } from 'react';

type Props = {
  creator: Profile
  admin: Profile | null
};

export default function CommunityCreator({
  creator,
  admin,
}: Props) {
  const router = useRouter();

  const initialCommunity: Community = useMemo(() => ({
    id: uuid(),
    name: '',
    description: '',
    creatorId: creator.userId,
  }), [creator.userId]);

  const initialCollaborators: Collaborator[] = useMemo(() => [
    {
      ...creator,
      id: uuid(),
      communityId: initialCommunity.id,
      role: 'creator',
      editable: false,
    },
    ...(admin ? [{
      ...admin,
      id: uuid(),
      communityId: initialCommunity.id,
      role: 'admin',
      editable: false,
    }] : []),
  ], [creator, admin, initialCommunity.id]);

  const handleSave = async (community: Community, collaborators: Collaborator[]) => {
    await newDb().insertCommunity(community, collaborators);
    router.push(`/communities/${community.id}`);
  };

  return (
    <CommunityEditForm
      community={initialCommunity}
      collaborators={initialCollaborators}
      onCancel={() => router.push('/communities')}
      onSave={handleSave}
    />
  );
}
