# Build stage
FROM node:25-alpine3.22 AS build

WORKDIR /app

COPY ./client/ ./

ENV CI=true
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Set the API URL to use the same domain with /api prefix (handled by Ingress)
ENV VITE_API_URL=/api

# Set Keycloak authority to use the same domain with /auth prefix (handled by Ingress)
ENV VITE_KEYCLOAK_AUTHORITY=https://ham.dragonbytes.org/auth/realms/AppRealm

RUN pnpm run build

# Production stage
FROM nginx:1.29-alpine3.22-perl

# Configure nginx for relative routing
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80