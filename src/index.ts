const fetch = require('node-fetch');

export interface QuickApiClient {
  get: <T>(options: RequestOptions) => Promise<T>;
  getPaginated: <T>(
    options: RequestOptions,
    callback: (results: T, rawResults: any) => void,
    page?: number,
  ) => Promise<void>;
  put: <T>(options: RequestOptions) => Promise<T>;
  post: <T>(options: RequestOptions) => Promise<T>;
  del: <T>(options: RequestOptions) => Promise<T>;
  clientOptions: ClientOptions;
}

export interface ClientOptions {
  baseUrl?: string;
  headers?: { [key: string]: any };
  defaultInit?: RequestInit;
  paginationOptions?: ClientPaginationOptions;
  defaultQueryParams?: QueryParams;
}

export interface ClientPaginationOptions {
  /** Query param used for specifying the current page */
  pageParam?: string;
  /** When specified, tells which key in the response body contains the array of results */
  resultKey?: string;
  /** Tell if this is the last page proactively without needing to make an extra API request to find out 0 results */
  lastPage?: (results: any) => boolean;
}

export interface RequestOptions {
  endpoint: string;
  params?: QueryParams;
  headers?: RequestInit['headers'];
  body?: RequestInit['body'];
  init?: RequestInit;
}

interface QueryParams {
  [key: string]: any;
}

export const createQuickApiClient = (
  clientOptions: ClientOptions,
): QuickApiClient => {
  const makeRequest = async <T>(
    endpoint: string,
    init: RequestInit,
    queryParams?: QueryParams,
  ): Promise<T> => {
    const requestUrl = buildRequestUrl(clientOptions, endpoint, queryParams);
    const requestInit: RequestInit = {
      ...clientOptions.defaultInit,
      ...init,
      ...{
        headers: {
          ...clientOptions.headers,
          ...init.headers,
        },
      },
    };

    const response = await fetch(requestUrl, requestInit);

    if (response.ok) {
      return (await response.json()) as T;
    } else {
      throw new Error(JSON.stringify(response));
    }
  };

  const get = async <T>(options: RequestOptions): Promise<T> => {
    const { endpoint, headers, body, params, init } = options;
    return await makeRequest<T>(
      endpoint,
      { ...{ method: 'GET', headers, body }, ...init },
      params,
    );
  };

  const getPaginated = async <T>(
    options: RequestOptions,
    callback: (results: T, rawResults: any) => void | Promise<void>,
    page?: number,
  ): Promise<void> => {
    const pageParam = clientOptions.paginationOptions?.pageParam || 'page';
    const params = options.params || {};
    let currentPage = page || params[pageParam] || 1;
    let done = false;
    const resultKey = clientOptions.paginationOptions?.resultKey as
      | keyof T
      | undefined;

    do {
      const rawResults = await get<any>({
        ...options,
        ...{ params: { ...options.params, [pageParam]: currentPage } },
      });

      const results = resultKey ? rawResults[resultKey] : rawResults;

      if (!results || (Array.isArray(results) && results.length === 0)) {
        done = true;
        return;
      }

      if (
        clientOptions.paginationOptions?.lastPage &&
        clientOptions.paginationOptions?.lastPage(results)
      ) {
        done = true;
        return;
      }

      await callback(results as T, rawResults);

      currentPage++;
    } while (done === false);
  };

  const put = async <T>(options: RequestOptions): Promise<T> => {
    const { endpoint, headers, body, params, init } = options;
    return await makeRequest<T>(
      endpoint,
      { ...{ method: 'PUT', headers, body }, ...init },
      params,
    );
  };

  const post = async <T>(options: RequestOptions): Promise<T> => {
    const { endpoint, headers, body, params, init } = options;
    return await makeRequest<T>(
      endpoint,
      { ...{ method: 'POST', headers, body }, ...init },
      params,
    );
  };

  const del = async <T>(options: RequestOptions): Promise<T> => {
    const { endpoint, headers, body, params, init } = options;
    return await makeRequest<T>(
      endpoint,
      { ...{ method: 'DELETE', headers, body }, ...init },
      params,
    );
  };

  return {
    get,
    getPaginated,
    put,
    post,
    del,
    clientOptions,
  };
};

export const buildQueryParams = (
  clientOptions: ClientOptions,
  queryParams?: QueryParams,
): string | null => {
  if (!queryParams && !clientOptions.defaultQueryParams) return null;

  const allParams = { ...clientOptions.defaultQueryParams, ...queryParams };
  const searchParams = new URLSearchParams();
  Object.keys(allParams).forEach((key) => {
    const val = allParams[key];
    if (key.includes('[]')) {
      val.forEach((v: any) => searchParams.append(key, v));
    } else {
      searchParams.append(key, val);
    }
  });

  return searchParams.toString();
};

export const buildRequestUrl = (
  clientOptions: ClientOptions,
  endpoint: string,
  queryParams?: QueryParams,
): string => {
  const parts: string[] = [endpoint];
  if (
    clientOptions.baseUrl &&
    !endpoint.includes('http://') &&
    !endpoint.includes('https://')
  ) {
    parts.unshift(clientOptions.baseUrl);
  }

  let urlString = parts
    .map((part) => {
      let urlPart = part;
      let lastChar = urlPart.charAt(urlPart.length - 1);
      if (lastChar === '/') {
        urlPart = urlPart.slice(0, -1);
      }
      if (urlPart[0] === '/') {
        urlPart = urlPart.substring(1);
      }
      return urlPart;
    })
    .join('/');

  const queryString = buildQueryParams(clientOptions, queryParams);
  if (queryString) {
    const urlLastChar = urlString[urlString.length - 1];
    if (urlLastChar !== '?' && urlLastChar !== '&') {
      if (urlString.includes('?')) {
        urlString += '&';
      } else {
        urlString += '?';
      }
    }
    urlString += queryString;
  }

  return new URL(urlString).toString();
};

export default createQuickApiClient;
