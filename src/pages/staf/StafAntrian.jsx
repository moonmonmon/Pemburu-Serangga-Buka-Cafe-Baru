import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { can } from '../../lib/roles';
import {
  getAntrian, getAllTickets, getTicketsToday, getServing, panggilBerikutnya, resetAntrian,
  ticketNo, fmtTanggal, fmtJam, todayStr,
} from '../../lib/db';

export default function StafAntrian() {
  const { user } = useAuth();
  const [, setTick] = useState(0);
  const [lingkup, setLingkup] = useState('Hari ini');
  const [msg, setMsg] = useState('');
  const refresh = () => setTick((t) => t + 1);

  // sinkron jika data berubah dari tab lain (mis. pelanggan mengambil nomor)
  useEffect(() => {
    const on = (e) => { if (!e.key || e.key.startsWith('antrian')) refresh(); };
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);

  const canPanggil = can(user.role, 'antrian.panggil');
  const canReset = can(user.role, 'antrian.reset');

  const a = getAntrian();
  const serving = getServing();
  const hari = getTicketsToday();
  const menunggu = hari.filter((t) => t.status === 'Menunggu').length;

  const panggil = () => {
    const t = panggilBerikutnya();
    setMsg(t ? `Memanggil ${t.no} — ${t.nama}` : 'Tidak ada antrian yang menunggu.');
    refresh();
  };
  const reset = () => {
    if (window.confirm('Reset semua antrian hari ini? Nomor akan mulai dari A001 kembali.')) {
      resetAntrian();
      setMsg('Antrian berhasil direset ke A001');
      refresh();
    }
  };

  const today = todayStr();
  const rows = (lingkup === 'Hari ini' ? getAllTickets().filter((t) => t.tanggal === today) : getAllTickets())
    .slice()
    .sort((x, y) => y.waktu.localeCompare(x.waktu))
    .slice(0, 200);

  return (
    <div>
      <div className="page-title">
        <h1>Antrian</h1>
        <p>{canReset ? 'Kelola antrian' : 'Panggil & pantau antrian'}</p>
      </div>

      <div className="riwayat-section">
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-num">{serving ? serving.no : '—'}</span>
            <span className="stat-label">Sedang dilayani</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{menunggu}</span>
            <span className="stat-label">Menunggu</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{a.counter ? ticketNo(a.counter) : '—'}</span>
            <span className="stat-label">Nomor terakhir diambil</span>
          </div>
        </div>

        {(canPanggil || canReset) && (
          <div className="toolbar" style={{ marginTop: 24 }}>
            {canPanggil && (
              <button className="btn-reserve btn-inline" onClick={panggil}>Panggil Berikutnya</button>
            )}
            {canReset && (
              <button className="btn-outline btn-outline-danger" onClick={reset}>Reset Antrian Hari Ini</button>
            )}
            {msg && <span className="toolbar-count">{msg}</span>}
          </div>
        )}

        <div className="riwayat-header" style={{ marginTop: 36 }}>
          <p className="section-eyebrow">Riwayat antrian</p>
          <select className="status-select" value={lingkup} onChange={(e) => setLingkup(e.target.value)} aria-label="Lingkup riwayat">
            <option>Hari ini</option>
            <option>Semua</option>
          </select>
        </div>

        {rows.length === 0 ? (
          <div className="riwayat-empty" style={{ display: 'flex' }}>
            <div className="empty-icon">🎟️</div>
            <p>Belum ada nomor antrian</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="riwayat-table">
              <thead>
                <tr><th>Nomor</th><th>Nama</th><th>Tanggal</th><th>Jam Ambil</th><th>Status</th></tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id}>
                    <td><strong>{t.no}</strong></td>
                    <td className="cell-strong">{t.nama}</td>
                    <td>{fmtTanggal(t.tanggal)}</td>
                    <td>{fmtJam(t.waktu)}</td>
                    <td><span className={`status-badge st-${t.status}`}>{t.status}</span></td>
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
