# Utiliza una imagen base de Node.js con soporte para TypeScript //TODO: PASAR COMENTARIO A INGLES
FROM node:16-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Expone el puerto en el que la aplicación va a escuchar
EXPOSE 3001

# Define el comando para iniciar la aplicación
CMD ["npm", "start"]
