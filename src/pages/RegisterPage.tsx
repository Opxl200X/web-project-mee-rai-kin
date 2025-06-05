import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !email || !password) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }
    
    try {
      setIsLoading(true);
      const success = await register(username, email, password);
      
      if (success) {
        navigate('/');
      } else {
        setError('ไม่สามารถลงทะเบียนได้ โปรดลองอีกครั้ง');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <section className="min-h-screen py-16 flex flex-col justify-center items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">บัญชีผู้ใช้ใหม่</h1>
        <p className="text-xl text-gray-600">สร้างบัญชีผู้ใช้ของคุณ</p>
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
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block font-semibold text-gray-700">
              ยืนยันรหัสผ่าน
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
          </button>
          
          <div className="text-center mt-6">
            <p>
              มีบัญชีผู้ใช้แล้ว? {' '}
              <Link 
                to="/signin" 
                className="text-primary-dark hover:text-primary font-semibold"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;