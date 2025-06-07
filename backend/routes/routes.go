package routes

import (
	"mee-rai-kin-backend/controllers"
	"mee-rai-kin-backend/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

func SetupRoutes(router *gin.Engine) {
	// ✅ Middleware CORS: อนุญาตให้ frontend ดึงข้อมูลจาก backend ได้
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // เปลี่ยนเป็น domain จริงเมื่อ deploy
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 📁 Group API v1
	v1 := router.Group("/api")
	{
		// 👤 Public Routes (ไม่ต้อง login)
		v1.POST("/register", controllers.RegisterUser)
		v1.POST("/login", controllers.LoginUser)

		v1.GET("/recipes", controllers.GetAllRecipes)
		v1.GET("/recipes/:id", controllers.GetRecipeByID)
		v1.GET("/popular-recipes", controllers.GetPopularRecipes)
		v1.GET("/random-recipe", controllers.GetRandomRecipe)

		v1.GET("/ingredients", controllers.GetAllIngredients)

		v1.POST("/contact", controllers.SubmitContactMessage)

		// 🔐 Protected Routes (ต้อง login ด้วย JWT)
		auth := v1.Group("/")
		auth.Use(middleware.JWTAuthMiddleware())
		{
			auth.GET("/profile", controllers.GetProfile)
			auth.PUT("/profile", controllers.UpdateProfile)

			auth.GET("/favorites", controllers.GetFavorites)
			auth.POST("/favorites/:id", controllers.ToggleFavorite)

			auth.POST("/import", controllers.ImportExcelData) // 🧪 ใช้เฉพาะตอน dev/admin
		}
	}
}
