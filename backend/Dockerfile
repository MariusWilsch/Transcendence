# # Use a Node.js base image
# FROM node:16-alpine as build

# # Set the working directory
# WORKDIR /app

# # Copy package files and install dependencies
# COPY backend/package.json backend/package-lock.json ./
# RUN npm install --only=production

# # Copy the rest of the backend source code
# COPY backend/ .

# # Build the application
# RUN npm run build

# # Start the application using the production start script
# CMD ["npm", "run", "start:prod"]
