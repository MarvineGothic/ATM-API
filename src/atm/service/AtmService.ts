import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ATM_PROVIDER_TOKEN } from "atm/provider/AtmProvider";
import { AtmProviderInterface, NotesAndCoins, RefillDenominationCommand } from "atm/provider/AtmProviderInterface";


@Injectable()
export class AtmService {
  constructor(
    @Inject(ATM_PROVIDER_TOKEN)
    private readonly atmProvider: AtmProviderInterface,
  ) { }

  refillDenomination(command: RefillDenominationCommand): void {
    return this.atmProvider.refillDenomination(command)
  }

  withdraw(amount: number): NotesAndCoins {
    const checkedAmounts = this.atmProvider.checkAmounts(amount);

    const isWithdrawed = this.atmProvider.withdraw(checkedAmounts);

    if (!isWithdrawed) {
      throw new InternalServerErrorException({ message: 'ATM internal error. Cannot withdraw amount' });
    }

    return checkedAmounts;
  }
}