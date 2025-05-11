//resolvers
import { getFortuneCookies } from './getFortuneCookies';
import { addFortuneCookie } from './addFortuneCookie';
import { deleteFortuneCookie } from './deleteFortuneCookie';

export const resolvers = {
  Query: {
    getFortuneCookies,
  },
  Mutation: {
    addFortuneCookie,
    deleteFortuneCookie
  }
}
