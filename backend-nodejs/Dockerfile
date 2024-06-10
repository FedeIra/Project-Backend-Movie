# Dockerfile for a Node.js backend application
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Run the application
CMD ["npm", "start"]
