# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app-front

# Copia el archivo package.json e instala las dependencias
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copia los archivos de la aplicación al directorio de trabajo del contenedor
COPY . .

#Copiar .env
COPY .env .env

# Construye la aplicación React
RUN npm run build

# Instalar un servidor HTTP estático para servir la aplicación
RUN npm install -g serve

# Expone el puerto en el contenedor
EXPOSE 3000

# Ejecuta el comando para iniciar la aplicación cuando se ejecute el contenedor
CMD ["serve", "-s", "build"]
