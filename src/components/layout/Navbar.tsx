// ✅ Navbar.tsx พร้อมฟีเจอร์ Search แบบเลือกวัตถุดิบ + Mobile Menu

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Search, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

const ingredientCategories = [
  {
    name: 'เนื้อสัตว์และโปรตีน',
    items: [
      'กุ้งสด', 'คอหมู', 'ซี่โครงหมู', 'ทูน่ากระป๋อง', 'ปลาดุกย่าง', 'ปลาหมึก', 'ปลาแซลมอน',
      'หมูกรอบ', 'หมูสับ', 'หมูสามชั้น', 'หอยขม', 'อกไก่', 'เต้าหู้', 'เนื้อปลากรายขูด',
      'เนื้อปลาดอร์ลี่', 'เนื้อวัว', 'เนื้อเป็ดสับ', 'ไก่'
    ]
  },
  {
    name: 'ผักและสมุนไพร',
    items: [
      'กระเทียม', 'กะหล่ำปลี', 'กะเพรา', 'ขิง', 'ขึ้นฉ่าย', 'ข่า', 'ดอกขจร', 'ดอกแค', 'ตะไคร้',
      'ต้นหอม', 'ถั่วงอก', 'ถั่วฝักยาว', 'ถั่วพู', 'บวบ', 'ผักกวางตุ้ง', 'ผักกาดขาว', 'ผักชี',
      'ผักบุ้ง', 'ฟักทอง', 'มะละกอดิบ', 'มะเขือพวง', 'มะเขือเทศ', 'มะเขือเปราะ', 'มันฝรั่ง',
      'หอมแดง', 'เพกา', 'เห็ดนางฟ้า', 'เห็ดฟาง', 'เห็ดหอม', 'เห็ดเข็มทอง', 'แครอท',
      'แตงกวา', 'ใบมะกรูด', 'ใบแมงลัก', 'ใบโหระพา'
    ]
  },
  {
    name: 'เครื่องปรุงรส',
    items: [
      'กะปิ', 'ซอสถั่วเหลือง', 'ซอสปรุงรส', 'ซอสหอยนางรม', 'ซีอิ๊วขาว', 'ซีอิ๊วดำ',
      'น้ำจิ้มสุกี้', 'น้ำตาลปี๊บ', 'น้ำปลา', 'น้ำปลาร้า', 'น้ำผึ้ง', 'น้ำมะขามเปียก',
      'น้ำมะนาว', 'น้ำสลัดงา', 'ผงปรุงรส', 'มายองเนส', 'เต้าเจี้ยว'
    ]
  },
  {
    name: 'เครื่องเทศและเครื่องแกง',
    items: [
      'ข้าวคั่ว', 'พริกขี้หนู', 'พริกชี้ฟ้า', 'พริกป่น', 'พริกแกงขนมจีน', 'พริกแกงคั่วกลิ้ง',
      'พริกแกงส้ม', 'พริกแกงเขียวหวาน', 'พริกแกงแดง', 'พริกแดง', 'พริกแห้ง',
      'พริกไทย', 'พริกไทยขาว', 'พริกไทยดำ', 'รากผักชี'
    ]
  },
  {
    name: 'คาร์โบไฮเดรตและเส้น',
    items: [
      'ข้าวกล้อง', 'ข้าวสวย', 'ข้าวหอมมะลิ', 'ข้าวโพด', 'ข้าวโพดอ่อน',
      'ข้าวโอ๊ต', 'คีนัว', 'บะหมี่ผัก', 'เส้นก๋วยเตี๋ยวแบน', 'เส้นขนมจีน',
      'เส้นข้าวซอย', 'วุ้นเส้น'
    ]
  },
  {
    name: 'ไข่และผลิตภัณฑ์จากไข่',
    items: ['ไข่ไก่', 'ไข่ไก่ต้ม']
  },
  {
    name: 'แป้งและของทอด',
    items: [
      'แป้งทอดกรอบ', 'แป้งอเนกประสงค์', 'แป้งข้าวโพด', 'ผงฟู'
    ]
  },
  {
    name: 'ของเหลวและน้ำมัน',
    items: [
      'น้ำมันพืช', 'น้ำมันหอย', 'น้ำมันงา', 'น้ำมันมะกอก', 'น้ำเปล่า',
      'น้ำซุป', 'น้ำซุปไก่', 'น้ำต้มไก่'
    ]
  },
  {
    name: 'อื่น ๆ',
    items: [
      'ดักแด้', 'เมล็ดการะเกด', 'งาขาว', 'แตงกวาดอง', 'เครื่องในเป็ด',
      'ผงขมิ้น', 'ผงกะหรี่', 'ผงหัวหอม'
    ]
  }
];


