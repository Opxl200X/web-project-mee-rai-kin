import { useState } from 'react';
import { useContactStore } from '../store/contactStore';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });

  const { addMessage } = useContactStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    try {
      setIsSubmitting(true);

      await new Promise(resolve => setTimeout(resolve, 1000));

      addMessage({
        ...formData,
        submittedAt: new Date(),
      });

      setSubmitSuccess(true);
      setFormData({ firstName: '', lastName: '', phone: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('เกิดข้อผิดพลาดในการส่งข้อความ โปรดลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-6 animate-fade-down">ส่งข้อความถึงพวกเรา!</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          มีคำถาม ข้อเสนอแนะ หรือแนะนำเมนูใหม่ๆ? เราพร้อมรับฟังทุกความคิดเห็นของคุณ
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-secondary rounded-3xl p-8 shadow-xl border-2 border-black">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
          {submitSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">ส่งข้อความเรียบร้อยแล้ว!</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="font-semibold">ชื่อ *</label>
              <input type="text" name="firstName" id="firstName" className="input-field" value={formData.firstName} onChange={handleChange} required disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="font-semibold">นามสกุล *</label>
              <input type="text" name="lastName" id="lastName" className="input-field" value={formData.lastName} onChange={handleChange} required disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="font-semibold">เบอร์โทร</label>
              <input type="tel" name="phone" id="phone" className="input-field" value={formData.phone} onChange={handleChange} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="font-semibold">อีเมล *</label>
              <input type="email" name="email" id="email" className="input-field" value={formData.email} onChange={handleChange} required disabled={isSubmitting} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="font-semibold">ข้อความ *</label>
            <textarea name="message" id="message" rows={4} className="input-field" value={formData.message} onChange={handleChange} required disabled={isSubmitting}></textarea>
          </div>

          <div className="flex justify-center">
            <button type="submit" className="bg-gray-800 hover:bg-black text-white font-bold py-3 px-12 rounded-full" disabled={isSubmitting}>
              {isSubmitting ? 'กำลังส่ง...' : 'ส่ง'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;