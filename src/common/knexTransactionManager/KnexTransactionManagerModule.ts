import { DynamicModule, Module } from '@nestjs/common';
import { DEFAULT_TRANSACTION_MANAGER, KnexTransactionManager } from './KnexTransactionManager';
import { Knex } from 'knex';

type InjectionToken = string;

export interface KnexTransactionManagerModuleOptions {
  getConnectionToken: () => InjectionToken;
  name?: InjectionToken;
}

@Module({})
export class KnexTransactionManagerModule {
  public static forRoot(options: KnexTransactionManagerModuleOptions): DynamicModule {
    const providers = [{
      provide: DEFAULT_TRANSACTION_MANAGER,
      useFactory: (knexInstance: Knex) => {
        return new KnexTransactionManager(
          knexInstance,
        )
      },
      inject: [options.getConnectionToken()],
    }];

    return {
      module: KnexTransactionManagerModule,
      providers: providers,
      exports: providers,
      global: true,
    }
  }
}
