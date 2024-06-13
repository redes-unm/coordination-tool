import { User } from '@/lib/auth/client';
import { createContext } from 'react';

type Data = {
  user: User | null,
  reset: () => void
};

const AuthContext = createContext<Data>({
  user: null,
  reset: () => {},
});

export default AuthContext;
