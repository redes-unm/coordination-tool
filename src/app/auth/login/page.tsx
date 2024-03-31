import Page from '@/components/Page';
import { redirect } from 'next/navigation';
import LoginSignup from '@/components/LoginSignup';
import { isLoggedIn, logIn } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

type Props = {
  searchParams: { [key: string]: string }
};

export default async function Login({ searchParams }: Props) {
  const redirectPath = searchParams['redirect'] ?? '/';
  try {
    if (await isLoggedIn()) {
      redirect(redirectPath);
    }
  } catch (e) {
    // ignore
  }

  const handleSubmit = async (_prevState: string | null, data: FormData) => {
    'use server';

    const email = data.get('email');
    const password = data.get('password');
    if (typeof email !== 'string' || typeof password !== 'string') {
      return 'An unexpected error occurred';
    }

    try {
      await logIn(email, password);
    } catch (e) {
      return e instanceof Error ? e.message : 'An unexpected error occurred';
    }

    revalidatePath(redirectPath, 'layout');
    return redirect(redirectPath);
  };

  return (
    <Page hideBreadcrumb>
      <LoginSignup redirectPath={redirectPath} onSubmit={handleSubmit} />
    </Page>
  );
}
