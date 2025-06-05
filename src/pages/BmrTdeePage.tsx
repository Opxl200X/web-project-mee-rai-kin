import { useState } from 'react';
import { Weight, Ruler, Calendar, Activity } from 'lucide-react';

interface BMRResults {
  bmr: number;
  sedentary: number;
  light: number;
  moderate: number;
  active: number;
  veryActive: number;
}

const BmrTdeePage = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [results, setResults] = useState<BMRResults | null>(null);
  
  const calculateBMR = () => {
    if (!weight || !height || !age || !gender) {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    
    const weightVal = parseFloat(weight);
    const heightVal = parseFloat(height);
    const ageVal = parseInt(age);
    
    let bmr: number;
    
    if (gender === 'male') {
      bmr = 10 * weightVal + 6.25 * heightVal - 5 * ageVal + 5;
    } else {
      bmr = 10 * weightVal + 6.25 * heightVal - 5 * ageVal - 161;
    }
    
    setResults({
      bmr,
      sedentary: bmr * 1.2,
      light: bmr * 1.375,
      moderate: bmr * 1.55,
      active: bmr * 1.725,
      veryActive: bmr * 1.9
    });
  };
  
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">คำนวณ BMR & TDEE</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            คำนวณความต้องการพลังงานของร่างกาย <br /> เพื่อควบคุมน้ำหนักและวางแผนอาหารให้เหมาะสม
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Calculator Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">กรอกข้อมูลของคุณ</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Weight size={20} className="text-primary" />
                  <label htmlFor="weight" className="font-medium">
                    น้ำหนัก (กิโลกรัม)
                  </label>
                </div>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="input-field"
                  placeholder="กรอกน้ำหนักตัว"
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Ruler size={20} className="text-primary" />
                  <label htmlFor="height" className="font-medium">
                    ส่วนสูง (เซนติเมตร)
                  </label>
                </div>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="input-field"
                  placeholder="กรอกส่วนสูง"
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-primary" />
                  <label htmlFor="age" className="font-medium">
                    อายุ (ปี)
                  </label>
                </div>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input-field"
                  placeholder="กรอกอายุ"
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-medium">เพศ</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      className="mr-2 accent-primary w-5 h-5"
                    />
                    ชาย
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      className="mr-2 accent-primary w-5 h-5"
                    />
                    หญิง
                  </label>
                </div>
              </div>
              
              <button
                onClick={calculateBMR}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors duration-300"
              >
                คำนวณ
              </button>
            </div>
          </div>
          
          {/* Results */}
          <div className="bg-secondary rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">ผลการคำนวณ</h2>
            
            {results ? (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl">
                  <h3 className="font-bold text-lg mb-1">BMR (Basal Metabolic Rate)</h3>
                  <p className="text-sm text-gray-600 mb-2">อัตราการเผาผลาญพลังงานพื้นฐานที่ร่างกายใช้ในการรักษาการทำงานของระบบต่างๆ</p>
                  <p className="text-3xl font-bold text-primary">{Math.round(results.bmr)} กิโลแคลอรี่/วัน</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">TDEE (Total Daily Energy Expenditure)</h3>
                  <p className="text-sm text-gray-700">พลังงานทั้งหมดที่ร่างกายใช้ต่อวันตามระดับกิจกรรม</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-gray-500" />
                      <div className="flex-1 bg-white p-3 rounded-lg flex justify-between">
                        <span>ไม่ค่อยได้ออกกำลังกาย</span>
                        <span className="font-bold">{Math.round(results.sedentary)} kcal</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-gray-500" />
                      <div className="flex-1 bg-white p-3 rounded-lg flex justify-between">
                        <span>ออกกำลังกายเบาๆ <br /> 1-3 วัน/สัปดาห์</span>
                        <span className="font-bold">{Math.round(results.light)} kcal</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-gray-500" />
                      <div className="flex-1 bg-white p-3 rounded-lg flex justify-between">
                        <span>ออกกำลังกายปานกลาง <br />  3-5 วัน/สัปดาห์</span>
                        <span className="font-bold">{Math.round(results.moderate)} kcal</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-gray-500" />
                      <div className="flex-1 bg-white p-3 rounded-lg flex justify-between">
                        <span>ออกกำลังกายหนัก <br /> 6-7 วัน/สัปดาห์</span>
                        <span className="font-bold">{Math.round(results.active)} kcal</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-gray-500" />
                      <div className="flex-1 bg-white p-3 rounded-lg flex justify-between">
                        <span>ออกกำลังกายหนักมาก <br /> (วันละ 2 ครั้ง)</span>
                        <span className="font-bold">{Math.round(results.veryActive)} kcal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-lg text-gray-600 mb-4">กรุณากรอกข้อมูลและกดคำนวณ</p>
                <div className="flex items-center gap-2 text-primary">
                  <Activity size={24} />
                  <span className="font-bold">เพื่อดูผลลัพธ์</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Explanation */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">ทำความเข้าใจ BMR และ TDEE</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">BMR คืออะไร?</h3>
              <p className="text-gray-700">
                Basal Metabolic Rate หรือ อัตราการเผาผลาญพลังงานพื้นฐาน คือปริมาณพลังงานที่ร่างกายใช้ในการรักษาการทำงานของอวัยวะต่างๆ 
                เช่น การหายใจ การเต้นของหัวใจ การทำงานของสมอง ฯลฯ แม้ในขณะที่นอนหลับหรือไม่ได้ทำกิจกรรมใดๆ
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-3">TDEE คืออะไร?</h3>
              <p className="text-gray-700">
                Total Daily Energy Expenditure หรือ พลังงานทั้งหมดที่ร่างกายใช้ต่อวัน คือปริมาณพลังงานทั้งหมดที่ร่างกายใช้ในแต่ละวัน 
                รวมถึงกิจกรรมต่างๆ ที่คุณทำในชีวิตประจำวัน และการออกกำลังกาย TDEE = BMR × ค่าตัวคูณตามระดับกิจกรรม
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-3">การนำไปใช้</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <span className="font-semibold">ต้องการลดน้ำหนัก:</span> รับประทานอาหารให้น้อยกว่า TDEE ประมาณ 500 กิโลแคลอรี่ต่อวัน
              </li>
              <li>
                <span className="font-semibold">ต้องการรักษาน้ำหนัก:</span> รับประทานอาหารเท่ากับ TDEE
              </li>
              <li>
                <span className="font-semibold">ต้องการเพิ่มน้ำหนัก/กล้ามเนื้อ:</span> รับประทานอาหารมากกว่า TDEE ประมาณ 300-500 กิโลแคลอรี่ต่อวัน
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BmrTdeePage;