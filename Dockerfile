FROM node:20-alpine

WORKDIR /app

# Install dependencies needed for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
