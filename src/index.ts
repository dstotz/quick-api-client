export interface IClient {
  get: <T>(options: IRequestOptions) => Promise<T>;
  getPaginated: <T>(
    options: IRequestOptions,
    callback: (results: T, rawResults: any) => void,
    page?: number
  ) => void;
  put: <T>(options: IRequestOptions) => Promise<T>;
  post: <T>(options: IRequestOptions) => Promise<T>;
  del: <T>(options: IRequestOptions) => Promise<T>;
}

export interface IClientOptions {
  baseUrl?: string;
  headers?: { [key: string]: any };
  paginationOptions?: IClientPaginationOptions;
}

export interface IClientPaginationOptions {
  pageParam?: string; // Query param used for specifying the current page
  resultKey?: string; // When specified, tells which key in the response body contains the array of results
  lastPage?: (results: any) => boolean; // Tell if this is the last page proactively without needing to make an extra API request to find out 0 results
}

export interface IRequestOptions {
  endpoint: string;
  params?: IQueryParams
  headers?: RequestInit['headers'];
  body?: RequestInit['body'];
}

interface IQueryParams { [key: string]: any }

export const createQuickApiClient = (
  clientOptions: IClientOptions
): IClient => {
  const { headers, paginationOptions } = clientOptions;

  const makeRequest = async <T>(
    endpoint: string,
    init: RequestInit,
    queryParams?: IQueryParams
  ): Promise<T> => {
    const requestUrl = buildRequestUrl(clientOptions, endpoint, queryParams);
    const requestInit: RequestInit = {
      ...init,
      ...{
        headers: {
          ...headers,
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

  const get = async <T>(options: IRequestOptions): Promise<T> => {
    const { endpoint, headers, body, params } = options;
    return await makeRequest<T>(
      endpoint,
      { method: 'GET', headers, body },
      params
    );
  };

  const getPaginated = async <T>(
    options: IRequestOptions,
    callback: (results: T, rawResults: any) => void,
    page?: number
  ) => {
    const pageParam = paginationOptions?.pageParam || 'page';
    const params = options.params || {};
    const currentPage = page || params[pageParam] || 1;

    get<T>({
      ...options,
      ...{ params: { ...options.params, [pageParam]: currentPage } },
    }).then((rawResults) => {
      const results = paginationOptions?.resultKey
        ? (rawResults[paginationOptions.resultKey as keyof T] as unknown as T)
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

      if (paginationOptions?.lastPage && paginationOptions.lastPage(results)) {
        return;
      }

      const nextPage = currentPage + 1;
      getPaginated(options, callback, nextPage);
    });
  };

  const put = async <T>(options: IRequestOptions): Promise<T> => {
    const { endpoint, headers, body, params } = options;
    return await makeRequest<T>(
      endpoint,
      { method: 'PUT', headers, body },
      params
    );
  };

  const post = async <T>(options: IRequestOptions): Promise<T> => {
    const { endpoint, headers, body, params } = options;
    return await makeRequest<T>(
      endpoint,
      { method: 'POST', headers, body },
      params
    );
  };

  const del = async <T>(options: IRequestOptions): Promise<T> => {
    const { endpoint, headers, body, params } = options;
    return await makeRequest<T>(
      endpoint,
      { method: 'DELETE', headers, body },
      params
    );
  };

  return {
    get,
    getPaginated,
    put,
    post,
    del,
  };
};

export const buildRequestUrl = (
  clientOptions: IClientOptions,
  endpoint: string,
  queryParams?: IQueryParams
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

  if (queryParams) {
    const searchParams = new URLSearchParams(queryParams);
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
