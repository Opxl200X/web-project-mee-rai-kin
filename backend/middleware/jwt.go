package middleware

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte(os.Getenv("JWT_SECRET"))

func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing or invalid token"})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return secretKey, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		c.Set("user_id", claims["user_id"])
		c.Next()
	}
}

func GenerateJWT(userID uint) (string, error) {
	expirationHours := 24
	if os.Getenv("TOKEN_EXPIRY_HOURS") != "" {
		expirationHours = 24 // จะมี logic เพิ่มหากต้องการ
	}

	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Duration(expirationHours) * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}
