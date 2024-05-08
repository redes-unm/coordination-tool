import { isLoggedIn } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    redirect('/communities');
  } else {
    redirect('/auth/login');
  }
}
