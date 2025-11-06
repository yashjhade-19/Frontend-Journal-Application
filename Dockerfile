# Step 1: Build React app
FROM node:18 AS build
WORKDIR /app

# Copy dependency files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend files and build
COPY . .
RUN npm run build

# Step 2: Serve the static files using Nginx
FROM nginx:alpine

# Copy the build output from the previous step
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (standard for web apps)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
