# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install any needed dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 5000 for the backend
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
