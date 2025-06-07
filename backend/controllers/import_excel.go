package controllers

import (
	"mee-rai-kin-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ImportExcelHandler(c *gin.Context) {
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่สามารถรับไฟล์ได้"})
		return
	}
	defer file.Close()

	err = utils.ImportExcel(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถนำเข้าข้อมูลได้", "detail": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "นำเข้าข้อมูลสำเร็จ"})
}
