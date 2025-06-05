import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        navigate('/admin/dashboard');
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen py-16 flex flex-col justify-center items-center bg-yellow-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">เข้าสู่ระบบผู้ดูแลระบบ</h1>
          <p className="text-xl text-gray-600">โปรดกรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
        </div>

        <div className="form-container hover:translate-y-[-5px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="block font-semibold text-gray-700">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                id="username"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block font-semibold text-gray-700">
                รหัสผ่าน
              </label>
              <input
                type="password"
                id="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AdminLoginPage;
