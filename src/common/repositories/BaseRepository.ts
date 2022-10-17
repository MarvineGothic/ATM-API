import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { hasValue } from '../utils/nullable';
import { KnexTransaction } from 'common/knexTransactionManager/KnexTransaction';


interface BaseEntityDomainObject {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertEntityPayload<T extends BaseEntityDomainObject> = Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<T, 'createdAt' | 'updatedAt'>>;

type MaybeTransaction = KnexTransaction | null;

export interface MaybeTransactional {
  tx: MaybeTransaction;
}

export abstract class BaseRepository {
  constructor(@InjectKnex() protected readonly knex: Knex) {}

  protected getKnex(tx: MaybeTransaction) {
    return hasValue(tx) ? tx.knexTransaction : this.knex;
  }
}
