import { Link } from 'react-router-dom';
import { Clock, BarChart, Flame } from 'lucide-react';
import { Recipe } from '../../store/recipeStore';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const getDifficultyText = (difficulty: string) => {
  switch(difficulty) {
    case 'easy': return 'ง่าย';
    case 'medium': return 'ปานกลาง';
    case 'hard': return 'ยาก';
    default: return difficulty;
  }
};

const getDifficultyIcon = (difficulty: string) => {
  switch(difficulty) {
    case 'easy': return <BarChart size={16} className="text-green-500" />;
    case 'medium': return <BarChart size={16} className="text-yellow-500" />;
    case 'hard': return <BarChart size={16} className="text-red-500" />;
    default: return <BarChart size={16} />;
  }
};

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  return (
    <Link 
      to={`/menu/${recipe.id}`} 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col"
      onClick={onClick}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
        />
      </div>
      
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.title}</h3>
        
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{recipe.cookTime} นาที</span>
          </div>
          
          <div className="flex items-center">
            {getDifficultyIcon(recipe.difficulty)}
            <span className="ml-1">{getDifficultyText(recipe.difficulty)}</span>
          </div>
          
          <div className="flex items-center">
            <Flame size={16} className="mr-1 text-orange-500" />
            <span>{recipe.calories} kcal</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;