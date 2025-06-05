import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import RandomMenuPage from './pages/RandomMenuPage';
import PopularMenuPage from './pages/PopularMenuPage';
import ProfilePage from './pages/ProfilePage';
import MenuDetailPage from './pages/MenuDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import BmrTdeePage from './pages/BmrTdeePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminManageRecipesPage from './pages/AdminManageRecipesPage'; // ✅ เพิ่มการ import หน้านี้

import { useAuthStore } from './store/authStore';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* เส้นทางปกติที่ใช้ Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="random-menu" element={<RandomMenuPage />} />
          <Route path="popular-menu" element={<PopularMenuPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="menu/:id" element={<MenuDetailPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="bmr-tdee" element={<BmrTdeePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* 👇 เส้นทางสำหรับ admin (อยู่นอก Layout) */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/manage-recipes" element={<AdminManageRecipesPage />} /> {/* ✅ เพิ่มบรรทัดนี้ */}
      </Routes>
    </>
  );
}

export default App;
