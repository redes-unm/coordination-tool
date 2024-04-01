import CommunityMap from '@/components/CommunityMap';
import Page from '@/components/Page';
import getDb from '@/db/mockDB';
import { withDbNotFound404 } from '@/lib/util';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserLock, faClipboard, faListCheck, faPenRuler,
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

type Props = {
  params: { communityId: string }
};

export default async function Community({ params }: Props) {
  const [
    community,
    campaignCount,
    annotations,
    taskCount,
    collaboratorCount,
  ] = await withDbNotFound404(() => Promise.all([
    getDb().getCommunity(params.communityId),
    getDb().getCampaignCount(params.communityId),
    getDb().getCommunityAnnotations(params.communityId),
    getDb().getCommunityTaskCount(params.communityId),
    getDb().getCommunityCollaboratorCount(params.communityId),
  ]));

  return (
    <Page community={community}>
      <div className={styles['panes']}>
        <div className={styles['content-pane']}>
          <div className={styles['content']}>
            <h2 className={styles['title']}>
              {`${community.name} - Community Overview`}
            </h2>
            <div className={styles['details']}>
              <span className={styles['details-publicity']}>
                <FontAwesomeIcon icon={faUserLock} />
                <span>Private</span>
              </span>
              <span>&bull;</span>
              <Link href={`/communities/${community.id}/collaborators`}>
                {`${collaboratorCount} collaborator${collaboratorCount > 1 ? 's' : ''}`}
              </Link>
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
                  <span className={styles['count']}>{campaignCount}</span>
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
        </div>
        <div className={styles['map-pane']}>
          <CommunityMap initialAnnotations={annotations} />
        </div>
      </div>
    </Page>
  );
}
