FROM node:22.14-alpine AS builder

RUN corepack enable pnpm

WORKDIR "/opt/bylothink/backoffice-frontend"
COPY . ./

ARG VITE_BACKEND_URL
RUN touch .env \
 && echo "VITE_BACKEND_URL=${VITE_BACKEND_URL}" >> .env \
 \
 && pnpm install --frozen-lockfile --config.confirmModulesPurge=false \
 && pnpm build

FROM nginx:1.27-alpine

COPY --from=builder /opt/bylothink/backoffice-frontend/dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

ARG VERSION
ARG COMMIT_SHA
ARG CREATE_DATE

LABEL org.opencontainers.image.title="Backoffice App - Frontend"
LABEL org.opencontainers.image.description="A generic frontend for a backoffice app to manage some orders and products."
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL org.opencontainers.image.version="${VERSION}"
LABEL org.opencontainers.image.revision="${COMMIT_SHA}"
LABEL org.opencontainers.image.source="https://github.com/Bylothink/backoffice_app-frontend"
LABEL org.opencontainers.image.url="https://github.com/Bylothink/backoffice_app-frontend"
LABEL org.opencontainers.image.authors="Matteo Bilotta <me@byloth.dev>"
LABEL org.opencontainers.image.vendor="Bylothink"
LABEL org.opencontainers.image.created="${CREATE_DATE}"
