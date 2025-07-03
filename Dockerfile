# Use official Node.js image for ARM64 as the build environment
FROM --platform=linux/arm64 node:20-alpine AS build

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Use ARM64 Nginx image to serve the built app
FROM --platform=linux/arm64 nginx:alpine

# Copy the built app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (standard HTTP port)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
