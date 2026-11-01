import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { STAFF_ACCOUNTS } from '../lib/roles';
import * as db from '../lib/db';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => db.readSession());
  const [version, setVersion] = useState(0);

  const user = useMemo(() => {
    if (!session) return null;
    if (session.role === 'pelanggan') {
      const u = db.getUsers().find((x) => x.id === session.userId);
      return u ? { ...u, role: 'pelanggan' } : null;
    }
    const s = STAFF_ACCOUNTS.find((x) => x.id === session.staffId);
    return s ? { id: s.id, nama: s.nama, role: s.role } : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, version]);

  const loginPelanggan = useCallback((userId) => {
    const s = { role: 'pelanggan', userId };
    db.writeSession(s);
    setSession(s);
  }, []);

  const loginStaf = useCallback((idInput) => {
    const id = String(idInput || '').trim().toUpperCase();
    const acc = STAFF_ACCOUNTS.find((x) => x.id === id);
    if (!acc) return { ok: false };
    const s = { role: acc.role, staffId: acc.id };
    db.writeSession(s);
    setSession(s);
    return { ok: true, role: acc.role };
  }, []);

  const logout = useCallback(() => {
    db.writeSession(null);
    setSession(null);
  }, []);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  return (
    <AuthContext.Provider value={{ user, loginPelanggan, loginStaf, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
