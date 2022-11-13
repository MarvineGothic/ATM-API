import { ApiProperty } from '@nestjs/swagger';
import { NotesAndCoins } from 'atm/provider/AtmProviderInterface';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class WithdrawRequest {
  @ApiProperty()
  @IsNumber({
    maxDecimalPlaces: 0,
  })
  @IsPositive()
  amount!: number;
}

class Notes {
  @ApiProperty()
  thousand!: number;

  @ApiProperty()
  fiveHundred!: number;

  @ApiProperty()
  twoHundred!: number;

  @ApiProperty()
  oneHundred!: number;

  @ApiProperty()
  fifty!: number;
}

class GreaterThanTwentyMm {
  @ApiProperty()
  twenty!: number;

  @ApiProperty()
  five!: number;

  @ApiProperty()
  two!: number;
}

class LessOrEqualTwentyMm {
  @ApiProperty()
  ten!: number;

  @ApiProperty()
  one!: number;
}

class Coins {
  @ApiProperty()
  gtTwentyMm!: GreaterThanTwentyMm;

  @ApiProperty()
  leTwentyMm!: LessOrEqualTwentyMm;
}

export class WithdrawResponse {
  @ApiProperty()
  notes!: Notes;

  @ApiProperty()
  coins!: Coins;

  constructor(amount: NotesAndCoins) {
    this.notes = {
      thousand: amount.thousand,
      fiveHundred: amount.fiveHundred,
      twoHundred: amount.twoHundred,
      oneHundred: amount.oneHundred,
      fifty: amount.fifty,
    }
    this.coins = {
      gtTwentyMm: {
        twenty: amount.twenty,
        five: amount.five,
        two: amount.two,
      },
      leTwentyMm: {
        ten: amount.ten,
        one: amount.one,
      },
    }
  }

  static hydrate(amount: NotesAndCoins): WithdrawResponse {
    return new WithdrawResponse(amount)
  }
}