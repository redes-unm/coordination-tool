import LoginSignup from '@/components/LoginSignup';
import { signUp } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: { [key: string]: string }
};

const prod = process.env.NODE_ENV === 'production';

export default function Signup({ searchParams }: Props) {
  if (prod) {
    return 'Signups are currently disabled.';
  }

  const redirectPath = searchParams['redirect'] ?? '/';

  const handleSubmit = async (_prevState: string | null, data: FormData) => {
    'use server';

    const name = data.get('name');
    const email = data.get('email');
    const password = data.get('password');
    if (typeof name !== 'string'
        || typeof email !== 'string'
        || typeof password !== 'string') {
      return 'An unexpected error occurred';
    }

    try {
      await signUp(name, email, password);
    } catch (e) {
      return e instanceof Error ? e.message : 'An unexpected error occurred';
    }

    revalidatePath(redirectPath, 'layout');
    return redirect(redirectPath);
  };

  return <LoginSignup redirectPath={redirectPath} onSubmit={handleSubmit} signup />;
}
