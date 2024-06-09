package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"reflect"
	"testing"

	"github.com/gofiber/fiber/v2"
)

// Define la estructura de la matriz
type Matrix struct {
	Data [][]float64 `json:"data"`
}

// Define la estructura para la respuesta de la factorización QR
type QRResult struct {
	Q [][]float64 `json:"Q"`
	R [][]float64 `json:"R"`
}

func TestQRFactorization(t *testing.T) {
	matrixData := [][]float64{{1, 0}, {0, 1}}
	jsonData, err := json.Marshal(matrixData)
	if err != nil {
		t.Fatal(err)
	}
	req, err := http.NewRequest("POST", "/matrix/qr", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatal(err)
	}

	// Crea un contexto Fiber simulado
	app := fiber.New()
	app.Post("/matrix/qr", qrHandler)

	// Ejecuta la solicitud a través de Fiber
	resp, err := app.Test(req)
	if err != nil {
		t.Fatal(err)
	}

	// Verifica el código de estado HTTP
	if resp.StatusCode != http.StatusOK {
		t.Errorf("unexpected status code: got %d, want %d", resp.StatusCode, http.StatusOK)
	}

	// Verifica el cuerpo de la respuesta
	var actual QRResult
	if err := json.NewDecoder(resp.Body).Decode(&actual); err != nil {
		t.Fatal(err)
	}

	// Validando respuesta esperada
	expected := QRResult{Q: [][]float64{{1, 0}, {0, 1}}, R: [][]float64{{1, 0}, {0, 1}}}
	if !reflect.DeepEqual(actual, expected) {
		t.Errorf("unexpected response body: got %v, want %v", actual, expected)
	}
}
