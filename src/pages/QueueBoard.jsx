import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  getAntrian, getServing, getTicketsToday, ambilNomor, ticketNo, getLayanan,
} from '../lib/db';

function snapshot(userId) {
  const a = getAntrian();
  const serving = getServing();
  const mine = getTicketsToday()
    .filter((t) => t.userId === userId && (t.status === 'Menunggu' || t.status === 'Dilayani'))
    .sort((x, y) => y.nomor - x.nomor)[0] || null;
  const ahead = mine && mine.status === 'Menunggu'
    ? getTicketsToday().filter((t) => t.status === 'Menunggu' && t.nomor < mine.nomor).length
    : 0;
  return { counter: a.counter, serving, mine, ahead };
}

export default function QueueBoard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [snap, setSnap] = useState(() => snapshot(user.id));
  const open = getLayanan().antrian;

  useEffect(() => {
    const refresh = () => setSnap(snapshot(user.id));
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [user.id]);

  const ambil = () => {
    const tiket = ambilNomor(user);
    navigate('/struk', { state: { ticketId: tiket.id } });
  };

  return (
    <div className="container antrian-container">
      <div className="antrian-board">
        <p className="antrian-eyebrow">☕ The Cups & Co</p>
        <h2>Antrian Cafe</h2>
        <p className="sub-antrian">Ambil nomor &amp; tunggu giliran dengan nyaman</p>

        <div className="antrian-status-card">
          <span className="antrian-status-label">Sedang Dilayani</span>
          <span className="antrian-status-num" id="antrianInfo">
            {snap.serving ? snap.serving.no : '—'}
          </span>
          <span className="antrian-status-label">
            {snap.counter ? `Nomor terakhir diambil: ${ticketNo(snap.counter)}` : 'Belum ada antrian hari ini'}
          </span>
        </div>

        {snap.mine && (
          <p className="antrian-mine">
            Nomor kamu <strong>{snap.mine.no}</strong>
            {snap.mine.status === 'Dilayani'
              ? ' — sekarang giliranmu!'
              : ` — ${snap.ahead} antrian lagi sebelum kamu`}
          </p>
        )}

        {open ? (
          <button className="btn-ambil" onClick={ambil}>
            Ambil Nomor Antrian
          </button>
        ) : (
          <p className="antrian-closed">Antrian digital sedang ditutup oleh pihak cafe.</p>
        )}

        <p className="antrian-note">Antrian direset otomatis setiap hari</p>
      </div>
    </div>
  );
}
