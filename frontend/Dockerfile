FROM node:22-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
RUN yarn add typescript

COPY . .

# 1. ИСПРАВЛЕНИЕ КОНФЛИКТА: Удаляем jsconfig.json, так как теперь есть tsconfig.json
RUN rm -f jsconfig.json

# Аргументы и переменные (оставьте как было)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

ENV CI=false

RUN yarn build

FROM nginx:alpine
# 2. ИСПРАВЛЕНИЕ ПУТИ: Create React App создает папку "build", а не "dist"
COPY --from=build /app/build /usr/share/nginx/html

# Если есть конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf 

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]