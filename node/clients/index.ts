import { IOClients } from '@vtex/api';
import { FortuneCookiesClient } from './fortuneCookies';

export class Clients extends IOClients {
  get fortuneCookies() {
    return this.getOrSet('fortuneCookies', FortuneCookiesClient)
  }
}
