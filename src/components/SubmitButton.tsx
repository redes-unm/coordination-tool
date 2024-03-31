'use client';

import { useFormStatus } from 'react-dom';

type Props = {
  text?: string
  className?: string,
};

export default function SubmitButton({
  className = '',
  text = 'Submit',
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button className={className} type="submit" disabled={pending}>
      {pending ? 'Loading...' : text}
    </button>
  );
}
