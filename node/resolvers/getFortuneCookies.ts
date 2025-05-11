export const getFortuneCookies = async (
    _: any,
    __: any,
    { clients: { fortuneCookies } }: Context
  ) => {
    return await fortuneCookies.getCookies();
}
  