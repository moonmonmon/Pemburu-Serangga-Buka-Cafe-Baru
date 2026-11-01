import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { homeFor } from '../lib/roles';

// Membatasi halaman berdasarkan peran. Belum login → /masuk,
// peran tidak berwenang → dialihkan ke beranda peran tersebut.
export default function Guard({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/masuk" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to={homeFor(user.role)} replace />;
  return children;
}
