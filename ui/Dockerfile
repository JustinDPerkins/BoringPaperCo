# ──────────────────────────────────────────────────────────────
#  Boring Paper Company • Front-end Dockerfile  (multi-stage)
#  Stage 1: build CRA/Vite app
#  Stage 2: serve with Nginx (root master → nginx workers)
# ──────────────────────────────────────────────────────────────

########## 1️⃣  Build stage ####################################
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps first for better cache hits
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source & build
COPY . .
RUN npm run build            # CRA → /app/build   (Vite → /app/dist)

########## 2️⃣  Runtime stage ##################################
FROM nginx:1.25-alpine

# Replace the default site config with ours
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static site (change /build to /dist if you’re on Vite)
COPY --from=builder /app/build /usr/share/nginx/html

# EXPOSE & launch
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
