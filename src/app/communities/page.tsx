import Page from '@/components/Page';
import getDb from '@/db/mockDB';
import Link from 'next/link';

export default async function Communities() {
  const communities = await getDb().getCommunities();

  return (
    <Page>
      { communities.map((c) => (
        <div key={c.id}>
          <Link href={`/communities/${c.id}`}>{c.name}</Link>
        </div>
      )) }
      <div>
        <Link href="/communities/add">Join or Create</Link>
      </div>
    </Page>
  );
}