const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [inputValue, setInputValue] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const manual = inputValue.trim();
    const allIngredients = manual ? [...selectedIngredients, manual] : selectedIngredients;
    if (allIngredients.length > 0) {
      navigate(`/search?q=${encodeURIComponent(allIngredients.join(','))}`);
      setShowDropdown(false);
    }
  };

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSelectIngredient = (item: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const logoImageUrl = "https://i.ibb.co/spRKDrsP/FBB5-EB7-A-5-EDE-438-A-B53-C-746-C2-DFAA680.jpg";
  const defaultProfileImage = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-primary py-2 px-4 md:px-6 shadow-md">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logoImageUrl} alt="โลโก้" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="hidden md:block rainbow-text text-xl md:text-2xl font-bold">Mee Rai Kin</div>
          </Link>
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div className="relative flex-1 max-w-xs mx-auto md:mx-4" ref={dropdownRef}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              className="w-full py-2 px-4 pr-10 rounded-full border-none"
              placeholder="พิมพ์หรือเลือกวัตถุดิบ..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setShowDropdown(true)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={20} />
            </button>
          </form>
          {showDropdown && (
            <div className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto bg-white text-black rounded-lg shadow-lg z-50 p-2 space-y-2">
              {ingredientCategories.map((category, i) => (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between font-semibold text-primary-dark mb-1 px-2 py-1 rounded hover:bg-primary/10"
                  >
                    {category.name}
                    {openCategories[category.name] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openCategories[category.name] && (
                    <div className="grid grid-cols-2 gap-2 mb-2 px-1">
                      {category.items.map((item, j) => (
                        <button
                          key={j}
                          type="button"
                          onClick={() => handleSelectIngredient(item)}
                          className={`text-left px-2 py-1 rounded-md transition-colors duration-200 ${
                            selectedIngredients.includes(item) ? 'bg-primary/20 font-bold' : 'hover:bg-primary/10'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className="hidden md:flex gap-8 text-white font-semibold text-shadow text-base">
          <Link to="/" className="hover:text-gray-800 transition-colors duration-300">หน้าหลัก</Link>
          <Link to="/popular-menu" className="hover:text-gray-800 transition-colors duration-300">เมนูยอดนิยม</Link>
          <Link to="/random-menu" className="hover:text-gray-800 transition-colors duration-300">สุ่มเมนู</Link>
          <Link to="/bmr-tdee" className="hover:text-gray-800 transition-colors duration-300">BMR & TDEE</Link>
          <Link to="/contact" className="hover:text-gray-800 transition-colors duration-300">ติดต่อเรา</Link>
        </nav>

        <div className="flex items-center gap-3 text-white font-semibold text-shadow whitespace-nowrap">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <img src={user?.profileImage || defaultProfileImage} alt="รูปโปรไฟล์" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              </Link>
              <button onClick={logout} className="bg-gray-800 text-white py-1.5 px-4 rounded-full text-sm font-semibold shadow-md hover:bg-black transition-all duration-300 hover:scale-105 active:scale-95">
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="bg-primary-dark text-white py-1.5 px-4 rounded-full text-sm font-semibold shadow-md hover:bg-[#23825f] transition-all duration-300 hover:scale-105 active:scale-95">
                เข้าสู่ระบบ
              </Link>
              <Link to="/register" className="bg-[#f2994a] text-white py-1.5 px-4 rounded-full text-sm font-semibold shadow-md hover:bg-[#d9770c] transition-all duration-300 hover:scale-105 active:scale-95">
                ลงทะเบียน
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="w-full mt-2 bg-primary text-white text-base font-semibold shadow-md md:hidden z-50">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 border-b border-white/20 hover:bg-white/10">หน้าหลัก</Link>
          <Link to="/popular-menu" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 border-b border-white/20 hover:bg-white/10">เมนูยอดนิยม</Link>
          <Link to="/random-menu" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 border-b border-white/20 hover:bg-white/10">สุ่มเมนู</Link>
          <Link to="/bmr-tdee" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 border-b border-white/20 hover:bg-white/10">BMR & TDEE</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 hover:bg-white/10">ติดต่อเรา</Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;