import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ROLE_LABEL, ROLE_ACCESS } from '../lib/roles';
import {
  updateUser, getReservationsByUser, getAllTickets, fmtTanggal,
} from '../lib/db';

export default function Akun() {
  const { user, logout, refresh } = useAuth();
  const navigate = useNavigate();
  const isPelanggan = user.role === 'pelanggan';

  const [editing, setEditing] = useState(false);
  const [nama, setNama] = useState(user.nama);
  const [telp, setTelp] = useState(user.telp || '');
  const [email, setEmail] = useState(user.email || '');
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const totalReservasi = isPelanggan ? getReservationsByUser(user.id).length : 0;
  const totalAntrian = isPelanggan ? getAllTickets().filter((t) => t.userId === user.id).length : 0;

  const handleLogout = () => {
    logout();
    navigate('/masuk', { replace: true });
  };

  const startEdit = () => {
    setNama(user.nama); setTelp(user.telp); setEmail(user.email);
    setErrors({}); setSaved(false); setEditing(true);
  };

  const save = (e) => {
    e.preventDefault();
    const res = updateUser(user.id, { nama, telp, email });
    if (!res.ok) {
      setErrors(res.errors);
      return;
    }
    refresh();
    setEditing(false);
    setSaved(true);
  };

  const initial = (user.nama || '?').trim().charAt(0).toUpperCase();

  return (
    <div>
      <div className="page-title">
        <h1>Akun Saya</h1>
        <p>{ROLE_LABEL[user.role]}</p>
      </div>

      <div className="akun-wrap">
        <div className="akun-card">
          <div className="akun-head">
            <div className="akun-avatar" aria-hidden="true">{initial}</div>
            <div>
              <h2>{user.nama}</h2>
              <span className={`role-badge role-${user.role}`}>{ROLE_LABEL[user.role]}</span>
            </div>
          </div>

          {saved && <div className="flash-ok">✓ Data akun berhasil diperbarui</div>}

          {editing ? (
            <form className="reservation-form" onSubmit={save} noValidate>
              <div className="field-group">
                <label htmlFor="ak-nama">Nama Lengkap</label>
                <input id="ak-nama" value={nama} onChange={(e) => setNama(e.target.value)}
                  className={errors.nama ? 'input-error' : ''} />
                <span className="field-error">{errors.nama}</span>
              </div>
              <div className="field-group">
                <label htmlFor="ak-telp">No. Telepon</label>
                <input id="ak-telp" type="tel" value={telp} onChange={(e) => setTelp(e.target.value)}
                  className={errors.telp ? 'input-error' : ''} />
                <span className="field-error">{errors.telp}</span>
              </div>
              <div className="field-group">
                <label htmlFor="ak-email">Email</label>
                <input id="ak-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'input-error' : ''} />
                <span className="field-error">{errors.email}</span>
              </div>
              <div className="akun-actions">
                <button type="submit" className="btn-reserve">Simpan</button>
                <button type="button" className="btn-outline" onClick={() => setEditing(false)}>Batal</button>
              </div>
            </form>
          ) : (
            <>
              <dl className="akun-list">
                {isPelanggan ? (
                  <>
                    <div><dt>ID Pelanggan</dt><dd>{user.id}</dd></div>
                    <div><dt>Nama</dt><dd>{user.nama}</dd></div>
                    <div><dt>No. Telepon</dt><dd>{user.telp}</dd></div>
                    <div><dt>Email</dt><dd>{user.email}</dd></div>
                    <div><dt>Bergabung sejak</dt><dd>{fmtTanggal(user.dibuat?.slice(0, 10))}</dd></div>
                    <div><dt>Total reservasi</dt><dd>{totalReservasi}</dd></div>
                    <div><dt>Total nomor antrian diambil</dt><dd>{totalAntrian}</dd></div>
                  </>
                ) : (
                  <>
                    <div><dt>ID Staf</dt><dd>{user.id}</dd></div>
                    <div><dt>Nama</dt><dd>{user.nama}</dd></div>
                    <div><dt>Peran</dt><dd>{ROLE_LABEL[user.role]}</dd></div>
                  </>
                )}
              </dl>

              <div className="akun-access">
                <h3>Akses {ROLE_LABEL[user.role]}</h3>
                <ul>
                  {ROLE_ACCESS[user.role].map((a) => <li key={a}>{a}</li>)}
                </ul>
              </div>

              <div className="akun-actions">
                {isPelanggan && (
                  <button type="button" className="btn-reserve" onClick={startEdit}>Ubah Data</button>
                )}
                <button type="button" className="btn-outline btn-outline-danger" onClick={handleLogout}>
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
