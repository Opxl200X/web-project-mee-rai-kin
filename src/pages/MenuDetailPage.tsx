import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipeStore, Recipe, Ingredient } from '../store/recipeStore';
import { useAuthStore } from '../store/authStore';
import { Star, Share2, Clock, BarChart2, Flame } from 'lucide-react';

interface IngredientWithAmount extends Ingredient {
  isUsed: boolean;
  amount: number;
}

const MenuDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthStore();
  const { getRecipeById, toggleFavorite, favoriteRecipes } = useRecipeStore();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<IngredientWithAmount[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      const recipeData = getRecipeById(id);
      if (recipeData) {
        setRecipe(recipeData);
        setIsFavorite(favoriteRecipes.includes(id));
        const initialIngredients = recipeData.ingredients.map(ingredient => ({
          ...ingredient,
          isUsed: true,
          amount: 0,
        }));
        setIngredients(initialIngredients);
      } else {
        setNotFound(true);
      }
    }
  }, [id, getRecipeById, favoriteRecipes]);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มในรายการโปรด');
      navigate(`/signin?redirect=/menu/${id}`);
      return;
    }

    if (id) {
      toggleFavorite(id);
      setIsFavorite(!isFavorite);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe?.title || 'เมนูอาหาร',
          text: `เมนู ${recipe?.title || 'อาหาร'} จาก Mee Rai Kin`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('คัดลอกลิงก์เรียบร้อยแล้ว!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleToggleIngredient = (index: number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].isUsed = !updatedIngredients[index].isUsed;
    if (!updatedIngredients[index].isUsed) {
      updatedIngredients[index].amount = 0;
    }
    setIngredients(updatedIngredients);
    calculateTotalCalories(updatedIngredients);
  };

  const handleAmountChange = (index: number, value: string) => {
    const amount = parseFloat(value) || 0;
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].amount = amount;
    setIngredients(updatedIngredients);
    calculateTotalCalories(updatedIngredients);
  };

  const calculateTotalCalories = (ingredientsList: IngredientWithAmount[]) => {
    let total = 0;
    ingredientsList.forEach(ingredient => {
      if (ingredient.isUsed && ingredient.amount > 0) {
        total += ingredient.amount * ingredient.caloriesPerUnit;


      }
    });
    setTotalCalories(total);
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'ง่าย';
      case 'medium':
        return 'ปานกลาง';
      case 'hard':
        return 'ยาก';
      default:
        return difficulty;
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">ไม่พบเมนูที่คุณค้นหา</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/2">
            <div className="relative rounded-xl overflow-hidden h-64">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{recipe.title}</h1>
              <div className="flex gap-3">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    isAuthenticated
                      ? isFavorite
                        ? 'text-yellow-500'
                        : 'text-gray-400 hover:text-yellow-500'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                  aria-label={
                    isAuthenticated
                      ? isFavorite
                        ? 'ลบออกจากรายการโปรด'
                        : 'เพิ่มในรายการโปรด'
                      : 'กรุณาเข้าสู่ระบบ'
                  }
                >
                  <Star size={24} fill={isAuthenticated && isFavorite ? 'currentColor' : 'none'} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-primary-dark rounded-full transition-colors duration-300"
                  aria-label="แชร์เมนูนี้"
                >
                  <Share2 size={24} />
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                <Clock size={16} />
                <span>{recipe.cookTime} นาที</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                <BarChart2 size={16} />
                <span>{getDifficultyText(recipe.difficulty)}</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                <Flame size={16} className="text-orange-500" />
                <span>{recipe.calories} cal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">วัตถุดิบ</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">สถานะ</th>
                  <th className="py-3 px-4 text-left">วัตถุดิบ</th>
                  <th className="py-3 px-4 text-left">สารอาหาร</th>
                  <th className="py-3 px-4 text-left">แคลอรี่/หน่วย</th>
                  <th className="py-3 px-4 text-left">ปริมาณ (กรัม/หน่วย)</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient, index) => (
                  <tr key={ingredient.id} className="border-b border-gray-200">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleIngredient(index)}
                        className={`font-bold text-xl ${
                          ingredient.isUsed ? 'text-primary' : 'text-red-500'
                        }`}
                      >
                        {ingredient.isUsed ? '✔️' : '❌'}
                      </button>
                    </td>
                    <td
                      className={`py-3 px-4 ${
                        !ingredient.isUsed ? 'line-through text-gray-400' : ''
                      }`}
                    >
                      {ingredient.name}
                    </td>
                    <td className="py-3 px-4">{ingredient.nutrition}</td>
                    <td className="py-3 px-4">
                      {ingredient.caloriesPerUnit} cal/{ingredient.unit}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        className="w-20 p-2 border border-gray-300 rounded text-center"
                        value={ingredient.amount || ''}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                        disabled={!ingredient.isUsed}
                        min="0"
                        placeholder={ingredient.unit}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-xl font-bold text-center text-primary animate-pulse">
            แคลอรี่รวม: {totalCalories.toFixed(0)} cal
          </div>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">วิธีทำ</h2>
          <ol className="list-decimal pl-6 space-y-3">
            {recipe.steps.map((step, index) => (
              <li key={index} className="text-lg">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Video */}
        {recipe.videoUrl && (
          <div>
            <h2 className="text-2xl font-bold mb-4">วิดีโอสาธิต</h2>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <video
                src={recipe.videoUrl}
                controls
                className="w-full"
                poster={recipe.imageUrl}
              ></video>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuDetailPage;
