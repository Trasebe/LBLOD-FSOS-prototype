##### TODO 
- Dockerize backend
- Yarn cleanup docker containers command
- cz-conventional-changelog/commmitizen bekijken/verwijderen

## Overview

This is an express backend boilerplate application connecting to a Hyperledger Fabric Network and a mongoDB.

## Prerequisites
- NVM LTS (LTS version of Node and NPM)
- Yarn >= 1.10.0

## Setup
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

# Installing LTS node and npm
nvm install --lts

# Use the LTS
nvm use --lts

# Install Yarn
npm install -g yarn
```

## Usage
```bash
# Install dependencies and start server
yarn && yarn start
```



## NPM Scripts Overview
```bash
# Start server in development mode
yarn start

# start server in production mode
yarn start:prod

# start server in debug mode
yarn start:debug

# build (transpile) code
yarn build

# lint the code
yarn lint

# lint watch
yarn lint:watch

# start tests
yarn test

# watch tests
yarn test:watch

# test with coverage
yarn test:coverage

# report coverage to coveralls
yarn report-coverage
```

### Deployment
```bash
# transpile to ES5
1. yarn build

# upload dist/ to your server
2. scp -rp dist/ user@dest:/path

# install production dependencies only
3. yarn --production

# Use any process manager to start your services
4. pm2 start dist/index.js
```
