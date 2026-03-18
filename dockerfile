FROM node:22

# Set a working directory
WORKDIR /app

# Install dependencies
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy over the app source
COPY --chown=node:node . .

RUN yarn build

CMD [ "yarn", "start:dev" ]
