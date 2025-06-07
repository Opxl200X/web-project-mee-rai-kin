package models

type Session struct {
	ID     uint `gorm:"primaryKey"`
	UserID uint
	Token  string
}
