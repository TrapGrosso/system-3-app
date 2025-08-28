# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (better cache)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Make VITE_* available at build time (from build args if provided)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# Build the SPA
RUN npm run build

# ---- Runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

# Install tiny static server
RUN npm install -g serve@14

# Copy built assets
COPY --from=builder /app/dist ./dist

# Security: run as non-root
# node user exists in the base image
USER node

# Default port (Coolify can inject PORT)
ENV PORT=3000

# Healthcheck: verify root returns 200
HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=5 \
  CMD wget --spider -q "http://127.0.0.1:${PORT}/" || exit 1

EXPOSE 3000

# Serve static build with SPA fallback
CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
