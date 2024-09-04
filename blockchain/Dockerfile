# Use the official Node.js image as the base
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files to install dependencies
COPY package.json ./
COPY package-lock.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose necessary ports (if any)
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
