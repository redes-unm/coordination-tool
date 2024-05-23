import CommunityEditForm from '@/components/CommunityEditForm';
import { newDb } from '@/db/server';
import { v4 as uuid } from 'uuid';
import { getUser } from '@/lib/auth/server';
import styles from './page.module.css';

export default async function AddCommunity() {
  const id = uuid();
  const db = newDb();
  const adminId = process.env['ADMIN_ID'];
  const user = await getUser();

  const [userProfile, adminProfile] = await Promise.all([
    db.getProfile(user.id),
    adminId && user.id !== adminId ? db.getProfile(adminId) : null,
  ]);

  const collaborators = [{
    ...userProfile, id: uuid(), communityId: id, role: 'creator', editable: false,
  }];

  if (adminProfile) {
    collaborators.push({
      ...adminProfile, id: uuid(), communityId: id, role: 'admin', editable: false,
    });
  }

  return (
    <div className={styles['page']}>
      <h2>Create a new community</h2>
      <CommunityEditForm
        community={{
          id, name: '', description: '', creatorId: user.id,
        }}
        collaborators={collaborators}
        cancelPath="/communities"
        savePath={`/communities/${id}`}
      />
    </div>
  );
}
