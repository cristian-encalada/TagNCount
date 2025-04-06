FROM node:16-alpine

WORKDIR /app

# Install dependencies first (as root)
COPY package.json package-lock.json ./
RUN npm install

# Copy the application files
COPY . .

# Set up the cache directory with proper permissions
RUN mkdir -p /app/node_modules/.cache && \
    chmod -R 777 /app/node_modules/.cache

# Set proper permissions
RUN chmod -R 755 /app/src

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

EXPOSE 3000

CMD ["npm", "start"] 