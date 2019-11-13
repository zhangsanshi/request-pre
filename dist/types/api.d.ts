import methods from './methods';
interface DefaultData {
    [key: string]: unknown;
}
interface ApiSchemaConfig extends DefaultData {
    mock?: string;
}
interface ApiSchemaMock {
    [key: string]: {
        success: boolean;
        data: unknown;
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
