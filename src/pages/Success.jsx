import React from 'react';
import { Link } from 'react-router-dom';

export default function Success() {
  return (
    <div className="finish-page">
      <div className="home-photos"></div>
      <div className="home-fades"></div>
      <div className="finish-card">
        <div className="check">✓</div>

        <p className="eyebrow">The Cups & Co</p>

        <h1>Selamat! Kamu telah berhasil<br />melakukan reservasi</h1>

        <div className="divider"></div>

        <p>
          Kami tunggu kehadiran anda di<br />
          <em>The Cups & Co</em><br />
          — Thank You! —
        </p>

        <Link to="/" className="btn-home">Kembali ke Beranda</Link>

        <p className="finish-brand">The Cups & Co · Specialty Coffee · Medan</p>
      </div>
    </div>
  );
}
