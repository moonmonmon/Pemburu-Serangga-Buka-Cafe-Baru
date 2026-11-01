# Catatan Login — The Cups & Co

## ID Staf (halaman Masuk → "Saya Staf")
| Peran         | ID        | Halaman yang bisa dibuka                                            |
|---------------|-----------|---------------------------------------------------------------------|
| Pemilik       | PMK-001   | Semua: Dashboard + Laporan, Reservasi, Antrian, Layanan, Pelanggan, Beranda & halaman pelanggan, Akun |
| Admin         | ADM-001   | Dashboard, Reservasi (lihat/ubah/hapus/status), Antrian (panggil + reset), Layanan, Akun |
| Kasir / Staf  | KSR-001   | Dashboard, Reservasi (lihat + tandai hadir), Antrian (panggil, tanpa reset), Akun |

ID tidak peka huruf besar/kecil. Daftar ID ada di `src/lib/roles.js` (`STAFF_ACCOUNTS`).

## Pelanggan
Daftar sendiri di "Saya Pelanggan" (nama, no. telepon, email), lalu masuk dengan no. telepon atau email.

## Menjalankan
    npm install
    npm run dev

Catatan: data (akun, reservasi, antrian) disimpan di localStorage browser, jadi hanya terlihat
di browser/perangkat yang sama. Untuk penggunaan nyata dibutuhkan backend + password/token.
