# FILM!

Pet‑проект онлайн-афиши. Пользователь выбирает фильм, изучает описание и расписание, бронирует места и оформляет заказ. Проект состоит из SPA на React и API на NestJS и поддерживает работу как с MongoDB, так и с PostgreSQL.

## Деплой

Прод-окружение доступно по адресу: http://film-v-chern.students.nomorepartiessbs.ru/

## Технологии

- Frontend: React 18, TypeScript, Vite, SCSS‑модули, dayjs, Storybook.
- Backend: NestJS 10, class-validator/transformer, общий репозиторий для MongoDB (Mongoose) и PostgreSQL (TypeORM), ServeStatic.
- Инфраструктура: Docker Compose, nginx, GitHub Actions (workflow `.github/workflows/build_publish.yml`), pnpm.

## Локальная разработка

### Предварительно

- Node.js 18+ вместе с pnpm 8 (или npm/yarn).
- Одна из БД: локальная MongoDB или PostgreSQL. Для быстрого старта можно поднять обе через Docker Compose (см. ниже).
- Скопируйте `.env.example` в `.env` в директориях `backend/` и `frontend/`. Основные переменные backend:
  - `DATABASE_DRIVER` (`mongodb` или `postgres`);
  - `DATABASE_URL` для MongoDB либо `DATABASE_HOST`/`DATABASE_PORT`/`DATABASE_NAME` и т.д. для PostgreSQL.

### Backend (`backend/`)

```bash
cd backend
pnpm install        # или npm ci
pnpm run start:dev  # запуск NestJS с hot-reload
```

Дополнительно:
- `pnpm run test` — unit-тесты NestJS;
- `pnpm run lint` — ESLint;
- `pnpm run start:debug` — режим с инспектором.

Для MongoDB заполните тестовые данные командой `mongo test/mongodb_initial_stub.js`. Для PostgreSQL схема и данные создаются из `database/init.sql`.

### Frontend (`frontend/`)

```bash
cd frontend
pnpm install
pnpm run dev       # запуск Vite dev-сервера
```

Полезные скрипты:
- `pnpm run build` — production-бандл;
- `pnpm run lint` — ESLint по TS/TSX;
- `pnpm run storybook` и `pnpm run build-storybook` — UI-каталог компонентов;
- `pnpm run component` — шаблон для генерации нового компонента.

Переменные окружения для фронтенда задаются в `.env` (например, `VITE_API_URL`, `VITE_CDN_URL`).

## API

REST API публикуется по префиксу `/api/afisha`:
- `GET /films` — список фильмов с базовой информацией;
- `GET /films/:id/schedule` — сеансы конкретного фильма;
- `POST /order` — бронь мест и оформление заказа.

При бронировании сервис проверяет валидность ряда и места, наличие сеанса и занятость кресла, после чего отмечает место как занятое (`backend/src/order/order.service.ts`).

## Docker-развёртывание

В `docker-compose.yml` собран полный стек:
- `postgres` + `pgadmin` — хранение расписания и просмотр данных;
- `backend` — NestJS API (`ghcr.io/v-chern/film-backend`);
- `frontend` — сборка Vite (`ghcr.io/v-chern/film-frontend`);
- `server` — nginx, раздаёт статический frontend и проксирует запросы на API;
- тома `frontend`, `public`, `db`, `pgadmin-data` сохраняют артефакты и данные.

Запуск:

```bash
docker compose up -d --build
```

После успешного деплоя SPA доступно на `http://localhost`, API отвечает по `/api/afisha`, а медиа-файлы раздаются с `/content/afisha`.

## CI/CD

GitHub Actions workflow (`.github/workflows/build_publish.yml`) собирает frontend и backend и публикует образы в GitHub Container Registry. При необходимости образы используются в Compose и на сервере.
