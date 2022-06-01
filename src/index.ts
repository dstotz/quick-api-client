export interface QuickApiClient {
  get: <T>(options: RequestOptions) => Promise<T>;
  getPaginated: <T>(
    options: RequestOptions,
    callback: (results: T, rawResults: any) => void,
    page?: number
  ) => void;
  put: <T>(options: RequestOptions) => Promise<T>;
  post: <T>(options: RequestOptions) => Promise<T>;
  del: <T>(options: RequestOptions) => Promise<T>;
  clientOptions: ClientOptions
}

export interface ClientOptions {
  baseUrl?: string;
  headers?: { [key: string]: any };
  defaultInit?: RequestInit;
  paginationOptions?: ClientPaginationOptions;
  defaultQueryParams?: QueryParams
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
  params?: QueryParams
  headers?: RequestInit['headers'];
  body?: RequestInit['body'];
  init?: RequestInit
}

interface QueryParams { [key: string]: any }

export const createQuickApiClient = (
  clientOptions: ClientOptions
): QuickApiClient => {
  const makeRequest = async <T>(
    endpoint: string,
    init: RequestInit,
    queryParams?: QueryParams
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
      {...{ method: 'GET', headers, body }, ...init},
      params,
    );
  };

  const getPaginated = async <T>(
    options: RequestOptions,
    callback: (results: T, rawResults: any) => void,
    page?: number
  ) => {
    const pageParam = clientOptions.paginationOptions?.pageParam || 'page';
    const params = options.params || {};
    const currentPage = page || params[pageParam] || 1;

    get<T>({
      ...options,
      ...{ params: { ...options.params, [pageParam]: currentPage } },
    }).then((rawResults) => {
      const results = clientOptions.paginationOptions?.resultKey
        ? (rawResults[clientOptions.paginationOptions.resultKey as keyof T] as unknown as T)
        : rawResults;
      if (
        results === null ||
        results === undefined ||
        (Array.isArray(results) && results.length > 0)
      ) {
        callback(results, rawResults);
      } else {
        return;
      }

      if (clientOptions.paginationOptions?.lastPage && clientOptions.paginationOptions.lastPage(results)) {
        return;
      }

      const nextPage = currentPage + 1;
      getPaginated(options, callback, nextPage);
    });
  };

  const put = async <T>(options: RequestOptions): Promise<T> => {
    const { endpoint, headers, body, params, init } = options;
    return await makeRequest<T>(
      endpoint,
      {...{ method: 'PUT', headers, body }, ...init},
      params
    );
  };

  const post = async <T>(options: RequestOptions): Promise<T> => {
    const { endpoint, headers, body, params, init } = options;
    return await makeRequest<T>(
      endpoint,
      {...{ method: 'POST', headers, body }, ...init},
      params
    );
  };

  const del = async <T>(options: RequestOptions): Promise<T> => {
    const { endpoint, headers, body, params, init } = options;
    return await makeRequest<T>(
      endpoint,
      {...{ method: 'DELETE', headers, body }, ...init},
      params
    );
  };

  return {
    get,
    getPaginated,
    put,
    post,
    del,
    clientOptions
  };
};

export const buildRequestUrl = (
  clientOptions: ClientOptions,
  endpoint: string,
  queryParams?: QueryParams
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

  if (queryParams || clientOptions.defaultQueryParams) {
    const allParams = {...clientOptions.defaultQueryParams, ...queryParams}
    const searchParams = new URLSearchParams(allParams);
    const urlLastChar = urlString[urlString.length - 1];
    if (urlLastChar !== '?' && urlLastChar !== '&') {
      if (urlString.includes('?')) {
        urlString += '&';
      } else {
        urlString += '?';
      }
    }
    urlString += searchParams.toString();
  }

  return new URL(urlString).toString();
};

export default createQuickApiClient
