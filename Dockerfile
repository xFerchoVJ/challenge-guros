FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copiar todo el código fuente
COPY . .

# Exponer el puerto
EXPOSE 3000

RUN npx prisma generate

# Ejecutar migraciones de Prisma en el contenedor antes de iniciar la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && npm run build && npm run start:dist"]
