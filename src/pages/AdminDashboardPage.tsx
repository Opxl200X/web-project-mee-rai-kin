import AdminNavbar from '../components/layout/AdminNavbar';
import Footer from '../components/layout/Footer';
import { useContactStore } from '../store/contactStore';

const AdminDashboardPage = () => {
  const { messages, toggleReadStatus } = useContactStore();

  return (
    <>
      <AdminNavbar />
      <main className="pt-24 min-h-screen bg-yellow-100 px-4 md:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">แดชบอร์ดผู้ดูแลระบบ</h1>

          <div className="mt-10 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">ข้อความจากผู้ใช้งาน</h2>
            {messages.length === 0 ? (
              <p className="text-gray-500">ยังไม่มีข้อความ</p>
            ) : (
              <ul className="space-y-6 text-gray-700">
                {messages.map((msg, index) => (
                  <li
                    key={index}
                    className={`border-b pb-4 ${msg.isRead ? 'opacity-70' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-lg">
                        {msg.firstName} {msg.lastName} ({msg.email})
                      </p>
                      <button
                        onClick={() => toggleReadStatus(index)}
                        className={`text-sm px-3 py-1 rounded-full transition font-medium ${
                          msg.isRead
                            ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {msg.isRead ? '✓ อ่านแล้ว' : 'ยังไม่ได้อ่าน'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      ส่งเมื่อ {new Date(msg.submittedAt).toLocaleString('th-TH')}
                    </p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                      <p>{msg.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboardPage;
