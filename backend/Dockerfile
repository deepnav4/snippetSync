# 📦 STEP 1: Choose the base image
# Using debian-slim instead of alpine for better OpenSSL compatibility with Prisma
FROM node:20-slim

# Install OpenSSL and other dependencies needed by Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 📁 STEP 2: Set working directory inside the container
# All commands will run from this folder
WORKDIR /app

# 📋 STEP 3: Copy package files AND Prisma schema first
# We need Prisma schema before npm install because postinstall runs prisma generate
COPY package*.json ./
COPY prisma ./prisma/

# 📦 STEP 4: Install dependencies (this will auto-run prisma generate via postinstall)
RUN npm install

# 📂 STEP 5: Copy all source code
COPY . .

# 🏗️ STEP 6: Build TypeScript to JavaScript
RUN npm run build

# 🌐 STEP 7: Expose the port your app runs on
EXPOSE 5000

# 🚀 STEP 8: Create startup script that waits for DB
# This ensures MySQL is truly ready before running migrations
RUN echo '#!/bin/sh\n\
set -e\n\
echo "⏳ Waiting for MySQL to be ready..."\n\
sleep 15\n\
echo "✅ Starting migration process..."\n\
echo "🔄 Running database migrations..."\n\
npx prisma migrate deploy\n\
echo "✅ Migrations complete!"\n\
echo "🚀 Starting server..."\n\
npm start' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
