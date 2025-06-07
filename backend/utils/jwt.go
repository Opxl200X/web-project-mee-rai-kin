package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

type JWTClaims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

// สร้าง JWT Token
func GenerateJWT(userID uint) (string, error) {
	claims := JWTClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(getExpiryDuration())),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// ตรวจสอบและแยกข้อมูล JWT Token
func ParseJWT(tokenStr string) (*JWTClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if claims, ok := token.Claims.(*JWTClaims); ok && token.Valid {
		return claims, nil
	} else {
		return nil, err
	}
}

func getExpiryDuration() time.Duration {
	expiryHours := 24
	if os.Getenv("TOKEN_EXPIRY_HOURS") != "" {
		if h, err := time.ParseDuration(os.Getenv("TOKEN_EXPIRY_HOURS") + "h"); err == nil {
			return h
		}
	}
	return time.Duration(expiryHours) * time.Hour
}
