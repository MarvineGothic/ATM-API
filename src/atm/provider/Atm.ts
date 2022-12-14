import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AtmStatus } from 'atm/entity/AtmStatus';
import { AtmRepository } from 'atm/repository/AtmRepository';
import { DEFAULT_TRANSACTION_MANAGER, KnexTransactionManager } from 'common/knexTransactionManager/KnexTransactionManager';
import { hasNoValue } from 'common/utils/nullable';
import {
  AtmProviderInterface,
  CreateAtmCommand,
  Denomination,
  denominationValues,
  NotesAndCoins,
  RefillDenominationCommand,
  WithdrawAmountCommand,
} from './AtmProviderInterface';

type GetAvailableAmountCommand = {
  atmStatus: AtmStatus,
  denomination: Denomination,
  requiredAmount: number,
}

@Injectable()
export class Atm implements AtmProviderInterface {
  constructor (
    @Inject(DEFAULT_TRANSACTION_MANAGER) private readonly transactionManager: KnexTransactionManager,
    private readonly atmRepository: AtmRepository,
  ) { }

  async createAtm({ atmId }: CreateAtmCommand): Promise<void> {
    await this.atmRepository.upsert({
      tx: null,
      model: {
        atmId,
      },
    });
  }

  async withdrawAmount({ atmId, amount }: WithdrawAmountCommand): Promise<NotesAndCoins> {

    let enoughMoney = false;

    const checkedAmounts = {
      thousand: 0,
      fiveHundred: 0,
      twoHundred: 0,
      oneHundred: 0,
      fifty: 0,
      twenty: 0,
      five: 0,
      two: 0,
      ten: 0,
      one: 0,
    }

    const atmStatus = await this.atmRepository.getAtmStatusByAtmId({ atmId });

    if (hasNoValue(atmStatus)) {
      throw new InternalServerErrorException({ message: 'ATM internal error. Cannot withdraw amount' });
    }

    await this.transactionManager.withTransaction(async tx => {
      for (const [denomination, value] of denominationValues) {
        const requiredAmount = Math.floor(amount / value);

        if (requiredAmount) {
          const availableAmount = Atm.getAvailableAmount({
            atmStatus,
            denomination,
            requiredAmount: requiredAmount,
          });

          await this.atmRepository.update({
            tx,
            model: {
              atmId,
              [denomination]: atmStatus[denomination] - availableAmount,
            },
          });

          checkedAmounts[denomination] = availableAmount;

          amount = amount - availableAmount * value;

          if (availableAmount === requiredAmount) {
            enoughMoney = true;
          } else {
            enoughMoney = false;
          }
        }
      }

      if (!enoughMoney) {
        throw new BadRequestException({ message: 'There\'s not enough money in ATM. Try another amount' });
      }
    });

    return checkedAmounts;
  }

  async refillDenomination({ atmId, denomination, amount }: RefillDenominationCommand): Promise<void> {
    const atm = await this.atmRepository.getAtmStatusByAtmId({ atmId });

    if (hasNoValue(atm)) {
      throw new InternalServerErrorException('ATM with this id does not exist');
    }

    const currentAmount = atm[denomination];
    const newAmount = currentAmount + amount;
    const id = await this.atmRepository.update({ tx: null, model: { atmId: atm.atmId, [denomination]: newAmount } });

    if (!id) {
      throw new InternalServerErrorException('ATM internal error. Cannot refill');
    }
  }

  static getAvailableAmount(command: GetAvailableAmountCommand): number {
    const availableAmount = command.atmStatus[command.denomination];
    const isEnough = availableAmount >= command.requiredAmount;

    if (!isEnough) {
      return availableAmount;
    }

    return command.requiredAmount;
  }
}