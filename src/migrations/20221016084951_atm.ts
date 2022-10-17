import { ATM_TABLE_NAME } from 'common/db_constants';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ATM_TABLE_NAME, table => {
    table.increments('id');
    table.string('atmId').notNullable().unique();
    table.integer('thousand').notNullable().defaultTo(0);
    table.integer('fiveHundred').unsigned().notNullable().defaultTo(0);
    table.integer('twoHundred').unsigned().notNullable().defaultTo(0);
    table.integer('oneHundred').unsigned().notNullable().defaultTo(0);
    table.integer('fifty').unsigned().notNullable().defaultTo(0);
    table.integer('twenty').unsigned().notNullable().defaultTo(0);
    table.integer('ten').unsigned().notNullable().defaultTo(0);
    table.integer('five').unsigned().notNullable().defaultTo(0);
    table.integer('two').unsigned().notNullable().defaultTo(0);
    table.integer('one').unsigned().notNullable().defaultTo(0);
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(ATM_TABLE_NAME);
}

