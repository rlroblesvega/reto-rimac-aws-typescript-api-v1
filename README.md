# Serverless - AWS Node.js Typescript

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `(v.20)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm install` to install the project dependencies
- Run `sls dynamodb install` to install DynamoDB in local
- Run `npm run start` to run this stack in local
- Run `npm run deploy` to deploy this stack to AWS
