import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AtmService } from 'atm/service/AtmService';
import { AtmIdParam, CreateAtmRequest } from './defs/Atm';
import { RefillRequest } from './defs/Refill';
import { WithdrawRequest, WithdrawResponse } from './defs/Withdraw';

@ApiTags('atm')
@Controller('atm')
export class AtmController {
  constructor(
    private readonly atmService: AtmService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async createAtm(
    @Body() { atmId }: CreateAtmRequest,
  ) {
    await this.atmService.createAtm({ atmId });
  }

  @Patch('refill/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: 'Internal error. Refill cancelled',
  })
  async refill(
    @Param('id') param: AtmIdParam,
    @Body() body: RefillRequest
  ) {
    await this.atmService.refillDenomination({
      atmId: param.id,
      denomination: body.denomination,
      amount: body.amount,
    });
  }

  @Post('withdraw/:id')
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
    @Param('id') param: AtmIdParam,
    @Body() body: WithdrawRequest
  ) {
    const withdrawedAmount = await this.atmService.withdrawAmount({
      atmId: param.id,
      amount: body.amount,
    });

    return WithdrawResponse.hydrate(withdrawedAmount);
  }
}
