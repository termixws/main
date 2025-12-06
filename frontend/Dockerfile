FROM node:22-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

# ← ДОБАВИТЬ ЭТУ СТРОКУ
RUN yarn add -D typescript

COPY . .

ENV CI=false

RUN yarn build

FROM nginx:alpine

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]