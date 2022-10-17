import { NotesAndCoins } from 'atm/provider/AtmProviderInterface';

export type AtmStatus = NotesAndCoins & {
  id: number;
  atmId: string;
  createdAt: Date;
  updatedAt: Date;
}
