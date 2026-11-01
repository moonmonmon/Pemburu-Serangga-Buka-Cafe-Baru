import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { can } from '../../lib/roles';
import {
  getReservations, updateReservation, deleteReservation, fmtTanggal, todayStr, STATUS_RESERVASI,
} from '../../lib/db';

const AREA_LABEL = { indoor: 'Indoor', outdoor: 'Outdoor', vip: 'VIP Room' };

export default function StafReservasi() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [list, setList] = useState(() => getReservations());
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('Semua');
  const [waktu, setWaktu] = useState('Semua');
  const [flash, setFlash] = useState(location.state?.successMessage || '');

  const canCheckin = can(user.role, 'reservasi.checkin');
  const canStatus = can(user.role, 'reservasi.status');
  const canEdit = can(user.role, 'reservasi.ubah');
  const canDelete = can(user.role, 'reservasi.hapus');
  const hasAksi = canCheckin || canEdit || canDelete;

  const reload = () => setList(getReservations());

  const setStatusRsv = (id, s) => { updateReservation(id, { status: s }); reload(); };
  const hapus = (item) => {
    if (window.confirm(`Hapus reservasi atas nama ${item.nama}?`)) {
      deleteReservation(item.id);
      reload();
    }
  };

  const today = todayStr();
  const rows = list
    .filter((r) => {
      if (status !== 'Semua' && r.status !== status) return false;
      if (waktu === 'Hari ini' && r.tanggal !== today) return false;
      if (waktu === 'Mendatang' && !(r.tanggal >= today)) return false;
      const s = q.trim().toLowerCase();
      if (s && !(`${r.nama} ${r.telp}`.toLowerCase().includes(s))) return false;
      return true;
    })
    .sort((a, b) => `${a.tanggal} ${a.jam}`.localeCompare(`${b.tanggal} ${b.jam}`));

  return (
    <div>
      <div className="page-title">
        <h1>Data Reservasi</h1>
        <p>{canStatus ? 'Kelola reservasi pelanggan' : 'Pantau kedatangan pelanggan'}</p>
      </div>

      <div className="riwayat-section">
        {flash && <div className="flash-ok">✓ {flash}</div>}

        <div className="toolbar">
          <input
            type="search" placeholder="Cari nama / no. telepon" value={q}
            onChange={(e) => setQ(e.target.value)} aria-label="Cari reservasi"
          />
          <select value={waktu} onChange={(e) => setWaktu(e.target.value)} aria-label="Filter waktu">
            <option value="Semua">Semua tanggal</option>
            <option value="Hari ini">Hari ini</option>
            <option value="Mendatang">Hari ini dan mendatang</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter status">
            <option value="Semua">Semua status</option>
            {STATUS_RESERVASI.map((s) => <option key={s}>{s}</option>)}
          </select>
          <span className="toolbar-count">{rows.length} dari {list.length} reservasi</span>
        </div>

        {rows.length === 0 ? (
          <div className="riwayat-empty" style={{ display: 'flex' }}>
            <div className="empty-icon">📋</div>
            <p>{list.length === 0 ? 'Belum ada reservasi masuk' : 'Tidak ada reservasi yang cocok dengan filter'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="riwayat-table">
              <thead>
                <tr>
                  <th>Nama</th><th>Orang</th><th>No. Telepon</th><th>Area</th><th>Meja</th>
                  <th>Tanggal</th><th>Jam</th><th>Catatan</th><th>Status</th>
                  {hasAksi && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="cell-strong">{r.nama || '-'}</td>
                    <td>{r.orang || '-'}</td>
                    <td>{r.telp || '-'}</td>
                    <td><span className={`area-badge area-${r.area}`}>{AREA_LABEL[r.area] || r.area}</span></td>
                    <td>{r.meja || '-'}</td>
                    <td>{fmtTanggal(r.tanggal)}</td>
                    <td>{r.jam || '-'}</td>
                    <td>{r.note || '—'}</td>
                    <td>
                      {canStatus ? (
                        <select
                          className="status-select" value={r.status}
                          onChange={(e) => setStatusRsv(r.id, e.target.value)}
                          aria-label={`Status reservasi ${r.nama}`}
                        >
                          {STATUS_RESERVASI.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className={`status-badge st-${r.status}`}>{r.status}</span>
                      )}
                    </td>
                    {hasAksi && (
                      <td>
                        <div className="aksi-buttons">
                          {canCheckin && !canStatus && r.status === 'Menunggu' && (
                            <button className="btn-mini" onClick={() => setStatusRsv(r.id, 'Hadir')}>Tandai Hadir</button>
                          )}
                          {canCheckin && !canStatus && r.status === 'Hadir' && (
                            <button className="btn-mini" onClick={() => setStatusRsv(r.id, 'Selesai')}>Selesai</button>
                          )}
                          {canEdit && (
                            <button
                              className="btn-mini"
                              onClick={() => navigate('/reservasi', { state: { editId: r.id, from: '/staf/reservasi' } })}
                            >
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button className="btn-hapus-row" onClick={() => hapus(r)}>Hapus</button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
