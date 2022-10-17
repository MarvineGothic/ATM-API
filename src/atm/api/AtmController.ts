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
    description: 'Internal error. Refill cancelled',
  })
  async refill(
    @Body() body: RefillRequest
  ) {
    await this.atmService.refillDenomination({
      atmId: body.atmId,
      denomination: body.denomination,
      amount: body.amount,
    });
  }

  @Post('withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: WithdrawResponse,
  })
  @ApiNotFoundResponse({
    description: 'Not enough money in ATM',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  async withdraw(
    @Body() body: WithdrawRequest
  ) {
    const withdrawedAmount = await this.atmService.withdrawAmount({
      atmId: body.atmId,
      amount: body.amount,
    });

    return WithdrawResponse.hydrate(withdrawedAmount);
  }
}
