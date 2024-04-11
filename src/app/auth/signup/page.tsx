import LoginSignup from '@/components/LoginSignup';
import { signUp } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: { [key: string]: string }
};

export default function Signup({ searchParams }: Props) {
  const redirectPath = searchParams['redirect'] ?? '/';

  const handleSubmit = async (_prevState: string | null, data: FormData) => {
    'use server';

    const email = data.get('email');
    const password = data.get('password');
    if (typeof email !== 'string' || typeof password !== 'string') {
      return 'An unexpected error occurred';
    }

    try {
      await signUp(email, password);
    } catch (e) {
      return e instanceof Error ? e.message : 'An unexpected error occurred';
    }

    revalidatePath(redirectPath, 'layout');
    return redirect(redirectPath);
  };

  return <LoginSignup redirectPath={redirectPath} onSubmit={handleSubmit} signup />;
}
