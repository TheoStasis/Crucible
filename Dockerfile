FROM nikolaik/python-nodejs:python3.11-nodejs18-alpine

# Install build dependencies
RUN apk add --no-cache build-base

WORKDIR /app

# Copy and install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy and install orchestrator dependencies
COPY orchestrator/requirements.txt ./orchestrator/
RUN pip install --no-cache-dir -r orchestrator/requirements.txt

# Copy directories and files
COPY backend/ ./backend/
COPY orchestrator/ ./orchestrator/
COPY gateway.js ./
COPY start.js ./

# Expose port (Railway overrides this with PORT environment variable)
EXPOSE 80

CMD ["node", "start.js"]
