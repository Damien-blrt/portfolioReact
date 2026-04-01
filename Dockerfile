# ========================================
# Stage 1: Build the React application
# ========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Environment variables for Vite build (public client-side keys)
ENV VITE_SUPABASE_URL=https://cvtqamxzsihlolkvshoa.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHFhbXh6c2lobG9sa3ZzaG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMjgzNjMsImV4cCI6MjA4NTkwNDM2M30.KZRs-FSnIjEfnA6Z9vaddXuE8ZzWEQcuWKLvcYQ8kZ0

# Build the application
RUN npm run build

# ========================================
# Stage 2: Serve with Nginx
# ========================================
FROM nginx:1.27-alpine AS production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add custom Nginx configuration to support Single Page Application (SPA) routing
RUN echo 'server { \
    listen       80; \
    server_name  localhost; \
    root   /usr/share/nginx/html; \
    index  index.html index.htm; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    error_page   500 502 503 504  /50x.html; \
    location = /50x.html { \
        root   /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]