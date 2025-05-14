import { RawResponse, Fortune, Field } from './typings/cookies';

export const parseFortunes = (data: RawResponse): Fortune[] => {
    return data?.documents.map(doc => {
      const idField = doc?.fields?.find((field: Field) => field.key === 'id');
      const phraseField = doc?.fields?.find((field: Field) => field.key === 'CookieFortune');
  
      return {
        id: idField?.value || '',
        phrase: phraseField?.value || '',
      }
    }) || [];
}
  