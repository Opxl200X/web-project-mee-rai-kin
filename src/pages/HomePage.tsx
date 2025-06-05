
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecipeStore } from '../store/recipeStore';
import RecipeCard from '../components/recipe/RecipeCard';
import {
  ChefHat,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const HomePage = () => {
  const { recipes } = useRecipeStore(); // ใช้ recipes จาก store
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = [
    'มังสวิรัติ',
    'ฮาลาล',
    'คีโต',
    'โปรตีนสูง',
    'ฟาสต์ฟู้ด',
    'อาหารเจ',
    'อาหารคลีน',
    'สุขภาพ'
  ];

  useEffect(() => {
    const getRandomRecipes = () => {
      const shuffled = [...recipes].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 20);

      if (selectedFilters.length === 0) return selected.slice(0, 6);

      const filtered = selected.filter((recipe) =>
        selectedFilters.every((filter) => recipe.tags?.includes(filter))
      );

      return filtered.slice(0, 6);
    };

    setRandomRecipes(getRandomRecipes());
  }, [recipes, selectedFilters]);

  const displayedRecipes = recipes.slice(0, 6); // แสดงเมนูแนะนำล่าสุด

  return (
    <div>
      <section
        className="relative bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')] bg-cover bg-center text-white py-20 md:py-32"
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-xl"
              style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.7)' }}>
            มีอะไรกิน?
          </h1>
          <p className="text-xl md:text-2xl text-white text-opacity-90 leading-relaxed mb-8"
              style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
            เว็บไซต์ที่จะช่วยคุณค้นหาเมนูอาหารไทยที่ทำได้ง่าย ๆ<br />
            จากวัตถุดิบที่คุณมีอยู่แล้วในบ้าน
          </p>
          <p className="text-base md:text-lg text-white text-opacity-80 drop-shadow-sm">
            ไม่ต้องเสียเวลา ไม่ต้องเดา แค่เปิดตู้เย็น แล้วเปิดมีไรกิน
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">เราช่วยคุณได้อย่างไร</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-background rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
              <div className="flex justify-center mb-4">
                <ChefHat size={48} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">ค้นหาเมนูจากวัตถุดิบ</h3>
              <p className="text-gray-600">ใส่วัตถุดิบที่คุณมี เราจะแนะนำเมนูที่ทำได้ทันที</p>
            </div>
            <div className="text-center p-6 bg-background rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
              <div className="flex justify-center mb-4">
                <TrendingUp size={48} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">คำนวณ BMR & TDEE</h3>
              <p className="text-gray-600">คำนวณพลังงานที่ร่างกายต้องการและวางแผนอาหารให้เหมาะสม</p>
            </div>
            <div className="text-center p-6 bg-background rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
              <div className="flex justify-center mb-4">
                <DollarSign size={48} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">ประหยัดค่าใช้จ่าย</h3>
              <p className="text-gray-600">ใช้วัตถุดิบที่มีอยู่แล้วให้คุ้มค่า ลดการทิ้งอาหาร</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">เมนูแนะนำ</h2>
            <Link
              to="/search"
              className="text-primary-dark hover:text-primary font-semibold transition-colors duration-300"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
