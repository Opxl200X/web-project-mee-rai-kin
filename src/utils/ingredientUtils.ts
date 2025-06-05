import { Ingredient } from '../store/recipeStore';

export function enrichIngredientsAndCalculateCalories(
  ingredients: Ingredient[]
): { enriched: Ingredient[]; totalCalories: number } {
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
}
