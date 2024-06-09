# node-api/Dockerfile
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos package json e instala las dependencias
COPY package*.json ./
RUN npm install

# Copia los archivos de la aplicación al directorio de trabajo del contenedor
COPY . .

# Expone el puerto en el contenedor
EXPOSE 3001

# Ejecuta el comando para iniciar la aplicación
CMD ["node", "src/app.js"]
