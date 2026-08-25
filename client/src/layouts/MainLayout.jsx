import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ScrollProgress from '../components/ui/ScrollProgress.jsx';

export default function MainLayout() {
  const { pathname } = useLocation();
  // Map is a full-screen workspace — no global footer there.
  const isFullScreen = pathname === '/map';

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isFullScreen && <Footer />}
    </div>
  );
}
