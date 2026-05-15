# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for dependency caching
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ─── Stage 2: Serve with Nginx ────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (handles React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]