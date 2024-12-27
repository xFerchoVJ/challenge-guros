FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

FROM node:18

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
