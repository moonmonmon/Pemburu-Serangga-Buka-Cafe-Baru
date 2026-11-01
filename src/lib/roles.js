// ─── AKUN STAF & HAK AKSES ───────────────────────────────────────────────
// Catatan: website ini masih frontend-only (data disimpan di localStorage),
// jadi ID staf ditaruh di sini sebagai data demo. Untuk produksi, pindahkan
// ke backend + tambahkan password / token.

export const STAFF_ACCOUNTS = [
  { id: 'PMK-001', nama: 'Pemilik The Cups & Co', role: 'pemilik' },
  { id: 'ADM-001', nama: 'Admin Cafe',            role: 'admin' },
  { id: 'KSR-001', nama: 'Kasir / Staf Cafe',     role: 'kasir' },
];

export const ROLE_LABEL = {
  pelanggan: 'Pelanggan',
  kasir: 'Kasir / Staf',
  admin: 'Admin',
  pemilik: 'Pemilik',
};

// Izin per peran (mengacu pada Tabel 2 & Tabel 3 di dokumen analisis kebutuhan)
const P_PELANGGAN = [
  'beranda', 'layanan', 'antrian.ambil', 'reservasi.buat',
  'riwayat.sendiri', 'riwayat.ubah', 'riwayat.hapus', 'akun.ubah',
];
const P_KASIR = [
  'dashboard', 'reservasi.lihat', 'reservasi.checkin',
  'antrian.lihat', 'antrian.panggil',
];
const P_ADMIN = [
  ...P_KASIR,
  'reservasi.status', 'reservasi.ubah', 'reservasi.hapus',
  'antrian.reset', 'layanan.kelola',
];
const P_PEMILIK = [
  ...P_ADMIN,
  'laporan.lihat', 'pelanggan.lihat',
  ...P_PELANGGAN, // pemilik dapat membuka semua halaman
];

export const PERMISSIONS = {
  pelanggan: P_PELANGGAN,
  kasir: P_KASIR,
  admin: P_ADMIN,
  pemilik: P_PEMILIK,
};

export const can = (role, perm) => !!role && PERMISSIONS[role]?.includes(perm);

export const homeFor = (role) => (role === 'pelanggan' ? '/' : '/dashboard');

// Menu navbar per peran
const AKUN = { to: '/akun', label: 'Akun' };
export const MENU = {
  pelanggan: [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/pilih-meja', label: 'Reservation' },
    { to: '/riwayat', label: 'Riwayat' },
    AKUN,
  ],
  kasir: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/staf/reservasi', label: 'Reservasi' },
    { to: '/staf/antrian', label: 'Antrian' },
    AKUN,
  ],
  admin: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/staf/reservasi', label: 'Reservasi' },
    { to: '/staf/antrian', label: 'Antrian' },
    { to: '/staf/layanan', label: 'Layanan' },
    AKUN,
  ],
  pemilik: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/staf/reservasi', label: 'Reservasi' },
    { to: '/staf/antrian', label: 'Antrian' },
    { to: '/staf/layanan', label: 'Layanan' },
    { to: '/staf/pelanggan', label: 'Pelanggan' },
    { to: '/', label: 'Beranda' },
    AKUN,
  ],
};

// Deskripsi menu untuk kartu pintasan di dashboard
export const MENU_INFO = {
  '/staf/reservasi': 'Pantau reservasi masuk dan proses kedatangan pelanggan.',
  '/staf/antrian': 'Panggil nomor berikutnya dan lihat riwayat antrian.',
  '/staf/layanan': 'Atur layanan dan jenis meja yang tersedia untuk pelanggan.',
  '/staf/pelanggan': 'Lihat data pelanggan yang sudah terdaftar.',
  '/': 'Lihat tampilan website seperti yang dilihat pelanggan.',
};

// Ringkasan kewenangan untuk halaman Akun
export const ROLE_ACCESS = {
  pelanggan: [
    'Melihat informasi cafe',
    'Reservasi meja',
    'Mengambil nomor antrian',
    'Melihat, mengubah, dan menghapus riwayat reservasi sendiri',
  ],
  kasir: [
    'Melihat data reservasi',
    'Menandai kedatangan pelanggan',
    'Memanggil nomor antrian berikutnya',
    'Melihat riwayat antrian',
  ],
  admin: [
    'Melihat, mengubah, dan menghapus data reservasi',
    'Mengatur status reservasi',
    'Melihat riwayat antrian, memanggil, dan mereset antrian',
    'Mengelola informasi layanan',
  ],
  pemilik: [
    'Seluruh menu dan fitur sistem',
    'Laporan aktivitas reservasi dan antrian',
    'Data pelanggan terdaftar',
    'Seluruh halaman pelanggan',
  ],
};
