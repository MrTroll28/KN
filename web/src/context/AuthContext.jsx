import { createContext, useContext, useState } from 'react';
import { api } from '../lib/fetcher';

const AuthCtx = createContext(null);
export function useAuth(){ return useContext(AuthCtx); }

export default function AuthProvider({ children }){
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')||'null'));
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = async (email, password) => {
    const { token, user } = await api('/auth/login', { method:'POST', body:{ email, password } });
    setUser(user); setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };
  const logout = () => { setUser(null); setToken(null); localStorage.clear(); };

  return <AuthCtx.Provider value={{ user, token, login, logout }}>{children}</AuthCtx.Provider>;
}
