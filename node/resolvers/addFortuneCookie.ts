interface Args {
  phrase: string
}

export const addFortuneCookie = async (
    _: any,
    { phrase }: Args,
    { clients: { fortuneCookies } }: Context
  ) => {
    return await fortuneCookies.addCookie(phrase);
}