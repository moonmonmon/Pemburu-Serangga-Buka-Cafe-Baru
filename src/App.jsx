import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Guard from './auth/Guard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import QueueBoard from './pages/QueueBoard';
import QueueTicket from './pages/QueueTicket';
import TablePicker from './pages/TablePicker';
import Reservation from './pages/Reservation';
import Success from './pages/Success';
import History from './pages/History';
import ComingSoon from './pages/ComingSoon';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import AuthGate from './pages/AuthGate';
import CustomerAuth from './pages/CustomerAuth';
import StaffLogin from './pages/StaffLogin';
import Akun from './pages/Akun';
import Dashboard from './pages/staf/Dashboard';
import StafReservasi from './pages/staf/StafReservasi';
import StafAntrian from './pages/staf/StafAntrian';
import StafLayanan from './pages/staf/StafLayanan';
import StafPelanggan from './pages/staf/StafPelanggan';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Peran yang boleh membuka halaman pelanggan (pemilik boleh semua halaman)
const CUSTOMER = ['pelanggan', 'pemilik'];
const STAFF = ['kasir', 'admin', 'pemilik'];

function AppContent() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isAuthPage = pathname.startsWith('/masuk');
  const showFooter = !isAuthPage && (!user || user.role === 'pelanggan' || user.role === 'pemilik');

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        {/* Halaman masuk (tanpa navbar/footer) */}
        <Route path="/masuk" element={<AuthGate />} />
        <Route path="/masuk/pelanggan" element={<CustomerAuth />} />
        <Route path="/masuk/staf" element={<StaffLogin />} />

        {/* Halaman publik */}
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Halaman pelanggan */}
        <Route path="/" element={<Guard roles={CUSTOMER}><Home /></Guard>} />
        <Route path="/services" element={<Guard roles={CUSTOMER}><Services /></Guard>} />
        <Route path="/antrian" element={<Guard roles={CUSTOMER}><QueueBoard /></Guard>} />
        <Route path="/struk" element={<Guard roles={CUSTOMER}><QueueTicket /></Guard>} />
        <Route path="/pilih-meja" element={<Guard roles={CUSTOMER}><TablePicker /></Guard>} />
        {/* Admin hanya boleh membuka form ini untuk mengubah reservasi (dicek di dalam halaman) */}
        <Route path="/reservasi" element={<Guard roles={[...CUSTOMER, 'admin']}><Reservation /></Guard>} />
        <Route path="/finish" element={<Guard roles={CUSTOMER}><Success /></Guard>} />
        <Route path="/riwayat" element={<Guard roles={CUSTOMER}><History /></Guard>} />
        <Route path="/comingsoon" element={<Guard><ComingSoon /></Guard>} />

        {/* Halaman semua peran */}
        <Route path="/akun" element={<Guard><Akun /></Guard>} />

        {/* Halaman internal */}
        <Route path="/dashboard" element={<Guard roles={STAFF}><Dashboard /></Guard>} />
        <Route path="/staf/reservasi" element={<Guard roles={STAFF}><StafReservasi /></Guard>} />
        <Route path="/staf/antrian" element={<Guard roles={STAFF}><StafAntrian /></Guard>} />
        <Route path="/staf/layanan" element={<Guard roles={['admin', 'pemilik']}><StafLayanan /></Guard>} />
        <Route path="/staf/pelanggan" element={<Guard roles={['pemilik']}><StafPelanggan /></Guard>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
