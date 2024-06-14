'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import CommunityListContext from '@/contexts/CommunityListContext';
import { shorten } from '@/lib/util';
import {
  addIcon, annotationsIcon, campaignsIcon, communityPrivateIcon, tasksIcon,
} from '@/icons';
import styles from './page.module.css';

const descriptionMaxLength = 80;

export default function Communities() {
  const { communities } = useContext(CommunityListContext);

  return (
    <div className={styles['cards']}>
      { communities.map((c) => (
        <div key={c.id} className={styles['card']}>
          <h2 className={styles['card-title']}>
            <Link href={`/communities/${c.id}`}>{c.name}</Link>
          </h2>
          <div className={styles['details']}>
            <span className={styles['details-publicity']}>
              <FontAwesomeIcon icon={communityPrivateIcon} />
              <span>Private</span>
            </span>
            <span>&bull;</span>
            {`${c.collaboratorCount} collaborator${c.collaboratorCount === 1 ? '' : 's'}`}
          </div>
          <div className={styles['description']}>
            { shorten(c.description, descriptionMaxLength) }
          </div>
          <div className={styles['read-more']}>
            <Link href={`/communities/${c.id}`}>Read more</Link>
          </div>
          <div className={styles['links']}>
            <Link href={`/communities/${c.id}/campaigns`}>
              <FontAwesomeIcon icon={campaignsIcon} />
              <span className="a11y-only">Campaigns</span>
            </Link>
            <Link href={`/communities/${c.id}/tasks`}>
              <FontAwesomeIcon icon={tasksIcon} />
              <span className="a11y-only">Tasks</span>
            </Link>
            <Link href={`/communities/${c.id}`}>
              <FontAwesomeIcon icon={annotationsIcon} />
              <span className="a11y-only">Annotations</span>
            </Link>
          </div>
        </div>
      )) }
      <Link href="/communities/add" className={`${styles['card']} ${styles['join-create']}`}>
        <FontAwesomeIcon icon={addIcon} />
        <span className={styles['card-title']}>Join or Create</span>
      </Link>
    </div>
  );
}
