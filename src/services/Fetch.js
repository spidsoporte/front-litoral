import url from '../assets/global/urlFetch';

// function - Sin token
export const FetchTokenless = (Endpoint, data, Method = 'GET') => {
  if (Method === 'GET') {
    return fetch(url + Endpoint);
  }

  return fetch(url + Endpoint, {
    method: Method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const FetchTokenized = (Endpoint, token, data, Method = 'GET') => {
  if (Method === 'GET') {
    return fetch(url + Endpoint, {
      headers: {
        Authorization: token,
      }
    })
  }
  
  return fetch(url + Endpoint, {
    method: Method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  })
};