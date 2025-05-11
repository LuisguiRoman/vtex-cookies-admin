export const entityId = 'CF';
export const basePath = '/api/dataentities';

export const API_URLS = {
    listCookies: `${basePath}/${entityId}/search?_fields=id,CookieFortune`,
    addCookie: `${basePath}/${entityId}/documents`,
    deleteCookie: `${basePath}/${entityId}/documents`
};