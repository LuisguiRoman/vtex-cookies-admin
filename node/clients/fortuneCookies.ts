import { InstanceOptions, IOContext, ExternalClient } from '@vtex/api';
import { IFortuneCookie, INewCookie } from '../typings/fortuneCookies';

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
      return [];
    }
  }

  public addCookie = async (phrase: string): Promise<INewCookie> => {
    try {
      const response = await this.http.post<INewCookie>(`/api/dataentities/CF/documents`,
        {
          CookieFortune: phrase
        }
      );

      return {
        DocumentId: response?.DocumentId || ''
      };
    } catch (error) {
      throw new Error('Create Failed');
    }
  };

  public deleteCookie = async (id: string): Promise<any> => {
    try {
      const response = await this.http.delete(`/api/dataentities/CF/documents/${id}`);
      return response;
    } catch (error) {
      throw new Error('Delete Failed');
    }
  };
  
}
