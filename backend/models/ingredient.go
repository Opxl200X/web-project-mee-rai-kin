package models

type Ingredient struct {
	ID              uint    `gorm:"primaryKey" json:"id"`
	Name            string  `json:"name"`
	Unit            string  `json:"unit"`
	NutrientType    string  `json:"nutrient_type"`
	CaloriesPerUnit float64 `json:"calories_per_unit"`
}
