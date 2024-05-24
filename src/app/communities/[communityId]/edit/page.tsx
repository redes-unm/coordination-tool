'use client';

import CommunityEditForm from '@/components/CommunityEditForm';
import { useContext } from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import { useRouter } from 'next/navigation';
import { newDb } from '@/db/client';
import { Collaborator, Community } from '@/types';
import styles from './page.module.css';

export default function EditCommunity() {
  const router = useRouter();
  const { community: communityPlus, onCommunityUpdated } = useContext(CommunityContext);

  const handleSave = async (community: Community, collaborators: Collaborator[]) => {
    await newDb().updateCommunity(community, collaborators);
    onCommunityUpdated({ ...communityPlus, ...community, collaborators });
    router.push(`/communities/${community.id}`);
  };

  const handleDelete = async () => {
    await newDb().deleteCommunity(communityPlus.id);
    router.push('/communities');
  };

  return (
    <div className={styles['page']}>
      <h2>Edit community</h2>
      <CommunityEditForm
        community={{
          id: communityPlus.id,
          creatorId: communityPlus.creatorId,
          name: communityPlus.name,
          description: communityPlus.description,
          mapCenter: communityPlus.mapCenter,
        }}
        collaborators={communityPlus.collaborators}
        onCancel={() => router.push(`/communities/${communityPlus.id}`)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
