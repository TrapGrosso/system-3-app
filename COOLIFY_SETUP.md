# Coolify Deployment Setup

This document provides instructions for deploying the system-3-app to Coolify using Docker Compose.

## Files Created

- `.dockerignore` - Optimizes Docker build context
- `Dockerfile` - Multi-stage build (Node.js build + serve static files)
- `docker-compose.yml` - Coolify-compatible compose configuration
- `COOLIFY_SETUP.md` - This setup guide

## Coolify Configuration

### 1. Create New Application
1. In Coolify, create a new "Docker Compose" application
2. Point it to this repository/folder
3. Select the branch you want to deploy

### 2. Environment Variables
Set the following environment variables in Coolify:

**Required (Build Time):**
- `VITE_SUPABASE_URL` = `https://mbojaegemegtbpvlwjwt.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ib2phZWdlbWVndGJwdmx3and0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzODk0NzYsImV4cCI6MjA2NDk2NTQ3Nn0.Cka9scPIJzIx48a8oG-67M5_If12ibGs-13rJTqHCA8`

**Optional:**
- `PORT` = `3000` (default, Coolify may override)

### 3. Application Settings
- **Internal Port:** `3000`
- **Service:** `web` (from docker-compose.yml)
- **Health Check:** Enabled (configured in compose file)

### 4. Domain Configuration
- Set your domain in Coolify
- No additional reverse proxy configuration needed
- The app will be accessible at your configured domain

## Local Testing

To test locally before deploying:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the app
open http://localhost:3000
```

## Architecture

### Build Process
1. **Builder Stage:** Node.js 20 Alpine
   - Installs dependencies with `npm ci`
   - Copies source code
   - Builds static assets with `vite build`

2. **Runtime Stage:** Node.js 20 Alpine
   - Installs `serve` static file server
   - Copies built assets from builder stage
   - Runs as non-root user for security
   - Serves SPA with history API fallback

### Health Checks
- **Interval:** 10 seconds
- **Timeout:** 3 seconds
- **Start Period:** 20 seconds
- **Retries:** 5
- **Method:** HTTP GET to root path

### Security Features
- Non-root user execution
- Minimal runtime dependencies
- Multi-stage build (no source code in runtime)
- Alpine Linux base (smaller attack surface)

## Troubleshooting

### Build Issues
- Ensure environment variables are set correctly
- Check that all dependencies in package.json are available
- Verify Node.js version compatibility

### Runtime Issues
- Check health check status in Coolify
- Verify internal port (3000) is correctly configured
- Ensure domain is properly configured

### SPA Routing
- The `serve -s` command provides history API fallback
- All client-side routes will work correctly
- No additional configuration needed for React Router

## Alternative Runtime (Optional)

If you prefer using Vite's preview server instead of `serve`:

1. Modify the Dockerfile runtime stage:
```dockerfile
# Instead of installing serve globally
RUN npm install -g vite@6

# Change the CMD
CMD ["sh", "-c", "vite preview --host 0.0.0.0 --port ${PORT:-4173}"]

# Update EXPOSE and healthcheck port
EXPOSE 4173
```

2. Update docker-compose.yml ports and healthcheck accordingly.

Note: The `serve` approach is recommended for production as it's lighter and more focused.
