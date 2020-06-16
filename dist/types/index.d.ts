import { ApiSchemaList, ServiceConfig } from './api';
import { serviceConfig } from './config';
import { createRequestReturn, requester, middleware } from './util/request';
declare type API<T> = {
    [prop in keyof T]: createRequestReturn;
};
interface APIDynamic {
    [prop: string]: any;
}
declare class Service {
    constructor(serviceConfig: ServiceConfig, requester: requester);
    [prop: string]: any;
    preConfig: serviceConfig;
    postConfig: serviceConfig;
    private requester;
    private serviceConfig;
    middlewareList: middleware[];
    use(middleware: middleware): Service;
    private createRequest;
    generator<T extends ApiSchemaList, U extends APIDynamic>(apiSchemaList: T, dynamicServices?: U): API<T> & U & APIDynamic;
}
export default Service;
