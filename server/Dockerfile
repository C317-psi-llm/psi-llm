# Multi-stage Dockerfile
# - development target: installs dev deps and runs `npm run dev` (ts-node-dev)
# - production target: builds TypeScript and runs compiled JS

FROM node:20-alpine AS base
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install production deps (used in production image)
COPY package.json package-lock.json* ./
RUN npm install --production

FROM node:20-alpine AS development
WORKDIR /usr/src/app
ENV NODE_ENV=development

# Install all deps for development
COPY package.json package-lock.json* ./
RUN npm install

# Copy source for development usage (mounted in compose for live code)
COPY . .
EXPOSE 4000
CMD ["npm","run","dev"]

FROM development AS builder
WORKDIR /usr/src/app
# build the project to produce /dist
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production

# copy only what's needed for runtime
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/db ./db

EXPOSE 4000
CMD ["node","dist/server.js"]
