package controllers

import (
	"mee-rai-kin-backend/config"
	"mee-rai-kin-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllRecipes(c *gin.Context) {
	var recipes []models.Recipe
	if err := config.DB.Preload("Ingredients").Find(&recipes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงเมนูได้"})
		return
	}
	c.JSON(http.StatusOK, recipes)
}

func GetRecipeByID(c *gin.Context) {
	id := c.Param("id")
	var recipe models.Recipe
	if err := config.DB.Preload("Ingredients").First(&recipe, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบเมนูนี้"})
		return
	}
	c.JSON(http.StatusOK, recipe)
}

func GetPopularRecipes(c *gin.Context) {
	var recipes []models.Recipe
	config.DB.Order("view_count DESC").Limit(5).Find(&recipes)
	c.JSON(http.StatusOK, recipes)
}

func GetRandomRecipe(c *gin.Context) {
	var recipe models.Recipe
	config.DB.Order("RANDOM()").First(&recipe)
	c.JSON(http.StatusOK, recipe)
}
