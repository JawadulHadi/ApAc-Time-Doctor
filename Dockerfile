# Step 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy the rest of the code and build
COPY . .
RUN npm run build

# Step 2: Run the app
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./

#  Install *only production dependencies* for smaller image
RUN npm ci --only=production --legacy-peer-deps

#  Copy built files and any required runtime assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Optional but good: copy env or assets if needed
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.env .env

# Expose backend port
EXPOSE 3400

# Start NestJS app
CMD ["node", "dist/main"]
