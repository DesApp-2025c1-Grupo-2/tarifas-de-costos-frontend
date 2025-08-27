# Etapa 1: Construcción de la aplicación
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir la aplicación con un servidor web ligero
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Expone el puerto 80 para acceder a la aplicación
EXPOSE 80
# Comando para iniciar Nginx cuando el contenedor se inicie
CMD ["nginx", "-g", "daemon off;"]