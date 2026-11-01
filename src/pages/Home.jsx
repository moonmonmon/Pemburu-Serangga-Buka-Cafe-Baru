import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const slidesData = [
  { img: '/assets/images/au1.jpeg', alt: 'The Cups & Co - Suasana Kafe' },
  { img: '/assets/images/au2.jpeg', alt: 'The Cups & Co - Produk Kopi' },
  { img: '/assets/images/au3.jpeg', alt: 'The Cups & Co - Tim' }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);
  const startXRef = useRef(0);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#about') {
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 3500);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const goToSlide = (index) => {
    stopTimer();
    setCurrentSlide(index);
    startTimer();
  };

  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = startXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      const nextSlide = (currentSlide + (diff > 0 ? 1 : -1) + slidesData.length) % slidesData.length;
      goToSlide(nextSlide);
    }
  };

  return (
    <div>
      {/* HOME HERO */}
      <section className="home">
        <div className="home-photo"></div>
        <div className="home-fade"></div>
        <div className="home-body">
          <img src="/assets/images/logo.png" alt="The Cups & Co Logo" className="cafe-logo" />
          <p className="home-title">The Cups & Co</p>
          <div className="rule"></div>
          <p className="tagline">Specialty Coffee · Medan</p>
          <p className="desc">
            Tempat nongki asik dengan kopi pilihan terbaik, suasana hangat yang bikin betah.
          </p>
          <Link to="/services" className="btn-explore">Jelajahi Sekarang</Link>
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" className="about">
        <div className="about-container">
          <h2 className="about-heading">About Us</h2>

          {/* SLIDESHOW */}
          <div 
            className="about-slider-wrap" 
            id="aboutSlider"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="about-slides">
              {slidesData.map((slide, index) => (
                <div 
                  key={index} 
                  className={`about-slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <img src={slide.img} alt={slide.alt} />
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="about-dots">
              {slidesData.map((_, index) => (
                <button 
                  key={index} 
                  className={`about-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Foto ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>

          {/* DESKRIPSI */}
          <div className="about-desc-grid">
            <div className="about-desc-card">
              <p>
                The Cups and Co didirikan oleh seorang owner yang memiliki pengalaman kerja selama enam tahun di bidang kopi dan kuliner di Australia, yang kemudian menjadi dasar dalam membangun The Cups and Co sebagai bisnis FnB di Kota Medan.
              </p>
            </div>
            <div className="about-desc-card">
              <p>
                Nama The Cups and Co memiliki makna yang merepresentasikan konsep usaha. "The Cups" merujuk pada cangkir sebagai wadah penyajian kopi yang menjadi produk utama, sedangkan "and Co" berarti kolaborasi bersama rekan dalam menjalankan usaha.
              </p>
            </div>
            <div className="about-desc-card">
              <p>
                The Cups and Co menggabungkan pengalaman kerja internasional dengan pelaksanaan di tingkat lokal, sebagai usaha kafe yang menyediakan minuman dan makanan di Kota Medan serta penyediaan tempat bagi pelanggan untuk berbagai aktivitas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
