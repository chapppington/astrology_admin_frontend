FROM node:22-alpine

WORKDIR /app

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["pnpm", "start"] 