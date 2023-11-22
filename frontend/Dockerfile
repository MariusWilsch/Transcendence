# # Use a Node.js base image
# FROM node:16-alpine as build

# # Set the working directory
# WORKDIR /app

# # Copy package files and install dependencies
# COPY frontend/package.json frontend/package-lock.json ./
# RUN npm install

# # Copy the rest of the frontend source code
# COPY frontend/ .

# # Build the application (includes TypeScript compilation)
# RUN npm run build