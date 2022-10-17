export enum Denomination {
  THOUSAND = 'thousand',
  FIVEHUNDRED = 'fiveHundred',
  TWOHUNDRED = 'twoHundred',
  ONEHUNDRED = 'oneHundred',
  FIFTY = 'fifty',
  TWENTY = 'twenty',
  TEN = 'ten',
  FIVE = 'five',
  TWO = 'two',
  ONE = 'one',
}

export type NotesAndCoins = {
  [Denomination.THOUSAND]: number;
  [Denomination.FIVEHUNDRED]: number;
  [Denomination.TWOHUNDRED]: number;
  [Denomination.ONEHUNDRED]: number;
  [Denomination.FIFTY]: number;
  [Denomination.TWENTY]: number;
  [Denomination.TEN]: number;
  [Denomination.FIVE]: number;
  [Denomination.TWO]: number;
  [Denomination.ONE]: number;
}

export const denominationValues = new Map([
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

export type WithdrawAmountCommand = {
  atmId: string,
  amount: number,
}

export type RefillDenominationCommand = {
  atmId: string,
  denomination: Denomination,
  amount: number,
}

export interface AtmProviderInterface {
  withdrawAmount: (command: WithdrawAmountCommand) => Promise<NotesAndCoins>;
  refillDenomination: (command: RefillDenominationCommand) => Promise<boolean>;
}