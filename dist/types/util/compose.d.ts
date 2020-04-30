import { requestReturn, middleware } from './request';
import { ApiSchema } from '../api';
export declare type composeEnd = (ctx: ApiSchema) => requestReturn;
export declare type middlewareEnd = (ctx: ApiSchema, next: composeEnd) => requestReturn;
export default function (middlewareList: middleware[]): middlewareEnd;
