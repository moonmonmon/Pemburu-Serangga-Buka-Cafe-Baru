import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToAbout = (e) => {
    // If we are already on the home page, scroll to about
    if (window.location.pathname === '/') {
      const el = document.getElementById('about');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="brand-link">The Cups & Co</Link>
          <p>Tempat nongki, kopi enak, vibes santai tiap hari.</p>
          <p className="footer-info">
            🕒 08.00 – 22.00<br />
            📍 <a href="https://maps.app.goo.gl/H4sjruXcF1rYRWrt6" target="_blank" rel="noopener noreferrer">Jl. Gunung Krakatau No.25A, Medan</a><br />
            ☎ <a href="https://wa.me/+628116086600" target="_blank" rel="noopener noreferrer">0811-6086-600</a><br />
            ✉ <a href="mailto:Cupsnco@email.com">Cupsnco@email.com</a>
          </p>
          <div className="socials">
            <a href="https://www.instagram.com/thecups.krakatau" target="_blank" rel="noopener noreferrer">
              <img src="/assets/images/ig.png" alt="Instagram" />
            </a>
            <a href="https://www.tiktok.com/@thecupsncokrakatau?_t=zs-8wxc6xke3qv&_r=1" target="_blank" rel="noopener noreferrer">
              <img src="/assets/images/tiktok.png" alt="TikTok" />
            </a>
            <a href="https://gofood.link/a/P2AESxA" target="_blank" rel="noopener noreferrer">
              <img src="/assets/images/gofood.png" alt="GoFood" />
            </a>
            <a href="https://r.grab.com/g/6-20250429_141101_2446eae7133f46dd8862f67db871d18b_MEXMPS-6-C65JGVDDLFTTEE" target="_blank" rel="noopener noreferrer">
              <img src="/assets/images/grabfood.png" alt="GrabFood" />
            </a>
            <a href="mailto:cupsnco@email.com">
              <img src="/assets/images/email.png" alt="Email" />
            </a>
          </div>
        </div>
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Discover</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/pilih-meja">Reservation</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/#about" onClick={scrollToAbout}>About Us</Link></li>
              <li><a href="https://drive.google.com/file/d/1PwSc4OeOfppzw8ePnJcNQ3t6d7PiAccd/view?usp=drivesdk" target="_blank" rel="noopener noreferrer">Our Menu</a></li>
              <li><a href="https://g.co/kgs/qjZo1rp" target="_blank" rel="noopener noreferrer">Google Review</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="https://wa.me/+628116086600" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 The Cups & Co</p>
        </div>
      </div>
    </footer>
  );
}
