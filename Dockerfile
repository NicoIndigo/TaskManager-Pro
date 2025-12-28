# Etapa 1: Construir Frontend Angular
FROM node:18 AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build -- --configuration production

# Etapa 2: Configurar Backend
FROM node:18
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Copiar archivos estáticos del frontend construido al directorio public del backend
# Nota: Ajustar la ruta si la versión de Angular cambia
COPY --from=frontend-build /app/dist/frontend/browser ./public

EXPOSE 3000
CMD ["node", "server.js"]
