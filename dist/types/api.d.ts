import methods from './methods';
interface DefaultData {
    [key: string]: any;
}
interface ApiSchemaConfig extends DefaultData {
    mock?: string;
    requestType?: string;
    cache?: {
        key?: string;
        max?: number;
        expire?: number;
    };
    cancel?: boolean;
    timeout?: number;
}
interface ApiSchemaMock {
    [key: string]: {
        success: boolean;
        data: any;
    };
}
interface UrlSchema {
    query?: DefaultData;
    body?: DefaultData;
    headers?: DefaultData;
    method: methods;
    path: string;
}
declare type UrlSchemaData = Omit<UrlSchema, 'method' | 'path'> & {
    path?: {
        [key: string]: string;
    };
};
export interface ApiSchema {
    url: UrlSchema;
    config?: ApiSchemaConfig;
    mock?: ApiSchemaMock;
}
export interface ServiceConfig {
    prefix?: string;
    headers?: DefaultData;
    config?: ApiSchemaConfig;
}
export interface ApiSchemaData extends UrlSchemaData {
    config?: ApiSchemaConfig;
    mock?: ApiSchemaMock;
}
export interface ApiSchemaList {
    [propName: string]: ApiSchema;
}
export {};
