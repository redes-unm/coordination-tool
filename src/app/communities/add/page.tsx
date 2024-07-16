import { newDb } from '@/db/server';
import { getUser } from '@/lib/auth/server';
import CommunityCreator from '@/components/CommunityCreator';
import styles from './page.module.css';

export default async function AddCommunity() {
  const db = newDb();
  const adminId = process.env['ADMIN_ID'];
  const user = await getUser();

  const [userProfile, adminProfile] = await Promise.all([
    db.getProfile(user.id),
    adminId && user.id !== adminId ? db.getProfile(adminId) : null,
  ]);

  return (
    <div className={styles['page']}>
      <h2>Create a new community</h2>
      <CommunityCreator creator={userProfile} admin={adminProfile} />
    </div>
  );
}
