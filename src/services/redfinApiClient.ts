
const RAPIDAPI_KEY = '368fcd3424mshc9624dccf030eaep1ada4ajsn5c0135eebcf7';
const BASE_URL = 'https://redfin-com-data.p.rapidapi.com';

export const createApiRequest = (endpoint: string) => {
  return fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
    }
  });
};
