import type { Provider } from '@nestjs/common';
import { Atm } from './Atm';


export const ATM_PROVIDER_TOKEN = Symbol('atm_provider');

export const atmProvider: Provider = {
  provide: ATM_PROVIDER_TOKEN,
  useClass: Atm,
};
