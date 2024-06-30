FROM node:22

# Set a working directory
WORKDIR /app

# Install dependencies
COPY --chown=node:node package*.json ./
RUN npm ci

# Copy over the app source
COPY --chown=node:node . .

RUN npm run build


CMD [ "npm", "run", "start:dev" ]
