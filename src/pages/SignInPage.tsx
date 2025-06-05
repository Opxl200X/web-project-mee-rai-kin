import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    try {
      setIsLoading(true);
      const success = await login(email, password);

      if (success) {
        navigate(redirectUrl);
      } else {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ โปรดลองอีกครั้ง');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-16 flex flex-col justify-center items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">ยินดีต้อนรับกลับ!</h1>
        <p className="text-xl text-gray-600">ลงชื่อเข้าใช้บัญชีของคุณ</p>
      </div>

      <div className="form-container hover:translate-y-[-5px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block font-semibold text-gray-700">
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div className="text-right">
            <Link to="/contact" className="text-primary-dark hover:text-primary font-medium">
              ลืมรหัสผ่าน?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>

          <div className="text-center mt-6">
            <p>
              ไม่มีบัญชีผู้ใช้?{' '}
              <Link to="/register" className="text-primary-dark hover:text-primary font-semibold">
                ลงทะเบียน
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* ข้อความลิงก์สำหรับแอดมินด้านล่างกรอบฟอร์ม */}
      <div className="mt-6">
        <Link
          to="/admin"
          className="text-sm text-gray-500 hover:text-primary-dark underline transition"
        >
          สำหรับแอดมินเข้าสู่ระบบ
        </Link>
      </div>
    </section>
  );
};

export default SignInPage;
