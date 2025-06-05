function parseQuantity(qty: number | string): number {
  if (typeof qty === 'number') return qty;
  if (qty.includes('-')) {
    const [min, max] = qty.split('-').map(Number);
    return (min + max) / 2;
  }
  if (qty.includes('/')) {
    const [num, denom] = qty.split('/').map(Number);
    return num / denom;
  }
  return parseFloat(qty);
}

function calculateTotalCalories(ingredients: Ingredient[]): number {
  return ingredients.reduce((sum, ing) => {
    const qty = parseQuantity(ing.quantity);
    return sum + (qty * ing.caloriesPerUnit);
  }, 0);
}
