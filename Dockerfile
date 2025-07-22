FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including tsx for production watch)
RUN npm ci --production=false && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S expressjs -u 1001

# Change ownership of the app directory
RUN chown -R expressjs:nodejs /app
USER expressjs

# Expose port
EXPOSE 7010

# CMD ["npm", "run", "dev"]
RUN npm run build
CMD ["npm", "run", "start"]