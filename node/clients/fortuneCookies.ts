import { InstanceOptions, IOContext, ExternalClient } from '@vtex/api';
import { IFortuneCookie } from '../typings/fortuneCookies';

export class FortuneCookiesClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.vtexcommercestable.com.br`, context, {
      ...(options ?? {}),
      headers: {
        ...(options?.headers ?? {}),
        VtexIdclientAutCookie: context.authToken,
        Accept: 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Vtex-Use-Https': 'true',
        'REST-Range': 'resources=0-1000',
      },
    })
  }

  public getCookies = async (): Promise<IFortuneCookie[]> => {
    try {
      const response = await this.http.get(
        `/api/dataentities/CF/search?_fields=id,CookieFortune`
      );

      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
