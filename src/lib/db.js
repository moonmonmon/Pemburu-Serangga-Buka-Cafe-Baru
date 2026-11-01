// Lapisan data sederhana berbasis localStorage.
// (Semua halaman membaca/menulis lewat file ini supaya mudah diganti ke API nanti.)

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const uid = (prefix) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
const pad = (n, len = 3) => String(n).padStart(len, '0');

// ─── TANGGAL ────────────────────────────────────────────────────────────
export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1, 2)}-${pad(d.getDate(), 2)}`;
}
export function fmtTanggal(dateStr) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
export function fmtJam(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}
export function fmtTanggalJam(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    + ', ' + fmtJam(iso);
}

// ─── SESI LOGIN ─────────────────────────────────────────────────────────
export const readSession = () => read('sesi', null);
export const writeSession = (s) => (s ? write('sesi', s) : localStorage.removeItem('sesi'));

// ─── PELANGGAN ──────────────────────────────────────────────────────────
export const getUsers = () => read('pelangganUsers', []);

export function normalizePhone(v) {
  let s = String(v || '').replace(/[\s\-().]/g, '');
  if (s.startsWith('+62')) s = '0' + s.slice(3);
  else if (s.startsWith('62')) s = '0' + s.slice(2);
  return s;
}
export const isValidPhone = (s) => /^0[0-9]{8,12}$/.test(s);
export const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export function validateProfile({ nama, telp, email }, excludeId = null) {
  const errors = {};
  const users = getUsers().filter((u) => u.id !== excludeId);
  const phone = normalizePhone(telp);
  const mail = String(email || '').trim().toLowerCase();

  if (String(nama || '').trim().length < 2) errors.nama = 'Nama minimal 2 karakter.';
  if (!isValidPhone(phone)) errors.telp = 'Format: 08xxxxxxxxxx (9–13 digit).';
  else if (users.some((u) => u.telp === phone)) errors.telp = 'Nomor telepon sudah terdaftar.';
  if (!isValidEmail(mail)) errors.email = 'Format email tidak valid.';
  else if (users.some((u) => u.email === mail)) errors.email = 'Email sudah terdaftar.';
  return errors;
}

export function registerUser({ nama, telp, email }) {
  const errors = validateProfile({ nama, telp, email });
  if (Object.keys(errors).length) return { ok: false, errors };
  const users = getUsers();
  const user = {
    id: 'PLG-' + pad(users.length + 1, 4),
    nama: nama.trim(),
    telp: normalizePhone(telp),
    email: email.trim().toLowerCase(),
    dibuat: new Date().toISOString(),
  };
  write('pelangganUsers', [...users, user]);
  return { ok: true, user };
}

export function findUser(metode, nilai) {
  const users = getUsers();
  if (metode === 'telp') {
    const p = normalizePhone(nilai);
    return users.find((u) => u.telp === p) || null;
  }
  const m = String(nilai || '').trim().toLowerCase();
  return users.find((u) => u.email === m) || null;
}

export function updateUser(id, { nama, telp, email }) {
  const errors = validateProfile({ nama, telp, email }, id);
  if (Object.keys(errors).length) return { ok: false, errors };
  const users = getUsers().map((u) =>
    u.id === id
      ? { ...u, nama: nama.trim(), telp: normalizePhone(telp), email: email.trim().toLowerCase() }
      : u
  );
  write('pelangganUsers', users);
  return { ok: true };
}

// ─── RESERVASI ──────────────────────────────────────────────────────────
export const STATUS_RESERVASI = ['Menunggu', 'Hadir', 'Selesai', 'Dibatalkan'];

export function getReservations() {
  const list = read('riwayatReservasi', []);
  let changed = false;
  const out = list.map((r) => {
    if (r.id && r.status) return r;
    changed = true; // migrasi data lama (belum punya id & status)
    return { ...r, id: r.id || uid('RSV'), status: r.status || 'Menunggu' };
  });
  if (changed) write('riwayatReservasi', out);
  return out;
}
export const getReservationsByUser = (userId) =>
  getReservations().filter((r) => r.userId === userId);

export function addReservation(data) {
  const item = { ...data, id: uid('RSV'), status: 'Menunggu', dibuat: new Date().toISOString() };
  write('riwayatReservasi', [...getReservations(), item]);
  return item;
}
export function updateReservation(id, patch) {
  write('riwayatReservasi', getReservations().map((r) => (r.id === id ? { ...r, ...patch } : r)));
}
export function deleteReservation(id) {
  write('riwayatReservasi', getReservations().filter((r) => r.id !== id));
}
export function deleteReservationsByUser(userId) {
  write('riwayatReservasi', getReservations().filter((r) => r.userId !== userId));
}

// ─── ANTRIAN ────────────────────────────────────────────────────────────
// 'antrian'      → { tanggal, counter, sesi }  (nomor terakhir hari ini)
// 'antrianTiket' → semua tiket (riwayat lintas hari)
export const getAllTickets = () => read('antrianTiket', []);

export function getAntrian() {
  const t = todayStr();
  let a = read('antrian', null);
  if (!a || a.tanggal !== t) {
    if (a) {
      // tiket hari sebelumnya yang belum selesai ditandai kedaluwarsa
      write('antrianTiket', getAllTickets().map((x) =>
        (x.status === 'Menunggu' || x.status === 'Dilayani') && x.tanggal !== t
          ? { ...x, status: 'Kedaluwarsa' } : x));
    }
    a = { tanggal: t, counter: 0, sesi: 1 };
    write('antrian', a);
  }
  return { ...a, sesi: a.sesi || 1 };
}

export const ticketNo = (n) => 'A' + pad(n);

export function getTicketsToday() {
  const a = getAntrian();
  return getAllTickets().filter((x) => x.tanggal === a.tanggal && (x.sesi || 1) === a.sesi);
}
export const getServing = () => getTicketsToday().find((x) => x.status === 'Dilayani') || null;

export function ambilNomor(user) {
  const a = getAntrian();
  a.counter += 1;
  write('antrian', a);
  const tiket = {
    id: uid('Q'), nomor: a.counter, no: ticketNo(a.counter),
    tanggal: a.tanggal, sesi: a.sesi, waktu: new Date().toISOString(),
    userId: user.id, nama: user.nama, status: 'Menunggu',
  };
  write('antrianTiket', [...getAllTickets(), tiket]);
  return tiket;
}

export function panggilBerikutnya() {
  const hari = getTicketsToday();
  const berikut = hari
    .filter((x) => x.status === 'Menunggu')
    .sort((a, b) => a.nomor - b.nomor)[0];
  const idSelesai = hari.find((x) => x.status === 'Dilayani')?.id;
  write('antrianTiket', getAllTickets().map((x) => {
    if (x.id === idSelesai) return { ...x, status: 'Selesai' };
    if (berikut && x.id === berikut.id) return { ...x, status: 'Dilayani' };
    return x;
  }));
  return berikut || null;
}

export function resetAntrian() {
  const a = getAntrian();
  const idHariIni = new Set(getTicketsToday().map((x) => x.id));
  write('antrianTiket', getAllTickets().map((x) =>
    idHariIni.has(x.id) && (x.status === 'Menunggu' || x.status === 'Dilayani')
      ? { ...x, status: 'Direset' } : x));
  write('antrian', { tanggal: a.tanggal, counter: 0, sesi: a.sesi + 1 });
}

// ─── PENGATURAN LAYANAN ─────────────────────────────────────────────────
const LAYANAN_DEFAULT = { antrian: true, reservasi: true, mejaNonaktif: [] };
export const getLayanan = () => ({ ...LAYANAN_DEFAULT, ...read('layanan', {}) });
export const saveLayanan = (cfg) => write('layanan', cfg);
