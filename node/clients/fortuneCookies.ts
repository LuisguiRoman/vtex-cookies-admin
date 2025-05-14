import { InstanceOptions, IOContext, ExternalClient } from '@vtex/api';
import { API_URLS } from '../config';

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

  public getCookies = async (): Promise<any> => {
    try {
      const response = await this.http.get(API_URLS.listCookies);

      return response;
    } catch (error) {
      return [];
    }
  }

  public addCookie = async (phrase: string): Promise<any> => {
    try {
      const response = await this.http.post<any>(API_URLS.addCookie,
        {
          CookieFortune: phrase
        }
      );

      return {
        id: response?.DocumentId || '',
        phrase
      };
    } catch (error) {
      throw new Error('Create Failed');
    }
  };

  public deleteCookie = async (id: string): Promise<any> => {
    try {
      const response = await this.http.delete(`${API_URLS.deleteCookie}/${id}`);
      return {
        ...response,
        id
      };
    } catch (error) {
      throw new Error('Delete Failed');
    }
  };
  
}
