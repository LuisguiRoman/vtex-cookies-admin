export interface ICookie {
    id: string
    CookieFortune: string
}

export interface IDataCookies {
    getFortuneCookies: ICookie[]
}

export interface IcookieItem {
    id: string
    phrase: string
}

export interface Field {
    key: string
    value: string
}
  
export interface Document {
   fields: Field[]
}
  
export interface RawResponse {
   documents: Document[]
}
  
export interface Fortune {
    id: string
    phrase: string
}