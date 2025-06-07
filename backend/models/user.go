package models

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey"`
	Username     string    `gorm:"not null"`
	Email        string    `gorm:"not null;unique"`
	PasswordHash string    `gorm:"not null"`
	CreatedAt    time.Time `gorm:"autoCreateTime"`
}

type Profile struct {
	ID        uint `gorm:"primaryKey"`
	UserID    uint `gorm:"not null"`
	BMR       float64
	TDEE      float64
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
type RegisterInput struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}
