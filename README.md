## Description

Implementation of a sample bookmark app using NestJS, Prisma and Jest

## Installation

```bash
$ npm install
```

## Configuration

Connect mysql database with application by configuring the environemnt variables.
Create an .env file at root folder and configure following variables.

```bash
DATABASE_URL=xxx
JWT_SECERET=xxx
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

Right now only E2E tests are implemented.

```bash
# unit tests
$ npm run test:e2e

```
