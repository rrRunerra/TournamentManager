# Network: mediastack (172.20.0.0/24)
# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY uu_ritr_maing01-server/package*.json ./
COPY uuapp.json ./

# Install dependencies
RUN npm config set registry https://repo.plus4u.net/repository/public-javascript/
RUN npm install

# Copy the rest of the application code to the working directory
# Copy the rest of the application code to the working directory
COPY uu_ritr_maing01-server/ .

# Expose the ports the app runs on
EXPOSE 8080
EXPOSE 8082

# Define the command to run the app
CMD ["node", "app.js"]
