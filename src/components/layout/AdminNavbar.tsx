import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const AdminNavbar = () => {
  const handleLogout = () => {
    window.location.href = '/admin';
  };

  const logoImageUrl = "https://i.ibb.co/spRKDrsP/FBB5-EB7-A-5-EDE-438-A-B53-C-746-C2-DFAA680.jpg";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-primary py-2 px-4 shadow-md">
      <div className="flex items-center justify-between flex-wrap gap-4 text-white">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard" className="flex items-center gap-3 hover:text-black transition">
            <img
              src={logoImageUrl}
              alt="โลโก้แอดมิน"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="text-xl md:text-2xl font-bold tracking-wide">Admin Panel</div>
          </Link>
        </div>

        <nav className="flex flex-wrap gap-4 items-center text-sm md:text-base font-medium whitespace-nowrap">
          <Link to="/admin/dashboard" className="hover:text-black transition px-3">หน้าหลัก</Link>
          <Link to="/admin/manage-recipes" className="hover:text-black transition px-3">จัดการเมนู</Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full transition-all duration-300 font-semibold shadow-md hover:scale-105 active:scale-95"
          >
            <LogOut size={18} /> ออกจากระบบ
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;
