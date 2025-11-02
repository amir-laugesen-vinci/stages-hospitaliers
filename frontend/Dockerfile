FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src ./src

# Injecte la base API au build (utilisée par src/api.ts)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

EXPOSE 5173
CMD ["npm","run","preview","--","--host","0.0.0.0","--port","5173"]
