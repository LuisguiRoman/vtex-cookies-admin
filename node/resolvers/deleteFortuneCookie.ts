interface Args {
    id: string
}
  
export const deleteFortuneCookie = async (
    _: any,
    { id }: Args,
    { clients: { fortuneCookies } }: Context
) => {
    return await fortuneCookies.deleteCookie(id);
}