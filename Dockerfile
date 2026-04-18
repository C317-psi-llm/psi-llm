# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY client ./client
COPY server ./server

RUN npm run build:app

FROM node:20-alpine AS runtime
WORKDIR /app

COPY --from=builder /app/server/dist ./

RUN npm ci --omit=dev

ENV PORT=3000
EXPOSE 3000

CMD ["node", "helloWorld.js"]
