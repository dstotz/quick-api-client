export interface IClient {
    get: <T>(options: IRequestOptions) => Promise<T>;
    getPaginated: <T>(options: IRequestOptions, callback: (results: T, rawResults: any) => void, page?: number) => void;
    put: <T>(options: IRequestOptions) => Promise<T>;
    post: <T>(options: IRequestOptions) => Promise<T>;
    del: <T>(options: IRequestOptions) => Promise<T>;
}
export interface IClientOptions {
    baseUrl?: string;
    headers?: {
        [key: string]: any;
    };
    defaultInit?: RequestInit;
    paginationOptions?: IClientPaginationOptions;
}
export interface IClientPaginationOptions {
    pageParam?: string;
    resultKey?: string;
    lastPage?: (results: any) => boolean;
}
export interface IRequestOptions {
    endpoint: string;
    params?: IQueryParams;
    headers?: RequestInit['headers'];
    body?: RequestInit['body'];
    init?: RequestInit;
}
interface IQueryParams {
    [key: string]: any;
}
export declare const createQuickApiClient: (clientOptions: IClientOptions) => IClient;
export declare const buildRequestUrl: (clientOptions: IClientOptions, endpoint: string, queryParams?: IQueryParams | undefined) => string;
export default createQuickApiClient;
