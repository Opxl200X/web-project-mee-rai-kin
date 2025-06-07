package utils

import (
	"fmt"
	"mime/multipart"
	"os"
	"strconv"

	"github.com/xuri/excelize/v2"
	"mee-rai-kin-backend/config"
	"mee-rai-kin-backend/models"
)

// ใช้เมื่อ import ผ่าน POST multipart
func ImportExcel(file multipart.File) error {
	f, err := excelize.OpenReader(file)
	if err != nil {
		return err
	}

	return processExcel(f)
}

// ใช้เมื่อ import จาก path โดยตรง (เช่นใน main.go)
func ImportExcelData(path string) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()

	f, err := excelize.OpenReader(file)
	if err != nil {
		return err
	}

	return processExcel(f)
}

// processExcel: ฟังก์ชันกลางสำหรับ import 3 ชีต
func processExcel(f *excelize.File) error {
	// ----- Sheet: ingredients -----
	rows, err := f.GetRows("ingredients")
	if err != nil {
		return fmt.Errorf("error reading 'ingredients': %w", err)
	}
	for i, row := range rows {
		if i == 0 || len(row) < 4 {
			continue
		}
		calories, _ := strconv.ParseFloat(row[3], 64)
		ingredient := models.Ingredient{
			Name:            row[0],
			Unit:            row[1],
			NutrientType:    row[2],
			CaloriesPerUnit: calories,
		}
		config.DB.Create(&ingredient)
	}
	fmt.Println("✅ นำเข้าข้อมูล ingredients สำเร็จ")

	// ----- Sheet: recipes -----
	rows, err = f.GetRows("recipes")
	if err != nil {
		return fmt.Errorf("error reading 'recipes': %w", err)
	}
	for i, row := range rows {
		if i == 0 || len(row) < 8 {
			continue
		}
		cookingTime, _ := strconv.Atoi(row[1])
		totalCalories, _ := strconv.ParseFloat(row[3], 64)
		isAdmin := row[6] == "true"
		videoURL := ""
		if len(row) > 8 {
			videoURL = row[8]
		}
		viewCount := 0
		if len(row) > 9 {
			viewCount, _ = strconv.Atoi(row[9])
		}

		recipe := models.Recipe{
			Name:           row[0],
			CookingTime:    cookingTime,
			Difficulty:     row[2],
			TotalCalories:  totalCalories,
			Instructions:   row[4],
			ImageURL:       row[5],
			CreatedByAdmin: isAdmin,
			DietType:       row[7],
			VideoURL:       videoURL,
			ViewCount:      viewCount,
		}
		config.DB.Create(&recipe)
	}
	fmt.Println("✅ นำเข้าข้อมูล recipes สำเร็จ")

	// ----- Sheet: recipe_ingredient -----
	rows, err = f.GetRows("recipe_ingredient")
	if err != nil {
		return fmt.Errorf("error reading 'recipe_ingredient': %w", err)
	}
	for i, row := range rows {
		if i == 0 || len(row) < 3 {
			continue
		}
		recipeID, _ := strconv.Atoi(row[0])
		ingredientID, _ := strconv.Atoi(row[1])
		quantity, _ := strconv.ParseFloat(row[2], 64)

		ri := models.RecipeIngredient{
			RecipeID:     uint(recipeID),
			IngredientID: uint(ingredientID),
			Quantity:     quantity,
		}
		config.DB.Create(&ri)
	}
	fmt.Println("✅ นำเข้าข้อมูล recipe_ingredient สำเร็จ")

	return nil
}
