# Usar una imagen oficial de Node.js
FROM node:18

# Crear directorio de trabajo en el contenedor
WORKDIR /

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 8080

# Comando para iniciar la app
CMD ["npm", "start"]
