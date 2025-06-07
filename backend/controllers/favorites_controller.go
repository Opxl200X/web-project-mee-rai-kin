package controllers

import (
	"mee-rai-kin-backend/config"
	"mee-rai-kin-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetFavorites(c *gin.Context) {
	userID := c.GetUint("user_id")
	var favorites []models.Favorite

	if err := config.DB.Preload("Recipe").Where("user_id = ?", userID).Find(&favorites).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงรายการโปรดได้"})
		return
	}

	var recipes []models.Recipe
	for _, fav := range favorites {
		recipes = append(recipes, fav.Recipe)
	}

	c.JSON(http.StatusOK, recipes)
}

func ToggleFavorite(c *gin.Context) {
	userID := c.GetUint("user_id")
	var input struct {
		RecipeID uint `json:"recipe_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	var favorite models.Favorite
	if err := config.DB.Where("user_id = ? AND recipe_id = ?", userID, input.RecipeID).First(&favorite).Error; err == nil {
		config.DB.Delete(&favorite)
		c.JSON(http.StatusOK, gin.H{"message": "ลบออกจากรายการโปรดแล้ว"})
		return
	}

	newFavorite := models.Favorite{
		UserID:   userID,
		RecipeID: input.RecipeID,
	}
	config.DB.Create(&newFavorite)

	c.JSON(http.StatusOK, gin.H{"message": "เพิ่มในรายการโปรดแล้ว"})
}
