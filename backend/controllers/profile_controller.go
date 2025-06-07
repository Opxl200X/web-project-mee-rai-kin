package controllers

import (
	"mee-rai-kin-backend/config"
	"mee-rai-kin-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProfile(c *gin.Context) {
	userID := c.GetUint("user_id")
	var profile models.Profile

	if err := config.DB.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลโปรไฟล์"})
		return
	}

	c.JSON(http.StatusOK, profile)
}

func UpdateProfile(c *gin.Context) {
	userID := c.GetUint("user_id")
	var input models.Profile

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	var profile models.Profile
	if err := config.DB.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		// ถ้าไม่เคยสร้าง profile มาก่อน
		newProfile := models.Profile{
			UserID: userID,
			BMR:    input.BMR,
			TDEE:   input.TDEE,
		}
		config.DB.Create(&newProfile)
		c.JSON(http.StatusOK, newProfile)
		return
	}

	profile.BMR = input.BMR
	profile.TDEE = input.TDEE
	config.DB.Save(&profile)

	c.JSON(http.StatusOK, profile)
}
