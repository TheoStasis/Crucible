FROM nikolaik/python-nodejs:python3.11-nodejs18-alpine

# Install system dependencies (including supervisor)
RUN apk add --no-cache supervisor build-base

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
COPY supervisord.conf ./
COPY gateway.js ./

# Expose port (Railway overrides this with PORT environment variable)
EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/app/supervisord.conf"]
