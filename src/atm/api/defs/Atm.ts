import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AtmIdParam {
  @ApiProperty({ description: 'ATM id' })
  @IsString()
  id!: string;
}

export class CreateAtmRequest {
  @ApiProperty()
  @IsString()
  atmId!: string;
}