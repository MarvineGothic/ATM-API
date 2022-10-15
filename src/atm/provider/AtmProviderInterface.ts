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

export type RefillDenominationCommand = {
  denomination: Denomination,
  amount: number,
}

export interface AtmProviderInterface {
  checkAmounts: (amount: number) => NotesAndCoins;
  refillDenomination: (command: RefillDenominationCommand) => void;
  withdraw: (checkedAmounts: NotesAndCoins) => boolean;
}