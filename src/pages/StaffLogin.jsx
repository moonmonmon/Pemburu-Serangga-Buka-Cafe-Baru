import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { homeFor } from '../lib/roles';

export default function StaffLogin() {
  const { user, loginStaf } = useAuth();
  const navigate = useNavigate();
  const [idStaf, setIdStaf] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to={homeFor(user.role)} replace />;

  const submit = (e) => {
    e.preventDefault();
    if (!idStaf.trim()) {
      setError('ID staf wajib diisi.');
      return;
    }
    const res = loginStaf(idStaf);
    if (!res.ok) {
      setError('ID tidak ditemukan. Periksa kembali ID kamu.');
      return;
    }
    navigate(homeFor(res.role), { replace: true });
  };

  return (
    <div className="finish-page auth-page">
      <div className="home-photos"></div>
      <div className="home-fades"></div>
      <div className="auth-card auth-card-form">
        <Link to="/masuk" className="auth-back">← Kembali</Link>
        <img src="/assets/images/logo.png" alt="The Cups & Co" className="auth-logo" />
        <p className="auth-eyebrow">Staf</p>

        <form onSubmit={submit} noValidate className="auth-form">
          <h1>Masuk dengan ID</h1>
          <p className="auth-desc">
            Gunakan ID unik sesuai peranmu: admin, kasir / staf, atau pemilik.
          </p>

          <div className="field-group">
            <label htmlFor="staf-id">ID Staf</label>
            <input
              id="staf-id" type="text" autoComplete="username" autoCapitalize="characters"
              placeholder="Contoh: ADM-001"
              value={idStaf}
              onChange={(e) => { setIdStaf(e.target.value); setError(''); }}
              className={error ? 'input-error' : ''}
            />
            <span className="field-error">{error}</span>
          </div>

          <button type="submit" className="btn-auth">Masuk</button>
        </form>
      </div>
    </div>
  );
}
