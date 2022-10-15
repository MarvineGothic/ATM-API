import { Injectable } from '@nestjs/common';
import { Denomination, NotesAndCoins } from 'atm/provider/AtmProviderInterface';

type BaseCommand = {
  denomination: Denomination,
  amount: number
};

type GetAvailableAmountCommand = BaseCommand;
type IncreaseAmount = BaseCommand;
type DecreaseAmount = BaseCommand;

@Injectable()
export class AtmRepository {
  private atm: NotesAndCoins;

  constructor() {
    this.atm = {
      thousand: 1,
      fiveHundred: 2,
      twoHundred: 5,
      oneHundred: 10,
      fifty: 20,
      twenty: 50,
      ten: 100,
      five: 200,
      two: 500,
      one: 1000,
    }
  }
  
  getAvailableAmount(command: GetAvailableAmountCommand): number {
    const availableAmount = this.atm[command.denomination];
    const isEnough = availableAmount >= command.amount;
    if (!isEnough) {
      return availableAmount;
    }

    return command.amount;
  }

  increaseAmount(command: IncreaseAmount): boolean {
    const prevAmount = this.atm[command.denomination];
    this.atm[command.denomination] = prevAmount + command.amount;
    return true;
  }

  decreaseAmount(command: DecreaseAmount): boolean {
    const prevAmount = this.atm[command.denomination];
    const newAmount = prevAmount - command.amount;

    if (newAmount < 0) {
      return false;
    }

    this.atm[command.denomination] = newAmount;

    return true;
  }
}
