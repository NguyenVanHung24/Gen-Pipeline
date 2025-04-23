FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose port (assuming default Express port)
EXPOSE 3001

# Start the server
CMD ["node", "server.js"] 