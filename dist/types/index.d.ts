import { ApiSchemaList, ServiceConfig } from './api';
import { requester, middleware } from './util/request';
declare class Service {
    constructor(apiSchemaList: ApiSchemaList, serviceConfig: ServiceConfig, requester: requester);
    [prop: string]: any;
    private apiSchemaList;
    private requester;
    private serviceConfig;
    middlewareList: middleware[];
    use(middleware: middleware): Service;
    private createRequest;
    private initService;
}
export default Service;
