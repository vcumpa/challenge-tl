# go-api/Dockerfile
FROM golang:1.22.4

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los módulos Go manifest
COPY go.mod ./
COPY go.sum ./
# Instalar dependencias
RUN go mod tidy

# Copia los archivos de la aplicación al directorio de trabajo del contenedor
COPY . .

# Construye la aplicación Go
RUN go build -o /go-qr-api

# Expone el puerto en el contenedor
EXPOSE 8080

# Ejecuta el comando para iniciar la aplicación
CMD ["/go-qr-api"]