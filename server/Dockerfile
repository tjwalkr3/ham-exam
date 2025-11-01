FROM node:25-alpine3.22

WORKDIR /app

COPY ./server/ ./

ENV CI=true
RUN npm install -g pnpm && pnpm install --frozen-lockfile

RUN pnpm run build:server

EXPOSE 4444

CMD ["node", "dist/server.js"]