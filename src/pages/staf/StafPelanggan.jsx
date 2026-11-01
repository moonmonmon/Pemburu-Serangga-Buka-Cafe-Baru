import React, { useState } from 'react';
import { getUsers, getReservations, getAllTickets, fmtTanggal } from '../../lib/db';

export default function StafPelanggan() {
  const [q, setQ] = useState('');
  const users = getUsers();
  const rsv = getReservations();
  const tix = getAllTickets();

  const s = q.trim().toLowerCase();
  const rows = users.filter((u) => !s || `${u.nama} ${u.telp} ${u.email} ${u.id}`.toLowerCase().includes(s));

  return (
    <div>
      <div className="page-title">
        <h1>Data Pelanggan</h1>
        <p>Pelanggan yang sudah terdaftar</p>
      </div>

      <div className="riwayat-section">
        <div className="toolbar">
          <input type="search" placeholder="Cari nama / telepon / email" value={q}
            onChange={(e) => setQ(e.target.value)} aria-label="Cari pelanggan" />
          <span className="toolbar-count">{rows.length} dari {users.length} pelanggan</span>
        </div>

        {rows.length === 0 ? (
          <div className="riwayat-empty" style={{ display: 'flex' }}>
            <div className="empty-icon">👥</div>
            <p>{users.length === 0 ? 'Belum ada pelanggan terdaftar' : 'Tidak ada pelanggan yang cocok'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="riwayat-table">
              <thead>
                <tr><th>ID</th><th>Nama</th><th>No. Telepon</th><th>Email</th><th>Bergabung</th><th>Reservasi</th><th>Antrian</th></tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="cell-strong">{u.nama}</td>
                    <td>{u.telp}</td>
                    <td>{u.email}</td>
                    <td>{fmtTanggal(u.dibuat?.slice(0, 10))}</td>
                    <td>{rsv.filter((r) => r.userId === u.id).length}</td>
                    <td>{tix.filter((t) => t.userId === u.id).length}</td>
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
