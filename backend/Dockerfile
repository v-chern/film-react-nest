# Задаем базовый образ для этапа сборки
FROM node:24-alpine as be_build
# Задаем рабочую директорию
WORKDIR /app
# Копируем список зависимостей и лок-файл отдельно от файлов проекта
# напомним, это нужно для кэширования установки зависимостей
COPY package*.json ./
# Устанавливаем зависимости
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine As be_production
ENV NODE_ENV=production
COPY --from=be_build /app/package*.json ./
# Флаг --omit=dev означает "не ставить dev-зависимости"
RUN npm ci --omit=dev
COPY . .
# Копируем результат сборки из build-стадии
COPY --from=be_build /app/dist ./dist
EXPOSE 3000
# Команда для запуска
CMD ["node", "dist/main"]