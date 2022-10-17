import { Module } from '@nestjs/common';
import { AtmModule } from 'atm/AtmModule';
import Config from 'common/config';
import { KnexTransactionManagerModule } from 'common/knexTransactionManager/KnexTransactionManagerModule';
import { getKnexConnectionToken, KnexModule } from 'nestjs-knex';

@Module({
  imports: [
    AtmModule,
    KnexModule.forRoot({
      config: {
        client: 'pg',
        useNullAsDefault: true,
        asyncStackTraces: true,
        connection: {
          host: Config.DB.Host,
          port: Config.DB.Port,
          user: Config.DB.User,
          password: Config.DB.Password,
          database: Config.DB.Database,
        },
        pool: {
          min: 0,
          max: Config.DB.MaxPooledConnections,
        },
      },
    }),
    KnexTransactionManagerModule.forRoot({
      getConnectionToken: () => {
        return getKnexConnectionToken('');
      },
    }),
  ],
})
export class AppModule {}
