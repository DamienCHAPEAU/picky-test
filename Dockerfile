# Use the Node.js 18 Alpine Linux image as the base image
FROM node:18-alpine 

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json files into the working directory
COPY package*.json ./

# Install the dependencies specified in package.json
RUN npm install

# Copy all the files from the local directory to the working directory in the container
COPY . .

# Run the application in development mode
CMD ["npm", "run", "dev"]
