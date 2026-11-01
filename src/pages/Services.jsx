import React from 'react';
import { Link } from 'react-router-dom';
import { getLayanan } from '../lib/db';

export default function Services() {
  const cfg = getLayanan();

  return (
    <div>
      <div className="page-title">
        <h1>Apa yang kamu butuhkan?</h1>
        <p>Pilih layanan di bawah ini</p>
      </div>

      <div className="services">
        <div className="services-grid">
          {cfg.antrian ? (
            <Link to="/antrian" className="service-card">
              <div className="icon-wrap">☕</div>
              <h2>Antrian</h2>
              <p>
                Ambil nomor antrian kamu disini dan tunggu giliran dengan nyaman.
              </p>
              <span className="cta">Ambil Nomor →</span>
            </Link>
          ) : (
            <div className="service-card disabled" aria-disabled="true">
              <div className="icon-wrap">☕</div>
              <h2>Antrian</h2>
              <p>Antrian digital sedang tidak tersedia. Silakan hubungi staf di cafe.</p>
              <span className="cta">Sedang ditutup</span>
            </div>
          )}

          {cfg.reservasi ? (
            <Link to="/pilih-meja" className="service-card">
              <div className="icon-wrap">🪑</div>
              <h2>Reservasi</h2>
              <p>
                Reservasi meja kamu sekarang dan pastikan tempat duduk favoritmu tersedia.
              </p>
              <span className="cta">Pesan Meja →</span>
            </Link>
          ) : (
            <div className="service-card disabled" aria-disabled="true">
              <div className="icon-wrap">🪑</div>
              <h2>Reservasi</h2>
              <p>Reservasi baru sedang tidak dibuka. Silakan hubungi staf di cafe.</p>
              <span className="cta">Sedang ditutup</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
