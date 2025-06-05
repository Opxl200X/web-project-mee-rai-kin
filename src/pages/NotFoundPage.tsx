import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">ไม่พบหน้าที่คุณกำลังค้นหา</h2>
        <p className="text-lg text-gray-600 mb-8">
          หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบ หรือไม่มีอยู่จริง
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
        >
          <Home size={20} />
          <span>กลับสู่หน้าหลัก</span>
        </Link>
      </div>
      
      {/* Fun food illustration */}
      <div className="mt-12">
        <div className="w-32 h-32 mx-auto bg-secondary rounded-full flex items-center justify-center">
          <span className="text-5xl">🍳</span>
        </div>
        <p className="text-center mt-4 text-lg font-medium">
          แต่เรายังมีเมนูอร่อยๆ รอคุณอยู่!
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;