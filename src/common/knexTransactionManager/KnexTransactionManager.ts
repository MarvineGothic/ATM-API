import { KnexTransaction } from './KnexTransaction';
import { Knex } from 'knex';

export const DEFAULT_TRANSACTION_MANAGER = 'KnexTransactionManager';

export type Operation<T> = (tx: KnexTransaction) => Promise<T>;

export class KnexTransactionManager {
  constructor(
    private readonly knexInstance: Knex,
  ) { }

  async withTransaction<T>(fn: Operation<T>): Promise<T> {
    return await this.knexInstance.transaction(async (tx: Knex.Transaction) => {
      return await fn(new KnexTransaction(tx));
    });
  }
}
