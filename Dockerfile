FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /uptick

COPY  package.json ./

RUN pnpm install

COPY . .

EXPOSE 8000
