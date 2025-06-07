package models

type RecipeIngredient struct {
	ID           uint    `gorm:"primaryKey" json:"id"`
	RecipeID     uint    `json:"recipe_id"`
	IngredientID uint    `json:"ingredient_id"`
	Quantity     float64 `json:"quantity"`
	Calories     float64 `json:"calories"`
}
