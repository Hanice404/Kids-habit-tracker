# Use Node.js Alpine base image
FROM node:20-alpine

WORKDIR /app

# Copy package descriptors first to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies (production & development required for bundling)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build production assets (Vite frontend + esbuild server backend)
RUN npm run build

# Set production environment
ENV NODE_ENV=production

# Expose Express backend port (serves both API and frontend static assets)
EXPOSE 3000

# Declare persistent volume mount point
VOLUME ["/app/data"]

# Start the compiled self-contained production backend server
CMD ["node", "dist/server.cjs"]
