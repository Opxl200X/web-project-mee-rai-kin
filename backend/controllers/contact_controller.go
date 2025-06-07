package controllers

import (
	"mee-rai-kin-backend/config"
	"mee-rai-kin-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SubmitContactMessage(c *gin.Context) {
	var contact models.Contact
	if err := c.ShouldBindJSON(&contact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}
	config.DB.Create(&contact)
	c.JSON(http.StatusOK, gin.H{"message": "ส่งข้อความสำเร็จ"})
}
