# Use an official Node.js runtime as the base image
FROM node:14 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Angular app for production
RUN npx ng build --configuration=production

# Use an official Nginx image as the production server
FROM nginx:alpine

# Copy the built Angular app from the previous stage to the NGINX directory
COPY --from=build /app/dist/insfx_raumdisplay /usr/share/nginx/html

# Expose port 4200
EXPOSE 4200

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
