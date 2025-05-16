# ---- Build Stage ----
FROM node:20-slim AS builder
LABEL stage="builder"

WORKDIR /app

# Install all dependencies (including dev for build)
# Copy package.json and package-lock.json first to leverage Docker cache
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
# Important: GEMINI_API_KEY and other secrets should be injected as environment
# variables at runtime (e.g., via `docker run -e GEMINI_API_KEY=...` or orchestrator secrets)
# and NOT hardcoded in the Dockerfile or .env file copied into the image.

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built application artifacts from the builder stage
# This includes 'dist/public' (frontend) and 'dist/api' (backend)
COPY --from=builder /app/dist ./dist

# Expose the port the application runs on (as defined in server/index.ts)
EXPOSE 8800

# Command to run the application
# Your package.json start script is "NODE_ENV=production node dist/api/index.js"
# Since NODE_ENV is already set, we can directly call node.
CMD ["node", "dist/api/index.js"] 