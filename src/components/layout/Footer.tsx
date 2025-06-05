import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary py-8 px-4 md:px-6 text-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* LOGO / ABOUT */}
<div>
  <h3 className="text-2xl font-extrabold mb-2 drop-shadow-lg">Mee Rai Kin</h3>
  <div className="w-12 h-0.5 bg-yellow-200 mb-4 rounded"></div>
  <p className="text-white text-opacity-90 leading-relaxed drop-shadow-md mb-4">
    แหล่งรวมเมนูอาหารไทยที่คุณสามารถทำได้ง่ายๆ <br />
    จากวัตถุดิบที่มีอยู่ในบ้าน
  </p>
  <img
    src="https://i.ibb.co/spRKDrsP/FBB5-EB7-A-5-EDE-438-A-B53-C-746-C2-DFAA680.jpg"
    alt="Mee Rai Kin Logo"
    className="w-24 h-auto rounded shadow-md"
  />
</div>


        {/* MAIN MENU */}
        <div>
          <h3 className="text-xl font-bold mb-2 drop-shadow-lg">เมนูหลัก</h3>
          <div className="w-12 h-0.5 bg-yellow-200 mb-4 rounded"></div>
          <ul className="space-y-2">
            {[
              { path: '/', label: 'หน้าหลัก' },
              { path: '/popular-menu', label: 'เมนูยอดนิยม' },
              { path: '/random-menu', label: 'สุ่มเมนู' },
              { path: '/bmr-tdee', label: 'BMR & TDEE' },
            ].map(({ path, label }) => (
              <li key={label}>
                <Link
                  to={path}
                  className="text-white text-opacity-90 hover:text-yellow-300 transition-all duration-200 inline-block drop-shadow-sm"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-xl font-bold mb-2 drop-shadow-lg">ติดต่อเรา</h3>
          <div className="w-12 h-0.5 bg-yellow-200 mb-4 rounded"></div>
          <ul className="space-y-2">
            <li className="text-white text-opacity-90 drop-shadow-md">
              อีเมล: <a href="mailto:opalpiriyakorn@gmail.com" className="hover:underline">opalpiriyakorn@gmail.com</a><br />
              อีเมล: <a href="mailto:evezang123@gmail.com" className="hover:underline">evezang123@gmail.com</a>
            </li>
            <li className="text-white text-opacity-90 drop-shadow-md">
              โทรศัพท์: 01-234-5678
            </li>
            <li>
              <Link
                to="/contact"
                className="text-white text-opacity-90 hover:text-pink-300 hover:scale-105 transition-all duration-200 inline-block drop-shadow-sm"
              >
                ส่งข้อความถึงเรา
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="container mx-auto mt-10 pt-6 border-t border-white border-opacity-20 text-center">
        <p className="text-white text-opacity-70 drop-shadow-md text-sm">
          &copy; {new Date().getFullYear()} Mee Rai Kin. Webprograming Project KMUTT.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
