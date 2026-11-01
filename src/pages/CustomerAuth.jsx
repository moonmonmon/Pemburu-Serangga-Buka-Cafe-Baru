import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { homeFor } from '../lib/roles';
import {
  getUsers, registerUser, findUser, normalizePhone, isValidPhone, isValidEmail,
} from '../lib/db';

export default function CustomerAuth() {
  const { user, loginPelanggan } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Jika di perangkat ini belum ada akun sama sekali, langsung arahkan ke pendaftaran
  const [tab, setTab] = useState(() => (getUsers().length === 0 ? 'daftar' : 'masuk'));

  // form daftar
  const [nama, setNama] = useState('');
  const [telp, setTelp] = useState('');
  const [email, setEmail] = useState('');
  const [errDaftar, setErrDaftar] = useState({});

  // form masuk
  const [metode, setMetode] = useState('telp');
  const [nilai, setNilai] = useState('');
  const [errMasuk, setErrMasuk] = useState('');
  const [notFound, setNotFound] = useState(false);

  if (user) return <Navigate to={homeFor(user.role)} replace />;

  const target = location.state?.from && location.state.from !== '/masuk' ? location.state.from : '/';

  const submitDaftar = (e) => {
    e.preventDefault();
    const res = registerUser({ nama, telp, email });
    if (!res.ok) {
      setErrDaftar(res.errors);
      return;
    }
    loginPelanggan(res.user.id);
    navigate(target, { replace: true });
  };

  const submitMasuk = (e) => {
    e.preventDefault();
    setNotFound(false);
    if (metode === 'telp' && !isValidPhone(normalizePhone(nilai))) {
      setErrMasuk('Format: 08xxxxxxxxxx (9–13 digit).');
      return;
    }
    if (metode === 'email' && !isValidEmail(nilai.trim())) {
      setErrMasuk('Format email tidak valid.');
      return;
    }
    const found = findUser(metode, nilai);
    if (!found) {
      setErrMasuk('');
      setNotFound(true);
      return;
    }
    loginPelanggan(found.id);
    navigate(target, { replace: true });
  };

  const switchToDaftar = () => {
    // bawa nilai yang sudah diketik ke form daftar
    if (metode === 'telp') setTelp(nilai);
    else setEmail(nilai);
    setNotFound(false);
    setTab('daftar');
  };

  const clearErr = (k) => setErrDaftar((p) => ({ ...p, [k]: '' }));

  return (
    <div className="finish-page auth-page">
      <div className="home-photos"></div>
      <div className="home-fades"></div>
      <div className="auth-card auth-card-form">
        <Link to="/masuk" className="auth-back">← Kembali</Link>
        <img src="/assets/images/logo.png" alt="The Cups & Co" className="auth-logo" />
        <p className="auth-eyebrow">Pelanggan</p>

        <div className="auth-tabs" role="tablist">
          <button
            type="button" role="tab" aria-selected={tab === 'daftar'}
            className={tab === 'daftar' ? 'active' : ''}
            onClick={() => setTab('daftar')}
          >
            Belum punya akun
          </button>
          <button
            type="button" role="tab" aria-selected={tab === 'masuk'}
            className={tab === 'masuk' ? 'active' : ''}
            onClick={() => setTab('masuk')}
          >
            Sudah punya akun
          </button>
        </div>

        {tab === 'daftar' ? (
          <form onSubmit={submitDaftar} noValidate className="auth-form">
            <h1>Buat akun</h1>
            <p className="auth-desc">Isi data dirimu untuk menautkan akun.</p>

            <div className="field-group">
              <label htmlFor="reg-nama">Nama Lengkap</label>
              <input
                id="reg-nama" type="text" autoComplete="name" placeholder="Masukkan nama kamu"
                value={nama} onChange={(e) => { setNama(e.target.value); clearErr('nama'); }}
                className={errDaftar.nama ? 'input-error' : ''}
              />
              <span className="field-error">{errDaftar.nama}</span>
            </div>
            <div className="field-group">
              <label htmlFor="reg-telp">No. Telepon</label>
              <input
                id="reg-telp" type="tel" autoComplete="tel" placeholder="08xxxxxxxxxx"
                value={telp} onChange={(e) => { setTelp(e.target.value); clearErr('telp'); }}
                className={errDaftar.telp ? 'input-error' : ''}
              />
              <span className="field-error">{errDaftar.telp}</span>
            </div>
            <div className="field-group">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email" type="email" autoComplete="email" placeholder="nama@email.com"
                value={email} onChange={(e) => { setEmail(e.target.value); clearErr('email'); }}
                className={errDaftar.email ? 'input-error' : ''}
              />
              <span className="field-error">{errDaftar.email}</span>
            </div>

            <button type="submit" className="btn-auth">Daftar &amp; Masuk</button>
            <p className="auth-note">
              Dengan mendaftar, kamu menyetujui <Link to="/privacy" target="_blank">Kebijakan Privasi</Link> kami.
            </p>
          </form>
        ) : (
          <form onSubmit={submitMasuk} noValidate className="auth-form">
            <h1>Masuk</h1>
            <p className="auth-desc">Pilih cara masuk yang kamu gunakan saat mendaftar.</p>

            <div className="auth-seg" role="radiogroup" aria-label="Metode masuk">
              <button
                type="button" role="radio" aria-checked={metode === 'telp'}
                className={metode === 'telp' ? 'active' : ''}
                onClick={() => { setMetode('telp'); setNilai(''); setErrMasuk(''); setNotFound(false); }}
              >
                No. Telepon
              </button>
              <button
                type="button" role="radio" aria-checked={metode === 'email'}
                className={metode === 'email' ? 'active' : ''}
                onClick={() => { setMetode('email'); setNilai(''); setErrMasuk(''); setNotFound(false); }}
              >
                Email
              </button>
            </div>

            <div className="field-group">
              <label htmlFor="login-nilai">{metode === 'telp' ? 'No. Telepon' : 'Email'}</label>
              <input
                id="login-nilai"
                type={metode === 'telp' ? 'tel' : 'email'}
                autoComplete={metode === 'telp' ? 'tel' : 'email'}
                placeholder={metode === 'telp' ? '08xxxxxxxxxx' : 'nama@email.com'}
                value={nilai}
                onChange={(e) => { setNilai(e.target.value); setErrMasuk(''); setNotFound(false); }}
                className={errMasuk || notFound ? 'input-error' : ''}
              />
              <span className="field-error">{errMasuk}</span>
            </div>

            {notFound && (
              <div className="auth-alert">
                Akun dengan {metode === 'telp' ? 'nomor telepon' : 'email'} ini belum terdaftar.{' '}
                <button type="button" className="auth-link" onClick={switchToDaftar}>Daftar sekarang</button>
              </div>
            )}

            <button type="submit" className="btn-auth">Masuk</button>
          </form>
        )}
      </div>
    </div>
  );
}
