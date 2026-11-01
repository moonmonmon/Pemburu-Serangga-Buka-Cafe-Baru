import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getAllTickets, getAntrian, fmtTanggal, fmtJam } from '../lib/db';

export default function QueueTicket() {
  const { user } = useAuth();
  const location = useLocation();

  const all = getAllTickets();
  const byId = location.state?.ticketId && all.find((t) => t.id === location.state.ticketId);
  const mine = all.filter((t) => t.userId === user.id).sort((a, b) => b.waktu.localeCompare(a.waktu));
  const tiket = byId || mine[0] || null;

  const handlePrint = () => {
    window.print();
  };

  if (!tiket) {
    return (
      <div className="struk-wrap">
        <div className="struk">
          <p className="struk-msg">Kamu belum mengambil nomor antrian.</p>
          <Link to="/antrian" className="btn-back-antrian">← Ambil Nomor</Link>
        </div>
      </div>
    );
  }

  const tanggal = new Date(tiket.waktu).toLocaleDateString('id-ID', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });
  const total = tiket.tanggal === getAntrian().tanggal ? getAntrian().counter : tiket.nomor;

  return (
    <div className="struk-wrap">
      <div className="struk">
        {/* Header struk */}
        <div className="struk-header">
          <img src="/assets/images/logo.png" alt="Logo" className="struk-logo" />
          <h2>The Cups &amp; Co</h2>
          <p className="struk-sub">Specialty Coffee · Medan</p>
          <p className="struk-address">Jl. Gunung Krakatau No.25A, Medan</p>
        </div>

        <div className="struk-line dashed"></div>

        {/* Info waktu */}
        <div className="struk-meta">
          <div className="struk-meta-row">
            <span>Tanggal</span>
            <span id="struktanggal">{tanggal || fmtTanggal(tiket.tanggal)}</span>
          </div>
          <div className="struk-meta-row">
            <span>Waktu Ambil</span>
            <span id="strukjam">{fmtJam(tiket.waktu)}</span>
          </div>
          <div className="struk-meta-row">
            <span>Atas Nama</span>
            <span>{tiket.nama}</span>
          </div>
          <div className="struk-meta-row">
            <span>Total Antrian Hari Ini</span>
            <span id="totalAntrian">{total}</span>
          </div>
        </div>

        <div className="struk-line dashed"></div>

        {/* Nomor besar */}
        <p className="struk-label-no">Nomor Antrian Anda</p>
        <div className="nomor">
          <h1 id="nomorAntrian">{tiket.no}</h1>
        </div>

        <div className="struk-line dashed"></div>

        {/* Pesan */}
        <p className="struk-msg">Silakan menunggu giliran Anda<br />di area yang telah disediakan.</p>
        <p className="struk-thanks">Terima kasih telah berkunjung ☕</p>

        <div className="struk-line solid"></div>

        <p className="struk-footer-note">*Nomor antrian hanya berlaku hari ini<br />dan akan direset esok hari.</p>

        {/* Tombol cetak */}
        <button className="btn-print" onClick={handlePrint}>🖨 Cetak Struk</button>

        <Link to="/antrian" className="btn-back-antrian">← Kembali</Link>
      </div>
    </div>
  );
}
