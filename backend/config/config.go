package config

import (
	"log"
	

	"github.com/joho/godotenv"
)

func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ ไม่พบไฟล์ .env ใช้ค่าจาก ENV ตรง")
	}
}
