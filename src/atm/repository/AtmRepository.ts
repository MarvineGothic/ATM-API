import { Injectable } from '@nestjs/common';
import { AtmStatus } from 'atm/entity/AtmStatus';
import { Atm } from 'atm/provider/Atm';
import { ATM_TABLE_NAME } from 'common/db_constants';
import { BaseRepository, MaybeTransactional } from 'common/repositories/BaseRepository';

type CommonCommand = MaybeTransactional & {
  model: {
    atmId: string,
    thousand?: number,
    fiveHundred?: number,
    twoHundred?: number,
    oneHundred?: number,
    fifty?: number,
    twenty?: number,
    five?: number,
    two?: number,
    ten?: number,
    one?: number,
    createdAt?: Date,
    updatedAt?: Date,
  }
}

type CreateCommand = CommonCommand;
type UpdateCommand = CommonCommand;

type UpsertCommand = MaybeTransactional & {
  model: {
    atmId: string,
    createdAt?: Date,
    updatedAt?: Date,
  }
}

@Injectable()
export class AtmRepository extends BaseRepository {

  async getAtmStatusByAtmId(command: { atmId: string }): Promise<AtmStatus | undefined> {
    return await this.getKnex(null)<AtmStatus>(ATM_TABLE_NAME)
      .select()
      .where({
        atmId: command.atmId,
      })
      .first();
  }

  async create(command: CreateCommand): Promise<number> {
    const now = new Date();

    const [{ id }] = await this.getKnex(command.tx)(ATM_TABLE_NAME)
      .insert({
        ...command.model,
        createdAt: command.model.createdAt ?? now,
        updatedAt: command.model.updatedAt ?? now,
      })
      .returning('id');

    return id;
  }

  async update(command: UpdateCommand): Promise<number> {
    const now = new Date();

    const [{ id }] = await this.getKnex(command.tx)(ATM_TABLE_NAME)
      .update({
        ...command.model,
        updatedAt: command.model.updatedAt ?? now,
      })
      .where({
        atmId: command.model.atmId,
      })
      .returning('id');

    return id;
  }

  async upsert(command: UpsertCommand): Promise<number> {
    const now = new Date();

    const [{ id }] = await this.getKnex(null)(ATM_TABLE_NAME)
      .insert({
        ...command.model,
        createdAt: command.model.createdAt ?? now,
        updatedAt: command.model.updatedAt ?? now,
      })
      .onConflict('atmId')
      .ignore()
      .returning('id');

    return id;
  }
}
