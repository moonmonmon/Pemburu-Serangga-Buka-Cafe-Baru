import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getReservations, addReservation, updateReservation, getLayanan, todayStr } from '../lib/db';

const tableLimits = {
  'Meja Kecil': { min: 1, max: 2, label: 'Meja Kecil' },
  'Meja Standar': { min: 3, max: 4, label: 'Meja Standar' },
  'Meja Keluarga': { min: 5, max: 6, label: 'Meja Keluarga' },
  'Meja Besar': { min: 7, max: 8, label: 'Meja Besar' },
  'Meja Grup': { min: 9, max: 10, label: 'Meja Grup' },
  'Pesta / Event': { min: 11, max: 999, label: 'Pesta / Event' },
  'VIP Room': { min: 1, max: 999, label: 'VIP Room' }
};

const getToday = todayStr; // tanggal lokal (bukan UTC)

function getMinJamUntukTanggal(tanggal) {
  if (tanggal !== getToday()) return '08:00';
  const minMoment = new Date(Date.now() + 2 * 60 * 60 * 1000);
  let h = minMoment.getHours();
  let m = minMoment.getMinutes();
  if (h < 8) { h = 8; m = 0; }
  if (h >= 22) { h = 22; m = 0; }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function Reservation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Mode edit
  const [editId, setEditId] = useState(null);
  const backTo = location.state?.from || '/riwayat';
  // Staf (admin) yang mengubah data tidak terkena aturan 'minimal 2 jam ke depan' milik pelanggan
  const isStaffEdit = user.role !== 'pelanggan';

  // Form values
  const [nama, setNama] = useState('');
  const [orang, setOrang] = useState('');
  const [telp, setTelp] = useState('');
  const [tempat, setTempat] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [note, setNote] = useState('');

  // Table limitations
  const [mejaTerpilih, setMejaTerpilih] = useState(null);
  const [orangMin, setOrangMin] = useState(1);
  const [orangMax, setOrangMax] = useState(50);
  const [orangPlaceholder, setOrangPlaceholder] = useState('Contoh: 4');

  // Error messages
  const [errors, setErrors] = useState({
    nama: '',
    orang: '',
    telp: '',
    tempat: '',
    tanggal: '',
    jam: ''
  });

  useEffect(() => {
    // Detect if we are in Edit Mode
    if (location.state && location.state.editId) {
      const id = location.state.editId;
      setEditId(id);

      const item = getReservations().find((r) => r.id === id);

      // pelanggan hanya boleh mengubah reservasi miliknya sendiri
      if (!item || (user.role === 'pelanggan' && item.userId !== user.id)) {
        navigate(backTo, { replace: true });
        return;
      }

      if (item) {
        setNama(item.nama || '');
        setOrang(item.orang || '');
        setTelp(item.telp || '');
        setTempat(item.area || '');
        setTanggal(item.tanggal || '');
        setJam(item.jam || '');
        setNote(item.note || '');
        
        // Reconstruct table limits from the saved table label
        if (item.meja && tableLimits[item.meja]) {
          const limit = tableLimits[item.meja];
          setMejaTerpilih(limit);
          setOrangMin(limit.min);
          const maxVal = limit.max === 999 ? 50 : limit.max;
          setOrangMax(maxVal);
          setOrangPlaceholder(`${limit.min}–${limit.max === 999 ? '50+' : limit.max} orang`);
        }
      }
    } else {
      // Create Mode - isi otomatis dari data akun, lalu muat meja dari sessionStorage
      setNama((v) => v || user.nama || '');
      setTelp((v) => v || user.telp || '');
      const meja = JSON.parse(sessionStorage.getItem('mejaTerpilih') || 'null');
      if (meja) {
        setMejaTerpilih(meja);
        setOrangMin(meja.min);
        const maxVal = meja.max === 999 ? 50 : meja.max;
        setOrangMax(maxVal);
        setOrangPlaceholder(`${meja.min}–${meja.max === 999 ? '50+' : meja.max} orang`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Admin hanya boleh masuk untuk mengubah reservasi; reservasi baru bisa ditutup oleh admin/pemilik
  if (!location.state?.editId) {
    if (user.role === 'admin') return <Navigate to="/dashboard" replace />;
    if (!getLayanan().reservasi) return <Navigate to="/pilih-meja" replace />;
  }

  const validate = () => {
    const newErrors = { nama: '', orang: '', telp: '', tempat: '', tanggal: '', jam: '' };
    let isValid = true;

    // Nama validation
    if (nama.trim().length < 2) {
      newErrors.nama = 'Nama minimal 2 karakter.';
      isValid = false;
    }

    // Orang validation
    const intOrang = parseInt(orang);
    if (!orang || isNaN(intOrang) || intOrang < 1) {
      newErrors.orang = 'Jumlah orang tidak valid.';
      isValid = false;
    } else if (mejaTerpilih) {
      if (intOrang < mejaTerpilih.min || (mejaTerpilih.max !== 999 && intOrang > mejaTerpilih.max)) {
        const labelMax = mejaTerpilih.max === 999 ? '50+' : mejaTerpilih.max;
        newErrors.orang = `Untuk ${mejaTerpilih.label}: ${mejaTerpilih.min}–${labelMax} orang.`;
        isValid = false;
      }
    }

    // Telp validation
    if (!/^0[0-9]{8,12}$/.test(telp)) {
      newErrors.telp = 'Format: 08xxxxxxxxxx (9–13 digit).';
      isValid = false;
    }

    // Tempat validation
    if (!tempat) {
      newErrors.tempat = 'Pilih area terlebih dahulu.';
      isValid = false;
    }

    // Tanggal validation
    if (!tanggal) {
      newErrors.tanggal = 'Tanggal wajib diisi.';
      isValid = false;
    }

    // Jam validation
    if (!jam) {
      newErrors.jam = 'Jam wajib diisi.';
      isValid = false;
    } else {
      const jamNum = parseInt(jam.split(':')[0]);
      const minNum = parseInt(jam.split(':')[1]);
      if (jamNum < 8 || jamNum >= 22) {
        newErrors.jam = 'Jam operasional 08.00 – 22.00.';
        isValid = false;
      } else if (tanggal === getToday() && user.role === 'pelanggan') {
        const now = new Date();
        const minMoment = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours
        const chosen = new Date();
        chosen.setHours(jamNum, minNum, 0, 0);
        if (chosen < minMoment) {
          const h = minMoment.getHours().toString().padStart(2, '0');
          const m = minMoment.getMinutes().toString().padStart(2, '0');
          newErrors.jam = `Reservasi minimal 2 jam ke depan (mulai ${h}:${m}).`;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const reservationData = {
      nama: nama.trim(),
      orang: orang,
      telp: telp.trim(),
      area: tempat,
      tanggal: tanggal,
      jam: jam,
      note: note.trim(),
      meja: mejaTerpilih ? mejaTerpilih.label : null
    };

    if (editId !== null) {
      // Update existing reservation (id, pemilik & status tetap)
      updateReservation(editId, reservationData);

      // Redirect back with a success message
      navigate(backTo, { state: { successMessage: 'Data selesai diubah' } });
    } else {
      // Create new reservation (terkait dengan akun pelanggan)
      addReservation({ ...reservationData, userId: user.id });
      sessionStorage.removeItem('mejaTerpilih');
      navigate('/finish');
    }
  };

  return (
    <div className="form-page">
      <div className="form-heading">
        <p className="eyebrow">The Cups & Co</p>
        <h1>
          {editId !== null ? 'Edit' : 'Reservation'}
          <br />
          Form
        </h1>
        <div className="form-rule"></div>
        <p className="sub">
          {editId !== null 
            ? 'Ubah data reservasi kamu di bawah ini' 
            : 'Isi data diri kamu untuk melanjutkan reservasi'}
        </p>
      </div>

      {editId !== null && (
        <div className="border text-center" style={{ backgroundColor: '#fdf5eb', borderColor: '#ead8be', color: '#8d5115', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px', borderRadius: '4px', fontWeight: '600', padding: '12px' }}>
          Masukkan Perubahan
        </div>
      )}

      <form className="reservation-form" id="reservasiForm" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="nama">Nama Lengkap</label>
          <input 
            type="text" 
            id="nama" 
            placeholder="Masukkan nama kamu" 
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className={errors.nama ? 'input-error' : ''}
            required 
          />
          <span className="field-error" id="errNama">{errors.nama}</span>
        </div>

        <div className="row">
          <div className="field-group">
            <label htmlFor="orang">Jumlah Orang</label>
            <input 
              type="number" 
              id="orang" 
              placeholder={orangPlaceholder}
              min={orangMin}
              max={orangMax}
              value={orang}
              onChange={(e) => setOrang(e.target.value)}
              className={errors.orang ? 'input-error' : ''}
              required 
            />
            <span className="field-error" id="errOrang">{errors.orang}</span>
          </div>
          <div className="field-group">
            <label htmlFor="telp">No. Telepon</label>
            <input 
              type="tel" 
              id="telp" 
              placeholder="08xxxxxxxxxx" 
              value={telp}
              onChange={(e) => setTelp(e.target.value)}
              className={errors.telp ? 'input-error' : ''}
              required 
            />
            <span className="field-error" id="errTelp">{errors.telp}</span>
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="tempat">Area</label>
          <select 
            id="tempat" 
            value={tempat}
            onChange={(e) => setTempat(e.target.value)}
            className={errors.tempat ? 'input-error' : ''}
            required
          >
            <option value="">— Pilih Area —</option>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
            <option value="vip">VIP Room</option>
          </select>
          <span className="field-error" id="errTempat">{errors.tempat}</span>
        </div>

        <div className="row">
          <div className="field-group">
            <label htmlFor="tanggal">Tanggal</label>
            <input 
              type="date" 
              id="tanggal" 
              min={isStaffEdit ? undefined : getToday()}
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className={errors.tanggal ? 'input-error' : ''}
              required 
            />
            <span className="field-error" id="errTanggal">{errors.tanggal}</span>
          </div>
          <div className="field-group">
            <label htmlFor="jam">
              Jam{' '}
              <span style={{ color: '#9a826a', fontSize: '0.78rem' }}>
                {isStaffEdit
                  ? '(08.00 – 22.00)'
                  : tanggal === getToday()
                    ? `(hari ini, mulai ${getMinJamUntukTanggal(tanggal)})`
                    : '(min. 2 jam ke depan)'}
              </span>
            </label>
            <input 
              type="time" 
              id="jam" 
              min={isStaffEdit ? '08:00' : getMinJamUntukTanggal(tanggal)} 
              max="22:00" 
              value={jam}
              onChange={(e) => setJam(e.target.value)}
              className={errors.jam ? 'input-error' : ''}
              required 
            />
            <span className="field-error" id="errJam">{errors.jam}</span>
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="note">Catatan Tambahan</label>
          <textarea 
            id="note" 
            placeholder="Ada permintaan khusus? Tulis di sini..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn-reserve">
          {editId !== null ? 'Simpan Perubahan' : 'Reserve Sekarang'}
        </button>
      </form>
    </div>
  );
}
