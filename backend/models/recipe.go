package models

import (
	"time"
)

type Recipe struct {
	ID              uint     `gorm:"primaryKey" json:"id"`
	Name            string   `json:"name"`
	CookingTime     int      `json:"cooking_time"`
	Difficulty      string   `json:"difficulty"` // ENUM managed in app
	TotalCalories   float64  `json:"total_calories"`
	Instructions    string   `json:"instructions"`
	ImageURL        string   `json:"image_url"`
	VideoURL        string   `json:"video_url"`
	CreatedByAdmin  bool     `json:"created_by_admin"`
	CreatedAt       time.Time
	DietType        string   `json:"diet_type"`
	ViewCount       int      `json:"view_count"`
}
