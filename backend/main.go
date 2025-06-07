package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"mee-rai-kin-backend/config"
	"mee-rai-kin-backend/middleware"
	"mee-rai-kin-backend/models"
	"mee-rai-kin-backend/routes"
	"mee-rai-kin-backend/utils"
)

func main() {
	// โหลดตัวแปรจากไฟล์ .env
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ ไม่พบไฟล์ .env หรือโหลดไม่สำเร็จ:", err)
	}

	// เชื่อมต่อฐานข้อมูล
	config.ConnectDatabase()

	// AutoMigrate ตารางทั้งหมด
	config.DB.AutoMigrate(
		&models.User{},
		&models.Profile{},
		&models.Ingredient{},
		&models.Recipe{},
		&models.RecipeIngredient{},
		&models.Favorite{},
		&models.Contact{},
		&models.RecommendedRecipe{},
		&models.Session{},
	)

	// นำเข้าข้อมูลจาก Excel
	if err := utils.ImportExcelData("Meeraikin.xlsx"); err != nil {
		log.Println("⚠️ Import Excel ล้มเหลว:", err)
	}

	// ตั้งค่า Router
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	// ตั้งค่า routes ทั้งหมด
	routes.SetupRoutes(router)

	log.Println("✅ Server started at http://localhost:8080")
	router.Run(":8080")
}
