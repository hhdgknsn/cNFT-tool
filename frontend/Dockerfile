# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install any needed dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
