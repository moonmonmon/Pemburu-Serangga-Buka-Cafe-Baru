import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getReservationsByUser, deleteReservation, deleteReservationsByUser } from '../lib/db';

export default function History() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const loadReservations = () => {
    setReservations(getReservationsByUser(user.id));
  };

  useEffect(() => {
    loadReservations();
    
    // Check for success message from edit redirect
    if (location.state && location.state.successMessage) {
      setSuccessMsg(location.state.successMessage);
      // Clear location state to avoid showing it again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleEdit = (id) => {
    navigate('/reservasi', { state: { editId: id } });
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus reservasi ini?')) {
      deleteReservation(id);
      setReservations(getReservationsByUser(user.id));
    }
  };

  const hapusSemua = () => {
    if (window.confirm('Yakin ingin menghapus semua riwayat reservasi?')) {
      deleteReservationsByUser(user.id);
      setReservations([]);
    }
  };

  const getAreaLabel = (area) => {
    if (area === 'indoor') return 'Indoor';
    if (area === 'outdoor') return 'Outdoor';
    return 'VIP Room';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  const hasReservations = reservations.length > 0;

  return (
    <div>
      <div className="page-title">
        <h1>Riwayat Reservasi</h1>
        <p>Data reservasi yang telah dilakukan</p>
      </div>

      <div className="riwayat-section">
        {successMsg && (
          <div className="border text-center" style={{ backgroundColor: '#e8f5e9', borderColor: '#c8e6c9', color: '#2e7d32', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.95rem', letterSpacing: '1px', fontWeight: '500' }}>
            ✓ {successMsg}
          </div>
        )}

        {hasReservations && (
          <div className="riwayat-header">
            <p className="section-eyebrow">Reservasi atas akun kamu</p>
            <button className="btn-hapus" id="btnHapus" onClick={hapusSemua}>
              Hapus Semua
            </button>
          </div>
        )}

        {hasReservations ? (
          <div className="table-wrapper">
            <table className="riwayat-table" id="riwayatTable">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Jumlah Orang</th>
                  <th>No. Telepon</th>
                  <th>Area</th>
                  <th>Meja</th>
                  <th>Tanggal</th>
                  <th>Jam</th>
                  <th>Catatan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.nama || '-'}</td>
                    <td>{item.orang || '-'} orang</td>
                    <td>{item.telp || '-'}</td>
                    <td>
                      <span className={`area-badge area-${item.area}`}>
                        {getAreaLabel(item.area)}
                      </span>
                    </td>
                    <td>{item.meja || '-'}</td>
                    <td>{formatDate(item.tanggal)}</td>
                    <td>{item.jam || '-'}</td>
                    <td>{item.note || '—'}</td>
                    <td><span className={`status-badge st-${item.status}`}>{item.status}</span></td>
                    <td>
                      <div className="aksi-buttons">
                        <button
                          className="btn-edit"
                          disabled={item.status !== 'Menunggu'}
                          title={item.status !== 'Menunggu' ? 'Reservasi ini sudah diproses' : undefined}
                          style={{
                            opacity: item.status !== 'Menunggu' ? 0.4 : 1,
                            padding: '5px 12px',
                            background: 'transparent',
                            border: '1px solid #c9973a',
                            color: '#c9973a',
                            borderRadius: '3px',
                            fontFamily: '"Jost", sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'background 0.2s, color 0.2s'
                          }}
                          onClick={() => handleEdit(item.id)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-hapus-row"
                          onClick={() => handleDelete(item.id)}
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="riwayat-empty" id="riwayatEmpty" style={{ display: 'flex' }}>
            <div className="empty-icon">📋</div>
            <p>Belum ada riwayat reservasi</p>
            <Link to="/pilih-meja" className="btn-home" style={{ marginTop: '16px' }}>
              Buat Reservasi
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
