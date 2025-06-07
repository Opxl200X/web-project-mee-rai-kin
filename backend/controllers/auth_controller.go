package controllers

import (
	"mee-rai-kin-backend/config"
	"mee-rai-kin-backend/models"
	"mee-rai-kin-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var input models.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	var existing models.User
	if err := config.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "มีผู้ใช้งานอีเมลนี้แล้ว"})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถสร้างบัญชีได้"})
		return
	}

	user := models.User{
		Username:     input.Username,
		Email:        input.Email,
		PasswordHash: string(hashed),
	}
	config.DB.Create(&user)

	token, err := utils.GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "สร้าง Token ไม่สำเร็จ"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "ลงทะเบียนสำเร็จ", "token": token})
}

func Login(c *gin.Context) {
	var input models.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "อีเมลหรือรหัสผ่านไม่ถูกต้อง"})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "ไม่พบผู้ใช้นี้"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "รหัสผ่านไม่ถูกต้อง"})
		return
	}

	token, err := utils.GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "สร้าง Token ไม่สำเร็จ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "เข้าสู่ระบบสำเร็จ", "token": token})
}

func RegisterUser(c *gin.Context) {
	Register(c)
}

func LoginUser(c *gin.Context) {
	Login(c)
}
