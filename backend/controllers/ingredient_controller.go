package controllers

import (
	"mee-rai-kin-backend/config"
	"mee-rai-kin-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllIngredients(c *gin.Context) {
	var ingredients []models.Ingredient
	config.DB.Find(&ingredients)
	c.JSON(http.StatusOK, ingredients)
}
