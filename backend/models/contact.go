package models

import "time"

type Contact struct {
	ID        uint      `gorm:"primaryKey"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Message   string    `json:"message"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
