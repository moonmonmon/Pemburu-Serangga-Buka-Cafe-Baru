import React, { useState } from 'react';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "Apakah saya harus melakukan reservasi sebelum datang?",
      answer: "Tidak wajib. Kami selalu menyambut pelanggan walk-in. Namun, jika Anda berencana datang pada akhir pekan (Jumat - Minggu) atau membawa rombongan besar (lebih dari 6 orang), kami sangat menyarankan untuk melakukan reservasi terlebih dahulu guna memastikan meja favorit Anda tersedia."
    },
    {
      question: "Bagaimana cara mengubah atau membatalkan reservasi?",
      answer: "Anda dapat mengubah jadwal atau membatalkan reservasi dengan menghubungi kami langsung via WhatsApp di nomor 0811-6086-600 selambat-lambatnya 2 jam sebelum waktu reservasi yang telah disepakati."
    },
    {
      question: "Apakah ada batas minimum pemesanan (minimum spend) untuk reservasi?",
      answer: "Untuk area reguler (baik indoor maupun outdoor) tidak dikenakan biaya minimum spend. Namun, khusus untuk reservasi VIP Room (ruang privat eksklusif dengan AC, TV, dan projector), berlaku sistem minimum spend yang dapat Anda konfirmasikan langsung melalui tim admin kami."
    },
    {
      question: "Apakah The Cups & Co ramah hewan peliharaan (pet-friendly)?",
      answer: "Ya! Kami sangat menyukai hewan peliharaan. Anda dipersilakan membawa hewan kesayangan Anda khusus di area outdoor kami. Demi kenyamanan bersama, harap pastikan hewan peliharaan Anda menggunakan tali pengikat (leash) dan tetap dalam pengawasan."
    },
    {
      question: "Apakah tersedia fasilitas penunjang untuk bekerja (Work From Cafe)?",
      answer: "Tentu saja. Kami dirancang untuk mendukung aktivitas produktif Anda. Kami menyediakan koneksi Wi-Fi berkecepatan tinggi secara gratis dan stopkontak (colokan listrik) di hampir setiap meja, baik di area indoor ber-AC maupun outdoor."
    },
    {
      question: "Metode pembayaran apa saja yang diterima?",
      answer: "Kami menerima pembayaran secara tunai (Cash), kartu debit/kredit utama (Visa & Mastercard), serta pembayaran digital melalui QRIS yang mendukung semua aplikasi dompet digital (GoPay, OVO, Dana, ShopeePay) serta aplikasi mobile banking Anda."
    }
  ];

  return (
    <div className="faq-page">
      <div className="page-title">
        <h1>Frequently Asked Questions</h1>
        <p>Punya pertanyaan? Temukan jawabannya di sini</p>
      </div>

      <div className="faq-section">
        <div className="faq-container">
          <p className="faq-eyebrow">Tanya Jawab Seputar Layanan</p>
          <div className="faq-accordion">
            {faqData.map((item, index) => {
              const isOpen = activeIndex === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? 'active' : ''}`}>
                  <button 
                    className="faq-trigger" 
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <span className="faq-icon-indicator">{isOpen ? '−' : '+'}</span>
                  </button>
                  <div className={`faq-panel ${isOpen ? 'show' : ''}`}>
                    <div className="faq-panel-content">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="faq-footer">
            <p>Belum menemukan jawaban Anda? Hubungi kami langsung di <a href="https://wa.me/+628116086600" target="_blank" rel="noopener noreferrer">WhatsApp Support</a> kami.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
