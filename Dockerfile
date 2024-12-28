# Fase de construcción (build)
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Fase de producción (run)
FROM node:18

WORKDIR /usr/src/app

# Copiar dependencias desde la fase build
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copiar todo el código fuente
COPY . .

# Exponer el puerto
EXPOSE 3000

# Ejecutar migraciones de Prisma en el contenedor antes de iniciar la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
