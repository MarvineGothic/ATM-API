import { ApiProperty } from '@nestjs/swagger';
import { Denomination } from 'atm/provider/AtmProviderInterface';
import { IsEnum, IsNumber, IsPositive, IsString } from 'class-validator';

export class RefillRequest {
  @ApiProperty()
  @IsEnum(Denomination)
  denomination!: Denomination;

  @ApiProperty()
  @IsNumber({
    maxDecimalPlaces: 0,
  })
  @IsPositive()
  amount!: number;
}