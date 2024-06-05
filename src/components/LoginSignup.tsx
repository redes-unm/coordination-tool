'use client';

import btnStyles from '@/components/Button.module.css';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { useContext, useEffect } from 'react';
import AuthContext from '@/contexts/AuthContext';
import TextInput from './TextInput';
import styles from './LoginSignup.module.css';
import SubmitButton from './SubmitButton';

type Props = {
  redirectPath: string
  signup?: boolean
  onSubmit: (prevState: string | null, data: FormData) => Promise<string | null>
};

const prod = process.env.NODE_ENV === 'production';

export default function LoginSignup({
  redirectPath,
  signup = false,
  onSubmit,
}: Props) {
  const { reset } = useContext(AuthContext);
  const [error, action] = useFormState(onSubmit, null);

  // reset auth status when this component unmounts, indicating that auth is done
  useEffect(() => reset, [reset]);

  return (
    <div className={styles['container']}>
      <h2 className={styles['heading']}>
        { signup ? 'Sign up' : 'Log in' }
      </h2>
      { error && (
        <div className="error">
          {`Error: ${error}`}
        </div>
      )}
      <form className={styles['form']} action={action}>
        {signup && <TextInput label="Name" id="name" name="name" type="text" required />}
        <TextInput label="Email" id="email" name="email" type="email" required />
        <TextInput label="Password" id="password" name="password" type="password" required />
        <SubmitButton
          className={`${btnStyles['btn']} ${btnStyles['solid']} ${styles['btn']}`}
          text={signup ? 'Sign up' : 'Log in'}
        />
      </form>

      { !prod && (
        <div>
          { signup ? 'Already have an account? ' : 'Don\'t have an account? ' }
          <Link href={`/auth/${signup ? 'login' : 'signup'}?redirect=${encodeURIComponent(redirectPath)}`}>
            { signup ? 'Log in' : 'Sign up' }
          </Link>
          .
        </div>
      )}
    </div>
  );
}
