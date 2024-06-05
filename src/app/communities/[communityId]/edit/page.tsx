'use client';

import CommunityEditForm from '@/components/CommunityEditForm';
import { useContext } from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import { useRouter } from 'next/navigation';
import { newDb } from '@/db/client';
import { Collaborator, Community } from '@/types';
import BreadcrumbContext from '@/contexts/BreadcrumbContext';
import styles from './page.module.css';

export default function EditCommunity() {
  const router = useRouter();

  const {
    community,
    collaborators,
    onCommunityDataUpdated,
  } = useContext(CommunityContext);

  const { update: updateBreadcrumb } = useContext(BreadcrumbContext);

  const handleSave = async (comm: Community, collabs: Collaborator[]) => {
    await newDb().updateCommunity(comm, collabs);
    onCommunityDataUpdated({ community: comm, collaborators: collabs });
    updateBreadcrumb();
    router.push(`/communities/${community.id}`);
  };

  const handleDelete = async () => {
    await newDb().deleteCommunity(community.id);
    router.push('/communities');
  };

  return (
    <div className={styles['page']}>
      <h2>Edit community</h2>
      <CommunityEditForm
        community={{
          id: community.id,
          creatorId: community.creatorId,
          name: community.name,
          description: community.description,
          mapCenter: community.mapCenter,
        }}
        collaborators={collaborators}
        onCancel={() => router.push(`/communities/${community.id}`)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
