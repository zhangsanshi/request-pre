import { ApiSchemaData, ApiSchema } from '../api';
export declare type requestReturn = Promise<any>;
export declare type createRequestReturn = (requestObj: ApiSchemaData) => requestReturn;
export declare type requester = (requestInfo: ApiSchema) => requestReturn;
export declare type composeNext = (i: number) => requestReturn;
export declare type middleware = (ctx: ApiSchema, next: composeNext) => requestReturn;
