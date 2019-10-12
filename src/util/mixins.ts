import { ApiSchema, ApiSchemaData, ServiceConfig } from '../api';
import methods from '../methods';
import { resolvePath } from './utils';
const bodyMethods = [methods.PATCH, methods.POST, methods.PUT];
export default function mixins(serviceConfig: ServiceConfig, apiSchema: ApiSchema, requestObj: ApiSchemaData): ApiSchema {
    const apiSchemaURL = apiSchema.url;
    requestObj = requestObj || {};
    serviceConfig = serviceConfig || {};
    const requestObjURL: ApiSchemaData["url"] = requestObj.url = requestObj.url || {};
    const apiSchemaURLInfo = {
        ...apiSchemaURL,
    };
    const apiSchemaInfo: ApiSchema = {
        url: apiSchemaURLInfo,
    };
    if (serviceConfig.config || apiSchema.config || requestObj.config) {
        apiSchemaInfo.config = {
            ...serviceConfig.config,
            ...apiSchema.config,
            ...requestObj.config,
        };
    }
    if (apiSchema.mock || requestObj.mock) {
        apiSchemaInfo.mock = apiSchema.mock;
    }
    if (requestObjURL.path) {
        apiSchemaURLInfo.path = resolvePath(apiSchemaURL.path, requestObjURL.path);
    }
    if (serviceConfig.prefix) {
        apiSchemaURLInfo.path = serviceConfig.prefix + apiSchemaURLInfo.path;
    }
    if ((apiSchemaURL.body || requestObjURL.body) && bodyMethods.includes(apiSchemaURLInfo.method)) {
        apiSchemaURLInfo.body = {
            ...apiSchemaURL.body, 
            ...requestObjURL.body,
        };
    }
    if (apiSchemaURL.query || requestObjURL.query) {
        apiSchemaURLInfo.query = {
            ...apiSchemaURL.query, 
            ...requestObjURL.query,
        };
    }
    if (apiSchemaURL.headers || requestObjURL.headers || serviceConfig.headers) {
        apiSchemaURLInfo.headers = {
            ...serviceConfig.headers,
            ...apiSchemaURL.headers, 
            ...requestObjURL.headers,
        };
    }
    return apiSchemaInfo;
}