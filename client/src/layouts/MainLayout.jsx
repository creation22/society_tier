import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SupportButton from '../components/SupportButton.jsx';
import ShareButton from '../components/ShareButton.jsx';

export default function MainLayout() {
  const { pathname } = useLocation();
  const isFullScreen = pathname === '/';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isFullScreen && <Footer />}
      <ShareButton />
      <SupportButton />
    </div>
  );
}
