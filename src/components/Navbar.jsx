import React, { useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { MENU, homeFor } from '../lib/roles';

const backPaths = {
  '/services': '/',
  '/antrian': '/services',
  '/struk': '/antrian',
  '/pilih-meja': '/services',
  '/reservasi': '/pilih-meja',
  '/finish': '/reservasi',
  '/riwayat': '/',
  '/comingsoon': '/',
  '/faq': '/',
  '/privacy': '/',
  '/akun': '/',
};

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const checkboxRef = useRef(null);

  const role = user?.role;
  const links = role ? MENU[role] : [{ to: '/masuk', label: 'Masuk' }];
  // Tombol kembali hanya untuk pelanggan/tamu. Peran internal sudah punya menu lengkap.
  const showBack = !role || role === 'pelanggan';
  const backPath = showBack ? (role ? backPaths[location.pathname] : '/masuk') : null;
  const hasBack = !!backPath && (role ? true : location.pathname !== '/masuk');
  const many = links.length > 5;

  // Close mobile menu on route change
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false;
    }
  }, [location]);

  const closeMenu = () => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false;
    }
  };

  return (
    <nav className={`site-nav ${hasBack ? 'with-back' : ''} ${many ? 'nav-many' : ''}`}>
      {hasBack && (
        <Link to={backPath} className="nav-back">
          ←
        </Link>
      )}

      <Link to={role ? homeFor(role) : '/masuk'} className="nav-left" onClick={closeMenu}>
        <img src="/assets/images/logo.png" alt="The Cups & Co Logo" />
        <span>The Cups & Co</span>
      </Link>

      <input type="checkbox" id="menu-toggle" ref={checkboxRef} />
      <label htmlFor="menu-toggle" className="menu-toggle">
        <span></span>
        <span></span>
        <span></span>
      </label>

      <div className="nav-menu">
        {links.map((l) => (
          <NavLink key={l.to + l.label} to={l.to} end onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'active' : undefined)}>
            {l.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
