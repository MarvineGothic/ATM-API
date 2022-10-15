import { Module } from '@nestjs/common';
import { AtmModule } from 'atm/AtmModule';

@Module({
  imports: [AtmModule],
})
export class AppModule {}
