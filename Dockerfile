# ==========================================
# Stage 1: Build the React Application
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package descriptors first to leverage Docker layer caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build production distribution assets
RUN npm run build

# ==========================================
# Stage 2: Serve the Built Static Assets
# ==========================================
FROM nginx:stable-alpine

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built distribution assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the customized Nginx routing configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
