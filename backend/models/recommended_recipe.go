package models

import "time"

type RecommendedRecipe struct {
	ID        uint      `gorm:"primaryKey"`
	RecipeID  uint      `gorm:"not null"`
	Reason    string    `json:"reason"` // เหตุผลที่แนะนำ เช่น "ยอดนิยม", "สุขภาพดี"
	CreatedAt time.Time
}
