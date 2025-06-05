import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRecipeStore } from '../store/recipeStore';
import RecipeCard from '../components/recipe/RecipeCard';
import { Edit, User, Weight, Ruler, Calendar, Activity } from 'lucide-react';

const ProfilePage = () => {
  const { isAuthenticated, user, updateProfile } = useAuthStore();
  const { recipes, favoriteRecipes } = useRecipeStore();
  const navigate = useNavigate();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    weight: '',
    height: '',
    age: '',
    gender: '',
    activityLevel: '',
    profileImage: user?.profileImage || ''
  });
  
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  
  // Favorite recipes
  const favoriteRecipesList = recipes.filter(recipe => 
    favoriteRecipes.includes(recipe.id)
  );
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/signin');
    }
    
    // Set BMR and TDEE from user if available
    if (user?.bmr) setBmr(user.bmr);
    if (user?.tdee) setTdee(user.tdee);
    
  }, [isAuthenticated, navigate, user]);
  
  const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };
  
  const calculateTDEE = (bmr: number, activityLevel: string) => {
    const levels: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    return bmr * (levels[activityLevel] || 1);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    // Calculate BMR and TDEE when relevant fields change
    if (['weight', 'height', 'age', 'gender'].includes(name)) {
      const weight = parseFloat(name === 'weight' ? value : profileData.weight);
      const height = parseFloat(name === 'height' ? value : profileData.height);
      const age = parseInt(name === 'age' ? value : profileData.age);
      const gender = name === 'gender' ? value : profileData.gender;
      
      if (weight && height && age && gender) {
        const calculatedBMR = calculateBMR(weight, height, age, gender);
        setBmr(calculatedBMR);
        
        // Update TDEE if activity level is set
        if (profileData.activityLevel) {
          setTdee(calculateTDEE(calculatedBMR, profileData.activityLevel));
        }
      }
    }
    
    // Update TDEE when activity level changes
    if (name === 'activityLevel' && bmr) {
      setTdee(calculateTDEE(bmr, value));
    }
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData(prev => ({ 
          ...prev, 
          profileImage: event.target?.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user profile
    updateProfile({
      username: profileData.username,
      profileImage: profileData.profileImage,
      bmr: bmr || undefined,
      tdee: tdee || undefined
    });
    
    // Close modal
    setShowEditModal(false);
  };
  
  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12 flex justify-center">
          <div className="flex flex-col items-center text-center gap-6">
            <img
              src={user.profileImage || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
              alt="รูปโปรไฟล์"
              className="w-40 h-40 rounded-full object-cover shadow-md border-4 border-primary"
            />
            
            <div className="flex-1 flex flex-col items-center text-center">
  <h1 className="text-3xl font-bold text-primary mb-2 break-words max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
    {user.username}
  </h1>
  
  <p className="text-gray-600 mb-1 break-words">{user.email}</p>

  {(bmr || user.bmr) && (
    <p className="text-gray-700 font-medium mt-4">
      BMR: {bmr || user.bmr} kcal 
      {(tdee || user.tdee) && ` | TDEE: ${tdee || user.tdee} kcal`}
    </p>
  )}

  <button
    onClick={() => setShowEditModal(true)}
    className="mt-6 bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-full flex items-center gap-2"
  >
    <Edit size={16} />
    <span>แก้ไขโปรไฟล์</span>
  </button>
</div>

          </div>
        </section>
        
        {/* Favorite Recipes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">เมนูโปรดของคุณ</h2>
          
          {favoriteRecipesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRecipesList.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-600">คุณยังไม่มีเมนูโปรด</p>
              <button
                onClick={() => navigate('/search')}
                className="mt-4 bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-full"
              >
                ค้นหาเมนูอาหาร
              </button>
            </div>
          )}
        </section>
      </div>
      
      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">แก้ไขโปรไฟล์ของคุณ</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-gray-500" />
                  <label htmlFor="username" className="block font-medium">
                    ชื่อผู้ใช้ใหม่
                  </label>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="กรอกชื่อผู้ใช้ใหม่"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label htmlFor="profileImage" className="block font-medium">
                    เลือกรูปภาพโปรไฟล์
                  </label>
                </div>
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary-dark"
                />
                {profileData.profileImage && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={profileData.profileImage}
                      alt="รูปโปรไฟล์"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Weight size={20} className="text-gray-500" />
                    <label htmlFor="weight" className="block font-medium">
                      น้ำหนักตัว (กิโลกรัม)
                    </label>
                  </div>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    placeholder="กรอกน้ำหนัก (กก.)"
                    min="1"
                    max="500"
                    value={profileData.weight}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Ruler size={20} className="text-gray-500" />
                    <label htmlFor="height" className="block font-medium">
                      ส่วนสูง (เซนติเมตร)
                    </label>
                  </div>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    placeholder="กรอกส่วนสูง (ซม.)"
                    min="30"
                    max="300"
                    value={profileData.height}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-gray-500" />
                    <label htmlFor="age" className="block font-medium">
                      อายุ (ปี)
                    </label>
                  </div>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    placeholder="กรอกอายุ (ปี)"
                    min="1"
                    max="120"
                    value={profileData.age}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-500" />
                    <label htmlFor="gender" className="block font-medium">
                      เลือกเพศ
                    </label>
                  </div>
                  <select
                    id="gender"
                    name="gender"
                    value={profileData.gender}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="" disabled>เลือกเพศ</option>
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="font-medium text-lg">
                  <strong>BMR (พลังงานที่ร่างกายใช้พื้นฐาน): </strong>
                  <span className="text-primary font-bold">{bmr ? bmr.toFixed(1) : '-'}</span> กิโลแคลอรี่
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Activity size={20} className="text-gray-500" />
                  <label htmlFor="activityLevel" className="block font-medium">
                    เลือกระดับการออกกำลังกาย
                  </label>
                </div>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={profileData.activityLevel}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="" disabled>เลือกระดับการออกกำลังกาย</option>
                  <option value="sedentary">ทำงานอยู่กับที่</option>
                  <option value="light">ออกกำลังกายเบาๆ 1-3 วันต่อสัปดาห์</option>
                  <option value="moderate">ออกกำลังกายปานกลาง 3-5 วันต่อสัปดาห์</option>
                  <option value="active">ออกกำลังกายหนัก 6-7 วันต่อสัปดาห์</option>
                  <option value="veryActive">ออกกำลังกายหนักมากเป็นพิเศษ</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">
                  <strong>พลังงานขั้นต่ำ (TDEE): </strong>
                  <span className="text-primary font-bold">{tdee ? tdee.toFixed(1) : '-'}</span> กิโลแคลอรี่
                </p>
              </div>
              
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="py-2 px-6 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-lg"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;