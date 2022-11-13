import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ATM_PROVIDER_TOKEN } from 'atm/provider/AtmProvider';
import {
  AtmProviderInterface,
  CreateAtmCommand,
  NotesAndCoins,
  RefillDenominationCommand,
} from 'atm/provider/AtmProviderInterface';


@Injectable()
export class AtmService {
  constructor(
    @Inject(ATM_PROVIDER_TOKEN)
    private readonly atmProvider: AtmProviderInterface,
  ) { }

  async createAtm(command: CreateAtmCommand): Promise<void> {
    await this.atmProvider.createAtm({ atmId: command.atmId });
  }

  async refillDenomination(command: RefillDenominationCommand): Promise<void> {
    await this.atmProvider.refillDenomination(command);
  }

  async withdrawAmount({ atmId, amount }: { atmId: string, amount: number }): Promise<NotesAndCoins> {
    return await this.atmProvider.withdrawAmount({ atmId, amount });
  }
}