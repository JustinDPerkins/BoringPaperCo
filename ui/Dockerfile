########## 1️⃣  Build stage ####################################
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only package files and install deps
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy the rest of the source
COPY . .

RUN npm run build

########## 2️⃣  Runtime stage ##################################
FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
