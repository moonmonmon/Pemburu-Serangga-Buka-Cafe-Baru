import React from 'react';
import { Link } from 'react-router-dom';

export default function ComingSoon() {
  return (
    <div className="finish-page">
      <div className="home-photos"></div>
      <div className="home-fades"></div>
      <div className="finish-card">
        <div className="check">🚧</div>

        <p className="eyebrow">The Cups & Co</p>

        <h1>Fitur Ini Sedang<br />Dalam Pengembangan</h1>

        <div className="divider"></div>

        <p style={{ fontSize: '17px', color: '#c9973a' }}>
          <strong>
            Halaman yang kamu tuju belum tersedia saat ini.<br />
            Kami sedang menyiapkannya untuk pengalaman yang lebih baik.<br />
          </strong>
          <em style={{ fontWeight: 'bold', fontSize: '20px' }}>Stay tuned ya!</em>
        </p>

        <Link to="/" className="btn-home">Kembali ke Beranda</Link>

        <p className="finish-brand">The Cups & Co · Specialty Coffee · Medan</p>
      </div>
    </div>
  );
}
