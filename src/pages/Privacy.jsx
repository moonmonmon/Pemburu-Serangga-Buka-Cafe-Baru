import React from 'react';

export default function Privacy() {
  return (
    <div className="privacy-page">
      <div className="page-title">
        <h1>Kebijakan Privasi</h1>
        <p>Bagaimana kami mengelola dan menjaga data privasi Anda</p>
      </div>

      <div className="privacy-section">
        <div className="privacy-container">
          <div className="privacy-card">
            <p className="privacy-updated">Terakhir diperbarui: 27 Juni 2026</p>
            
            <section className="privacy-block">
              <h2>1. Pendahuluan</h2>
              <p>
                Selamat datang di platform digital <strong>The Cups & Co</strong>. Kami sangat menghargai kepercayaan Anda dan berkomitmen untuk melindungi privasi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda ketika menggunakan layanan reservasi online dan sistem antrian digital kami.
              </p>
            </section>

            <section className="privacy-block">
              <h2>2. Data yang Kami Kumpulkan</h2>
              <p>
                Untuk memproses pemesanan tempat (reservasi) dan pendaftaran antrian, kami mengumpulkan beberapa informasi pribadi secara sukarela yang Anda berikan, meliputi:
              </p>
              <ul>
                <li><strong>Nama Lengkap:</strong> Untuk identifikasi pesanan meja Anda saat kedatangan.</li>
                <li><strong>Nomor Telepon (WhatsApp):</strong> Untuk mengirimkan struk digital, kode reservasi, serta konfirmasi kehadiran.</li>
                <li><strong>Detail Reservasi:</strong> Tanggal kunjungan, jam reservasi, jumlah tamu, dan kapasitas meja yang dipilih.</li>
              </ul>
            </section>

            <section className="privacy-block">
              <h2>3. Penggunaan Data Reservasi</h2>
              <p>
                Data yang Anda berikan digunakan secara terbatas untuk kepentingan kenyamanan kunjungan Anda, termasuk:
              </p>
              <ul>
                <li>Memproses dan mengelola antrian atau reservasi meja Anda secara real-time.</li>
                <li>Mengirimkan notifikasi tiket antrian atau struk reservasi digital.</li>
                <li>Menghubungi Anda apabila terdapat perubahan jadwal operasional atau kondisi mendesak lainnya.</li>
                <li>Meningkatkan kualitas layanan pelanggan dan operasional kafe kami secara keseluruhan.</li>
              </ul>
            </section>

            <section className="privacy-block">
              <h2>4. Keamanan Informasi Anda</h2>
              <p>
                Kami menerapkan langkah-langkah keamanan teknis dan administratif yang dirancang untuk melindungi data pribadi Anda dari akses yang tidak sah, kehilangan, pencurian, atau penyalahgunaan. Akses ke database kami dibatasi secara ketat hanya untuk staf resmi yang bertugas mengelola sistem operasional kafe.
              </p>
            </section>

            <section className="privacy-block">
              <h2>5. Hak Pengguna</h2>
              <p>
                Sebagai pengguna, Anda memiliki hak penuh untuk:
              </p>
              <ul>
                <li>Mengakses data pribadi Anda yang tersimpan di sistem kami.</li>
                <li>Meminta koreksi atau pembaruan apabila terjadi kesalahan penulisan data pribadi.</li>
                <li>Meminta penghapusan riwayat reservasi Anda secara permanen dari sistem kami dengan menghubungi layanan dukungan kami.</li>
              </ul>
            </section>

            <section className="privacy-block">
              <h2>6. Kontak Kami</h2>
              <p>
                Apabila Anda memiliki pertanyaan, saran, atau keluhan mengenai Kebijakan Privasi ini atau pengelolaan data di The Cups & Co, silakan hubungi kami melalui:
              </p>
              <address className="privacy-address">
                <strong>The Cups & Co Krakatau</strong><br />
                Jl. Gunung Krakatau No.25A, Medan, Indonesia<br />
                WhatsApp: <a href="https://wa.me/+628116086600" target="_blank" rel="noopener noreferrer">0811-6086-600</a><br />
                Email: <a href="mailto:cupsnco@email.com">cupsnco@email.com</a>
              </address>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
