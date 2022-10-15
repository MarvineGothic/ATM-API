import { BadRequestException, Injectable } from "@nestjs/common";
import { AtmRepository } from "atm/repository/AtmRepository";
import { AtmProviderInterface, Denomination, NotesAndCoins, RefillDenominationCommand } from "./AtmProviderInterface";


@Injectable()
export class Atm implements AtmProviderInterface {
  constructor(
    private readonly atmRepository: AtmRepository,
  ) { }
  
  checkAmounts(amount: number): NotesAndCoins {
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

    const values = new Map([
      [Denomination.THOUSAND, 1000],
      [Denomination.FIVEHUNDRED, 500],
      [Denomination.TWOHUNDRED, 200],
      [Denomination.ONEHUNDRED, 100],
      [Denomination.FIFTY, 50],
      [Denomination.TWENTY, 20],
      [Denomination.TEN, 10],
      [Denomination.FIVE, 5],
      [Denomination.TWO, 2],
      [Denomination.ONE, 1],
    ]);

    for (const [key, value] of values) {
      const thousandNotesAmount = Math.floor(amount / value);

      if (thousandNotesAmount) {
        checkedAmounts[key] = this.atmRepository.getAvailableAmount({
          denomination: key,
          amount: thousandNotesAmount,
        });
        amount = amount - checkedAmounts[key] * value;

        if (checkedAmounts[key] === thousandNotesAmount) {
          enoughMoney = true;
        } else {
          enoughMoney = false;
        }
      }
    }

    if (!enoughMoney) {
      throw new BadRequestException({ message: 'There\'s not enough money in ATM. Try less amount' });
    }

    return checkedAmounts;
  }

  refillDenomination({ denomination, amount }: RefillDenominationCommand): void {
    this.atmRepository.increaseAmount({ denomination, amount });
  }

  withdraw(checkedAmount: NotesAndCoins): boolean {
    let success = true;
    for (const [key, value] of Object.entries(checkedAmount)) {
      const decreased = this.atmRepository.decreaseAmount({ denomination: key as Denomination, amount: value });
      success = !decreased ? false : success;
      console.log(key, decreased)
    }

    if (!success) {
      for (const [key, value] of Object.entries(checkedAmount)) {
        this.refillDenomination({ denomination: key as Denomination, amount: value });
      }

      return false;
    }

    return true;
  }
}