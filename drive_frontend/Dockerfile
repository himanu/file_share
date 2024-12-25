# Step 1: Use Node.js to build the React app using Vite
FROM node:18 AS build

# Step 2: Set the working directory for the React app
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json first to leverage Docker's cache
COPY package.json package-lock.json ./

# Step 4: Install the dependencies for React (Vite)
RUN npm install

# Step 5: Copy the rest of the Vite app files into the container
COPY . .

# Step 6: Build the React app using Vite (produces the "dist" directory)
RUN npm run build

# Step 7: Use Nginx to serve the build output
FROM nginx:alpine

# Step 8: Copy the build output from the "build" stage (which is in /app/dist) to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the Nginx port (default is 80)
EXPOSE 80
