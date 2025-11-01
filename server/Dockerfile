FROM node:25-alpine3.22

WORKDIR /app

COPY app/ ./

ENV CI=true
RUN npm install -g pnpm && pnpm install --frozen-lockfile

RUN pnpm run build:server

EXPOSE 4000

CMD ["node", "dist-server/server/server.js"]