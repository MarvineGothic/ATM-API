import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ATM_PROVIDER_TOKEN } from 'atm/provider/AtmProvider';
import {
  AtmProviderInterface,
  NotesAndCoins,
  RefillDenominationCommand,
} from 'atm/provider/AtmProviderInterface';


@Injectable()
export class AtmService {
  constructor(
    @Inject(ATM_PROVIDER_TOKEN)
    private readonly atmProvider: AtmProviderInterface,
  ) { }

  async refillDenomination(command: RefillDenominationCommand): Promise<void> {
    const isRefilled = await this.atmProvider.refillDenomination(command);
    
    if (!isRefilled) {
      throw new InternalServerErrorException({ message: 'ATM internal error. Cannot refill' });
    }
  }

  async withdrawAmount({ atmId, amount }: { atmId: string, amount: number }): Promise<NotesAndCoins> {
    return await this.atmProvider.withdrawAmount({ atmId, amount });
  }
}