'use client';

import CommunityEditForm from '@/components/CommunityEditForm';
import { Collaborator, Community } from '@/types';
import { useRouter } from 'next/navigation';
import { newDb } from '@/db/client';

type Props = {
  initialCommunity: Community
  initialCollaborators: Collaborator[]
};

export default function CommunityCreator({
  initialCommunity,
  initialCollaborators,
}: Props) {
  const router = useRouter();

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
