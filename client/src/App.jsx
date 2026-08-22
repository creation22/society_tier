import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout.jsx';
import MapPage from './pages/MapPage.jsx';
import SocietyPage from './pages/SocietyPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import SocietiesPage from './pages/SocietiesPage.jsx';
import AreaPage from './pages/AreaPage.jsx';
import ComparePage from './pages/ComparePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/society/:slug" element={<SocietyPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/rankings/:category" element={<LeaderboardPage />} />
          <Route path="/societies" element={<SocietiesPage />} />
          <Route path="/tier-list" element={<SocietiesPage />} />
          <Route path="/explore" element={<SocietiesPage />} />
          <Route path="/area/:area" element={<AreaPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/u/:username" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
