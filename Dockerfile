# ---- Build Stage ----
FROM node:20-slim AS builder
LABEL stage="builder"

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Copy the entire application source code
COPY . .

# Run the build script
# This generates 'dist/public' for the frontend and 'dist/api/index.js' for the backend
RUN npm run build

# ---- Production Stage ----
FROM node:20-slim
LABEL stage="production"

WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev


COPY --from=builder /app/dist ./dist

EXPOSE 8800


CMD ["node", "server/index.js"] 