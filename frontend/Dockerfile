FROM node:22-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# !!! ДОБАВЛЯЕМ ЭТУ СТРОКУ !!!
# Устанавливаем TypeScript явно, так как его нет в package.json
RUN yarn add typescript 

COPY . .

# Отключаем трактовку предупреждений как ошибок
ENV CI=false

# Собираем проект
RUN yarn build

# Этап production
FROM nginx:alpine
# Копируем из папки build (так как используем craco/react-scripts)
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]