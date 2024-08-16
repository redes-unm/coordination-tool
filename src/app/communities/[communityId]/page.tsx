'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useContext, useEffect } from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import TrackingContext from '@/contexts/TrackingContext';

import btnStyles from '@/components/Button.module.css';
import { useRouter } from 'next/navigation';
import { shorten } from '@/lib/util';
import {
  annotationsIcon, campaignsIcon, communityPrivateIcon, tasksIcon,
} from '@/icons';
import styles from './page.module.css';

export default function Community() {
  const {
    community,
    collaborators,
    campaigns,
    tasks,
    annotations,
  } = useContext(CommunityContext);
  const router = useRouter();
  const collabCount = collaborators.length;

  const { handleTracking } = useContext(TrackingContext);
  const trackEvent = useCallback((element: string, event: string) => {
    const timestamp = new Date();
    handleTracking({
      event,
      element,
      timestamp,
      page: `CommunityOverview-${community.id}`,
    });
  }, [community.id, handleTracking]);

  useEffect(() => {
    trackEvent('', 'page-mount');
    return () => {
      trackEvent('', 'page-unmount');
    };
  }, [trackEvent]);

  const editCommunity = () => {
    trackEvent('edit-community-button', 'click');
    return router.push(`/communities/${community.id}/edit`);
  };

  const trackClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    trackEvent(event.currentTarget.dataset['element'] || 'link', 'click');
  };

  return (
    <>
      <div className={styles['content']}>
        <h2 className={styles['title']}>
          {`${shorten(community.name, 100)} - Community Overview`}
        </h2>
        <div className={styles['details-and-buttons']}>
          <div className={styles['details']}>
            <span className={styles['details-publicity']}>
              <FontAwesomeIcon icon={communityPrivateIcon} />
              <span>Private</span>
            </span>
            <span>&bull;</span>
            <span>
              {`${collabCount} collaborator${collabCount === 1 ? '' : 's'}`}
            </span>
          </div>
          <div className={styles['buttons']}>
            <button
              type="button"
              className={btnStyles['btn']}
              onClick={editCommunity}
            >
              Edit
            </button>
          </div>
        </div>
        <div className={styles['description']}>
          {
              community.description.split('\n')
                .filter((s) => !!s.trim())
              /* eslint-disable-next-line react/no-array-index-key --
                     there's nothing else unique to use */
                .map((p, i) => <p key={i}>{p}</p>)
            }
        </div>
      </div>

      <div className={styles['links']}>
        <Link href={`/communities/${community.id}/campaigns`} data-element="campaigns-link" onClick={trackClick}>
          <div className={styles['link']}>
            <FontAwesomeIcon icon={campaignsIcon} />
            <span className={styles['link-name']}>Campaigns</span>
            <span className={styles['link-count']}>
              <span className={styles['count']}>{campaigns.length}</span>
              <span className={styles['count-label']}>open</span>
            </span>
          </div>
        </Link>
        <Link href={`/communities/${community.id}/tasks`} data-element="tasks-link" onClick={trackClick}>
          <div className={styles['link']}>
            <FontAwesomeIcon icon={tasksIcon} />
            <span className={styles['link-name']}>Tasks</span>
            <span className={styles['link-count']}>
              <span className={styles['count']}>{tasks.length}</span>
              <span className={styles['count-label']}>pending</span>
            </span>
          </div>
        </Link>
        <div className={styles['link']}>
          <FontAwesomeIcon icon={annotationsIcon} />
          <span className={styles['link-name']}>Annotations</span>
          <span className={styles['link-count']}>
            <span className={styles['count']}>{annotations.length}</span>
            <span className={styles['count-label']}>total</span>
          </span>
        </div>
      </div>
    </>
  );
}
