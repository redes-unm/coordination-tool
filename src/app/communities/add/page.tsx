import { newDb } from '@/db/server';
import { getUser } from '@/lib/auth/server';
import CommunityCreator from '@/components/CommunityCreator';
import { Profile } from '@/types';
import styles from './page.module.css';

export default async function AddCommunity() {
  const db = newDb();
  const adminId = process.env['ADMIN_ID'];
  const user = await getUser();

  async function getProfileOrDefault(userId: string, defaultName: string): Promise<Profile> {
    try {
      return await db.getProfile(userId);
    } catch (e) {
      return { userId, name: defaultName };
    }
  }

  const [userProfile, adminProfile] = await Promise.all([
    getProfileOrDefault(user.id, 'You'),
    adminId && user.id !== adminId ? getProfileOrDefault(adminId, 'Admin') : null,
  ]);

  return (
    <div className={styles['page']}>
      <h2>Create a new community</h2>
      <CommunityCreator creator={userProfile} admin={adminProfile} />
    </div>
  );
}
