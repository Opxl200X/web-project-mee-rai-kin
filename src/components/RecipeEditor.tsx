import React from 'react';
import { Ingredient, Recipe } from '../store/recipeStore';
import IngredientInput from './IngredientInput';

// ✅ แทรกฟังก์ชันคำนวณแคลอรี่ตรงนี้ (ถ้าไม่แยก utils)
const enrichIngredientsAndCalculateCalories = (
  ingredients: Ingredient[]
): { enriched: Ingredient[]; totalCalories: number } => {
  let total = 0;
  const enriched = ingredients.map((ing) => {
    const calories = ing.caloriesPerUnit * ing.quantity;
    total += calories;
    return {
      ...ing,
      calculatedCalories: calories,
    };
  });
  return { enriched, totalCalories: total };
};

interface RecipeEditorProps {
  recipe: Recipe;
  setRecipe: (recipe: Recipe) => void;
}

const RecipeEditor: React.FC<RecipeEditorProps> = ({ recipe, setRecipe }) => {
  // ✅ เรียกฟังก์ชันเพื่อคำนวณทุกครั้งที่ render
  const { enriched: enrichedIngredients, totalCalories } =
    enrichIngredientsAndCalculateCalories(recipe.ingredients);

  const handleIngredientChange = (updatedIngredient: Ingredient, index: number) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = updatedIngredient;
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      nutrition: '',
      caloriesPerUnit: 0,
      unit: '',
      quantity: 0,
    };
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, newIngredient] });
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">วัตถุดิบในสูตร</h2>

      {enrichedIngredients.map((ingredient, index) => (
        <IngredientInput
          key={ingredient.id}
          ingredient={ingredient}
          onChange={(updatedIngredient) => handleIngredientChange(updatedIngredient, index)}
        />
      ))}

      <button
        onClick={addIngredient}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ➕ เพิ่มวัตถุดิบ
      </button>

      <div className="mt-6 text-right text-lg font-bold text-green-700">
        แคลอรี่รวม: {totalCalories.toFixed(2)} cal
      </div>
    </div>
  );
};

export default RecipeEditor;
