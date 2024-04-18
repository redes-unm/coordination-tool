import { createContext } from 'react';

const AuthContext = createContext({
  loggedIn: false,
  reset: () => {},
});

export default AuthContext;
