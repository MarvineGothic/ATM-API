import { ApiProperty } from "@nestjs/swagger";
import { Denomination } from "atm/provider/AtmProviderInterface";
import { IsEnum, IsNumber } from "class-validator";

export class RefillRequest {
  @ApiProperty()
  @IsEnum(Denomination)
  denomination!: Denomination;

  @ApiProperty()
  @IsNumber()
  amount!: number;
}