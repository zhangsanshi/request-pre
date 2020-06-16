import { ApiSchemaList, ServiceConfig } from './api';
import { apiConfig } from './config';
import { createRequestReturn, requester, middleware } from './util/request';
declare type API<T> = {
    [prop in keyof T]: createRequestReturn;
};
interface APIDynamic {
    [prop: string]: any;
}
declare class Service {
    constructor(requester: requester);
    [prop: string]: any;
    preConfig: apiConfig;
    postConfig: apiConfig;
    private requester;
    middlewareList: middleware[];
    use(middleware: middleware): Service;
    private createRequest;
    generator<T extends ApiSchemaList, U extends APIDynamic>(apiSchemaList: T, dynamicServices?: U, serviceConfig?: ServiceConfig): API<T> & U & APIDynamic;
}
export default Service;
