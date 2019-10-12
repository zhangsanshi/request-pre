import { ApiSchemaList, ServiceConfig } from './api';
declare type requestReturn = Promise<unknown>;
declare type requester = ({ config: ApiSchemaConfig, mock: ApiSchemaMock, url: UrlSchema, }: {
    config: any;
    mock: any;
    url: any;
}) => requestReturn;
declare class Service {
    constructor(apiSchemaList: ApiSchemaList, serviceConfig: ServiceConfig, requester: requester);
    [prop: string]: any;
    private apiSchemaList;
    private requester;
    private serviceConfig;
    private createRequest;
    private initService;
}
export default Service;
