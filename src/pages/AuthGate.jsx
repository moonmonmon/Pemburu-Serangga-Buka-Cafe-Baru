import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { homeFor } from '../lib/roles';

export default function AuthGate() {
  const { user } = useAuth();
  if (user) return <Navigate to={homeFor(user.role)} replace />;

  return (
    <div className="finish-page auth-page">
      <div className="home-photos"></div>
      <div className="home-fades"></div>
      <div className="auth-card">
        <img src="/assets/images/logo.png" alt="The Cups & Co" className="auth-logo" />
        <p className="auth-eyebrow">The Cups & Co</p>
        <h1>Selamat datang</h1>
        <div className="auth-rule"></div>
        <p className="auth-desc">Masuk sebagai siapa hari ini?</p>

        <div className="gate-actions">
          <Link to="/masuk/pelanggan" className="gate-btn gate-btn-primary">
            <strong>Saya Pelanggan</strong>
            <span>Reservasi meja &amp; ambil nomor antrian</span>
          </Link>
          <Link to="/masuk/staf" className="gate-btn gate-btn-outline">
            <strong>Saya Staf</strong>
            <span>Admin, kasir, atau pemilik cafe</span>
          </Link>
        </div>

        <p className="auth-foot">Specialty Coffee · Medan</p>
      </div>
    </div>
  );
}
