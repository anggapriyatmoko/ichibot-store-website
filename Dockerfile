FROM node:20-alpine

WORKDIR /app

# Declare build arguments
ARG DATABASE_URL
ARG NEXT_PUBLIC_WC_URL
ARG WC_CONSUMER_KEY
ARG WC_CONSUMER_SECRET
ARG ADMIN_PASSWORD
ARG SESSION_SECRET

# Set them as environment variables for the build process
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_WC_URL=$NEXT_PUBLIC_WC_URL
ENV WC_CONSUMER_KEY=$WC_CONSUMER_KEY
ENV WC_CONSUMER_SECRET=$WC_CONSUMER_SECRET
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD
ENV SESSION_SECRET=$SESSION_SECRET

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
