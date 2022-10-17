import { Knex } from 'knex';

export class KnexTransaction {
  constructor(public knexTransaction: Knex.Transaction) {
  }
}