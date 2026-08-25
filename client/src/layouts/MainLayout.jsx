import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ScrollProgress from '../components/ui/ScrollProgress.jsx';

export default function MainLayout() {
  const { pathname } = useLocation();
  // Map is a full-screen workspace — no global footer there.
  const isFullScreen = pathname === '/map';

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Fixed sky backdrop — sits behind every page so the whole site
          reads as one continuous sky-blue → sunlit-yellow gradient. */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-sky-gradient">
        <div className="absolute inset-0 bg-sky-clouds" />
      </div>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isFullScreen && <Footer />}
    </div>
  );
}
