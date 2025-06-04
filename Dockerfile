# Use Node.js LTS Alpine image
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start command with migrations - note: main.js is in dist/src/
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node dist/src/main"]