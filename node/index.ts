import { Service } from '@vtex/api';
import type { ParamsContext, RecorderState, ServiceContext } from '@vtex/api';

import { Clients } from './clients';
import { resolvers } from './resolvers';

const THIRTY_SECONDS_MS = 30 * 1000;

declare global {
  type Context = ServiceContext<Clients>
}

export default new Service<Clients, RecorderState, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        timeout: THIRTY_SECONDS_MS,
      },
    },
  },
  graphql: {
    resolvers
  }
})
