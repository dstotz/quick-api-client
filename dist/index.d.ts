export interface QuickApiClient {
    get: <T>(options: RequestOptions) => Promise<T>;
    getPaginated: <T>(options: RequestOptions, callback: (results: T, rawResults: any) => void, page?: number) => Promise<void>;
    put: <T>(options: RequestOptions) => Promise<T>;
    post: <T>(options: RequestOptions) => Promise<T>;
    del: <T>(options: RequestOptions) => Promise<T>;
    clientOptions: ClientOptions;
}
export interface ClientOptions {
    baseUrl?: string;
    headers?: {
        [key: string]: any;
    };
    defaultInit?: RequestInit;
    paginationOptions?: ClientPaginationOptions;
    defaultQueryParams?: QueryParams;
}
export interface ClientPaginationOptions {
    pageParam?: string;
    resultKey?: string;
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
export declare const createQuickApiClient: (clientOptions: ClientOptions) => QuickApiClient;
export declare const buildQueryParams: (clientOptions: ClientOptions, queryParams?: QueryParams) => string | null;
export declare const buildRequestUrl: (clientOptions: ClientOptions, endpoint: string, queryParams?: QueryParams) => string;
export default createQuickApiClient;
