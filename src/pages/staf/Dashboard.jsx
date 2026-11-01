import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { MENU, MENU_INFO, ROLE_LABEL, can } from '../../lib/roles';
import {
  getReservations, getUsers, getAntrian, getTicketsToday, getServing, getAllTickets, todayStr,
} from '../../lib/db';

const AREA_LABEL = { indoor: 'Indoor', outdoor: 'Outdoor', vip: 'VIP Room' };

function lastDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    out.push({ key, label: d.toLocaleDateString('id-ID', { weekday: 'short' }) });
  }
  return out;
}

function countBy(list, fn) {
  const m = {};
  list.forEach((x) => { const k = fn(x) || '—'; m[k] = (m[k] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

function DistRows({ rows }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  if (!rows.length) return <p className="muted">Belum ada data.</p>;
  return (
    <div className="dist">
      {rows.map(([label, n]) => (
        <div className="dist-row" key={label}>
          <span className="dist-label">{label}</span>
          <span className="dist-track"><span style={{ width: `${(n / max) * 100}%` }} /></span>
          <span className="dist-val">{n}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const today = todayStr();
  const reservasi = getReservations();
  const rsvHariIni = reservasi.filter((r) => r.tanggal === today);
  const menunggu = rsvHariIni.filter((r) => r.status === 'Menunggu').length;
  const antrian = getAntrian();
  const dilayani = getServing();
  const menungguAntrian = getTicketsToday().filter((t) => t.status === 'Menunggu').length;

  const shortcuts = MENU[user.role].filter((m) => MENU_INFO[m.to]);
  const showLaporan = can(user.role, 'laporan.lihat');

  const days = lastDays(7).map((d) => ({ ...d, n: reservasi.filter((r) => r.tanggal === d.key).length }));
  const maxDay = Math.max(1, ...days.map((d) => d.n));

  return (
    <div>
      <div className="page-title">
        <h1>Dashboard</h1>
        <p>{ROLE_LABEL[user.role]} · {user.id}</p>
      </div>

      <div className="riwayat-section">
        <p className="section-eyebrow">Ringkasan hari ini</p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-num">{rsvHariIni.length}</span>
            <span className="stat-label">Reservasi hari ini</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{menunggu}</span>
            <span className="stat-label">Belum hadir</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{dilayani ? dilayani.no : '—'}</span>
            <span className="stat-label">Sedang dilayani</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{antrian.counter}</span>
            <span className="stat-label">Antrian diambil ({menungguAntrian} menunggu)</span>
          </div>
        </div>

        <p className="section-eyebrow" style={{ marginTop: 40 }}>Menu</p>
        <div className="quick-grid">
          {shortcuts.map((m) => (
            <Link to={m.to} className="quick-card" key={m.to}>
              <h3>{m.label}</h3>
              <p>{MENU_INFO[m.to]}</p>
            </Link>
          ))}
        </div>

        {showLaporan && (
          <>
            <p className="section-eyebrow" style={{ marginTop: 40 }}>Laporan</p>
            <div className="stat-grid">
              <div className="stat-card">
                <span className="stat-num">{reservasi.length}</span>
                <span className="stat-label">Total reservasi</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">{getAllTickets().length}</span>
                <span className="stat-label">Total nomor antrian</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">{getUsers().length}</span>
                <span className="stat-label">Pelanggan terdaftar</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">{reservasi.filter((r) => r.status === 'Selesai').length}</span>
                <span className="stat-label">Reservasi selesai</span>
              </div>
            </div>

            <div className="panel-grid">
              <div className="panel">
                <h3>Reservasi 7 hari terakhir</h3>
                <div className="bars">
                  {days.map((d) => (
                    <div className="bar-col" key={d.key}>
                      <span className="bar-val">{d.n}</span>
                      <div className="bar" style={{ height: `${(d.n / maxDay) * 100}%` }} />
                      <span className="bar-label">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel">
                <h3>Berdasarkan area</h3>
                <DistRows rows={countBy(reservasi, (r) => AREA_LABEL[r.area] || r.area)} />
                <h3 style={{ marginTop: 24 }}>Berdasarkan status</h3>
                <DistRows rows={countBy(reservasi, (r) => r.status)} />
              </div>
              <div className="panel">
                <h3>Jenis meja terpopuler</h3>
                <DistRows rows={countBy(reservasi, (r) => r.meja)} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
