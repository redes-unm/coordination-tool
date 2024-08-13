'use client';

import CommunityEditForm from '@/components/CommunityEditForm';
import { useCallback, useContext } from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import { useRouter } from 'next/navigation';
import { newDb } from '@/db/client';
import { Collaborator, Community } from '@/types';
import AuthContext from '@/contexts/AuthContext';
import BreadcrumbContext from '@/contexts/BreadcrumbContext';
import TrackingContext from '@/contexts/TrackingContext';

import CommunityListContext from '@/contexts/CommunityListContext';
import styles from './page.module.css';

export default function EditCommunity() {
  const router = useRouter();

  const { user } = useContext(AuthContext);

  const {
    community,
    collaborators,
    onCommunityDataUpdated,
  } = useContext(CommunityContext);

  const { onCommunityUpdated, onCommunityDeleted } = useContext(CommunityListContext);

  const { update: updateBreadcrumb } = useContext(BreadcrumbContext);
  const { handleTracking } = useContext(TrackingContext);

  const trackEvent = useCallback((element: string, event: string) => {
    if (user) {
      const timestamp = new Date();

      handleTracking({
        event,
        element,
        timestamp,
        page: `EditCommunity-${community.id}`,
        userId: user.id,
      });
    }
  }, [community, handleTracking, user]);

  const handleSave = async (comm: Community, collabs: Collaborator[]) => {
    trackEvent('save-button', 'click');
    await newDb().updateCommunity(comm, collabs);
    onCommunityDataUpdated({ community: comm, collaborators: collabs });
    onCommunityUpdated({ ...community, collaboratorCount: collabs.length });
    updateBreadcrumb();
    router.push(`/communities/${community.id}`);
  };

  const handleDelete = async () => {
    trackEvent('delete-button', 'click');
    await newDb().deleteCommunity(community.id);
    onCommunityDeleted(community.id);
    router.push('/communities');
  };

  const handleCancel = () => {
    trackEvent('cancel-button', 'click');
    return router.push(`/communities/${community.id}`);
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
        onCancel={handleCancel}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
