# ATM
The task is to implement a simple webservice that simulates withdrawal of cash from an
ATM. The ATM can payout both notes and coins. You are free to design a UI in the way you
see fit.

There are a number of physical constraints on the ATM:

 - There are 3 payout boxes: 1 for notes, 1 for coins > 20mm and 1 for coins <= 20mm
 - 5 notes are available: 1000, 500, 200, 100, 50
 - 5 coins are available: 20 (40mm), 10 (20mm), 5 (50mm), 2 (30mm) and 1 (10mm)
 - There’s a finite amount of notes and coins
We have the following user stories:
 - As a User I want to be able to enter an amount, so that I can specify how much
money to withdraw.
 -  As a User I want to receive notes and coins that match the entered amount, so I can
go spend the money
 -  As a Bank I want the least number of notes and coins to be used for payout, so that I
don’t have to refill often
Example: User wants to withdraw 578. The ATM responds with: Notes 1x500, 1x50, coins
1x20, 1x5, 1x2, 1x1

## Setup
```bash
# database
$ yarn start:db

# set .env
set -a
source .env
set +a

# migration
$ yarn migration:up
```

## Running the app

```bash
# database
$ yarn start:db

# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Unit Test
```bash
# unit test
$ yarn test

# watch mode
$ yarn test:watch

# coverage
$ yarn test:coverage
```

## E2E Test

```bash
# start testing db
$ yarn run-db-for-tests

# e2e tests
$ yarn test:e2e:local
```

Swagger Docs: http://localhost:3000/docs

