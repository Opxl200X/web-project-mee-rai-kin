import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipeStore } from '../store/recipeStore';
import { ChevronRight } from 'lucide-react';

const RandomMenuPage = () => {
  const { recipes, getRandomRecipe } = useRecipeStore();
  const [currentRecipe, setCurrentRecipe] = useState(getRandomRecipe());
  const [isLoading, setIsLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentRecipe && recipes.length > 0) {
      setCurrentRecipe(getRandomRecipe());
    }
  }, [currentRecipe, getRandomRecipe, recipes]);
  
  const handleRandomize = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setAnimating(true);
    
    setTimeout(() => {
      setCurrentRecipe(getRandomRecipe());
      setIsLoading(false);
      setTimeout(() => setAnimating(false), 300);
    }, 500);
  };
  
  const handleViewRecipe = () => {
    if (currentRecipe) {
      navigate(`/menu/${currentRecipe.id}`);
    }
  };
  
  if (!currentRecipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">ไม่พบเมนูอาหาร</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-16 px-4 animated-gradient">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8 animate-fade-down">สุ่มเมนูอาหาร</h1>
        
        <div className={`
          bg-white p-8 md:p-12 rounded-3xl shadow-xl mb-12 transform transition-all duration-500 
          ${animating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}
        `}>
          <div className="relative w-full h-64 md:h-96 mb-6 overflow-hidden rounded-xl">
            <img 
              src={currentRecipe.imageUrl}
              alt={currentRecipe.title}
              className="w-full h-full object-cover transform transition-all duration-500 hover:scale-105"
              style={{ filter: 'brightness(100%)' }}
            />
            
            <button 
              onClick={handleViewRecipe}
              className="absolute right-4 bottom-4 bg-accent text-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-[#ff3c3c] transition-colors duration-300"
            >
              แสดงวิธีการทำ
              <ChevronRight size={18} />
            </button>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">{currentRecipe.title}</h2>
          
          <div className="flex justify-center gap-6 mb-6">
            <div className="px-4 py-2 bg-pink-100 rounded-full font-medium">
              ⏱️ {currentRecipe.cookTime} นาที
            </div>
            <div className="px-4 py-2 bg-blue-100 rounded-full font-medium">
              📊 {currentRecipe.difficulty === 'easy' ? 'ง่าย' : 
                   currentRecipe.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}
            </div>
            <div className="px-4 py-2 bg-yellow-100 rounded-full font-medium">
              🔥 {currentRecipe.calories} แคลอรี่
            </div>
          </div>
        </div>
        
        <button
          onClick={handleRandomize}
          disabled={isLoading}
          className={`
            bg-[#ffc7ec] hover:bg-[#ff9ce3] text-gray-800 font-bold text-xl py-4 px-8
            rounded-full shadow-lg transition-all duration-300 transform hover:scale-105
            active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? 'กำลังสุ่ม...' : 'กดเพื่อสุ่มเมนู'}
        </button>
        
        <p className="mt-6 text-xl font-semibold text-accent">
          แค่คลิกเบาๆ เมนูเด็ดก็มาถูกใจ ไม่ต้องเสียเวลา!
        </p>
      </div>
    </div>
  );
};

export default RandomMenuPage;
