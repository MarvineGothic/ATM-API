import { ApiProperty } from '@nestjs/swagger';
import { Denomination } from 'atm/provider/AtmProviderInterface';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class RefillRequest {
  @ApiProperty()
  @IsString()
  atmId!: string;
  
  @ApiProperty()
  @IsEnum(Denomination)
  denomination!: Denomination;

  @ApiProperty()
  @IsNumber()
  amount!: number;
}