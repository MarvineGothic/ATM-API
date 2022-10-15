import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AtmService } from 'atm/service/AtmService';
import { RefillRequest } from './defs/Refill';
import { WithdrawRequest, WithdrawResponse } from './defs/Withdraw';

@ApiTags('atm')
@Controller('atm')
export class AtmController {
  constructor(
    private readonly atmService: AtmService,
  ) { }

  @Post('refill')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: 'Bad request. Refill cancelled'
  })
  refill(
    @Body() body: RefillRequest
  ) {
    this.atmService.refillDenomination({ denomination: body.denomination, amount: body.amount });
  }

  @Post('withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: WithdrawResponse,
  })
  @ApiNotFoundResponse({
    description: 'Not enough money in ATM'
  })
  @ApiBadRequestResponse({
    description: 'Bad request'
  })
  withdraw(
    @Body() body: WithdrawRequest
  ) {
    const withdrawedAmount = this.atmService.withdraw(body.amount);

    return WithdrawResponse.hydrate(withdrawedAmount);
  }
}
