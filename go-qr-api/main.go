package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/golang-jwt/jwt"
	"gonum.org/v1/gonum/mat"
)

var jwtSecret = []byte("my_password")

func main() {
	app := fiber.New()

	app.Use(cors.New())

	// Solitar token
	app.Post("/api/matrix/token", makeToken)

	app.Use(JWTMiddleware)
	app.Post("/api/matrix/qr", qrHandler)

	log.Println("Starting server on :8080")
	log.Fatal(app.Listen(":8080"))
}

func makeToken(c *fiber.Ctx) error {
	var creds struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&creds); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse JSON"})
	}

	if creds.Username == "go_api" && creds.Password == "go_password" {
		token, err := generateJWT(creds.Username)

		log.Println("Generated Go Token:", token)
		if err != nil {
			log.Fatal(err)
		}

		return c.JSON(fiber.Map{"token": token})
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid credentials"})
}

func generateJWT(username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": username,
		"exp": time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func JWTMiddleware(c *fiber.Ctx) error {
	// Obtiene el token de la solicitud de autorización del encabezado
	tokenString := c.Get("Authorization")

	// Verifica que el token no esté vacío
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).SendString("Missing token")
	}

	// Extrae el token de la cadena "Bearer <token>"
	tokenString = tokenString[7:]

	// Parsea y verifica el token JWT
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Verifica que el método de firma sea válido
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return jwtSecret, nil
	})

	// Verifica si el token es válido
	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).SendString("Invalid token")
	}

	// Si el token es válido, permite continuar con la solicitud
	return c.Next()
}

func qrHandler(c *fiber.Ctx) error {
	var matrix [][]float64
	if err := json.Unmarshal(c.Body(), &matrix); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Validar la longitud de todas las filas
	if !validateMatrix(matrix) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Mismatched row lengths",
		})
	}

	qrResult, err := QrFactorization(matrix)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(qrResult)
}

func QrFactorization(matrix [][]float64) (map[string][][]float64, error) {
	rows := len(matrix)
	cols := len(matrix[0])
	data := make([]float64, 0, rows*cols)
	for _, row := range matrix {
		data = append(data, row...)
	}

	a := mat.NewDense(rows, cols, data)
	var qr mat.QR
	qr.Factorize(a)

	q := new(mat.Dense)
	qr.QTo(q)

	r := new(mat.Dense)
	qr.RTo(r)

	qData := matrixToSlice(q)
	rData := matrixToSlice(r)

	return map[string][][]float64{"Q": qData, "R": rData}, nil
}

func matrixToSlice(m mat.Matrix) [][]float64 {
	r, c := m.Dims()
	data := make([][]float64, r)
	for i := range data {
		data[i] = make([]float64, c)
		for j := range data[i] {
			data[i][j] = m.At(i, j)
		}
	}
	return data
}

// Función para validar la longitud de todas las filas de la matriz
func validateMatrix(matrix [][]float64) bool {
	if len(matrix) == 0 {
		return false
	}
	expectedCols := len(matrix[0])
	for _, row := range matrix {
		if len(row) != expectedCols {
			return false
		}
	}
	return true
}
