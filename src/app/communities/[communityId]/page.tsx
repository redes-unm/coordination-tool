'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserLock, faClipboard, faListCheck, faPenRuler,
} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import CommunityContext from '@/contexts/CommunityContext';
import btnStyles from '@/components/Button.module.css';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Community() {
  const {
    community,
    collaborators,
    campaigns,
    taskCount,
    annotations,
  } = useContext(CommunityContext);
  const router = useRouter();
  const collabCount = collaborators.length;

  return (
    <>
      <div className={styles['content']}>
        <h2 className={styles['title']}>
          {`${community.name} - Community Overview`}
        </h2>
        <div className={styles['details-and-buttons']}>
          <div className={styles['details']}>
            <span className={styles['details-publicity']}>
              <FontAwesomeIcon icon={faUserLock} />
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
              onClick={() => router.push(`/communities/${community.id}/edit`)}
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
        <Link href={`/communities/${community.id}/campaigns`}>
          <div className={styles['link']}>
            <FontAwesomeIcon icon={faClipboard} />
            <span className={styles['link-name']}>Campaigns</span>
            <span className={styles['link-count']}>
              <span className={styles['count']}>{campaigns.length}</span>
              <span className={styles['count-label']}>open</span>
            </span>
          </div>
        </Link>
        <Link href={`/communities/${community.id}/tasks`}>
          <div className={styles['link']}>
            <FontAwesomeIcon icon={faListCheck} />
            <span className={styles['link-name']}>Tasks</span>
            <span className={styles['link-count']}>
              <span className={styles['count']}>{taskCount}</span>
              <span className={styles['count-label']}>pending</span>
            </span>
          </div>
        </Link>
        <Link href={`/communities/${community.id}/annotations`}>
          <div className={styles['link']}>
            <FontAwesomeIcon icon={faPenRuler} />
            <span className={styles['link-name']}>Annotations</span>
            <span className={styles['link-count']}>
              <span className={styles['count']}>{annotations.length}</span>
              <span className={styles['count-label']}>total</span>
            </span>
          </div>
        </Link>
      </div>
    </>
  );
}
