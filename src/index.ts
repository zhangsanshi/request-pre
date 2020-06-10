import { ApiSchemaList, ApiSchemaData, ServiceConfig, ApiSchema } from './api';
import mixin from './util/mixin';
import compose  from './util/compose';
import runConfig, { serviceConfig }  from './config';
import mock from './util/mock';
import preprocess from './config/preprocess';
import postprocess from './config/postprocess';
import { requestReturn, createRequestReturn, requester, middleware } from './util/request';
import requestType from './middleware/requestType';

class Service {
    public constructor(apiSchemaList: ApiSchemaList, serviceConfig: ServiceConfig, requester: requester) {
        this.serviceConfig = serviceConfig;
        this.apiSchemaList = apiSchemaList;
        this.requester = requester;
        this.preConfig = new Map();
        this.postConfig = new Map();
        this.middlewareList = [
            requestType,
        ];
        this.preConfig.set('preprocess', preprocess);
        this.postConfig.set('postprocess', postprocess);
        return this.initService();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;
    private apiSchemaList: ApiSchemaList;
    public preConfig: serviceConfig;
    public postConfig: serviceConfig;
    private requester: requester;
    private serviceConfig: ServiceConfig;
    public middlewareList: middleware[];
    public use(middleware: middleware): Service {
        this.middlewareList.push(middleware);
        return this;
    }
    private createRequest(apiName: string, target: Service, middlewareWrap): createRequestReturn {
        return function(requestObj: ApiSchemaData): requestReturn {
            const requestInfo = mixin(target.serviceConfig, target.apiSchemaList[apiName], requestObj);
            return middlewareWrap(requestInfo, (ctx: ApiSchema): requestReturn => {
                const { config } = ctx;
                let request = runConfig.pre(config, target.preConfig, ctx) || Promise.resolve(ctx);
                
                request = request.then((): Promise<any> => {
                    if (process.env.NODE_ENV === 'development') {
                        const mockData = mock(ctx);
                        if (mockData) {
                            return mockData;
                        }
                    }
                    return target.requester(ctx);
                });
                return runConfig.post(config, target.postConfig, request);
            });
        };
    }
    private initService(): Service {
        const { apiSchemaList } = this;
        const middlewareWrap = compose(this.middlewareList);
        if (typeof Proxy === 'undefined') {
            Object.keys(apiSchemaList).forEach((apiName): void => {
                this[apiName] = this['$' + apiName] = this.createRequest(apiName, this, middlewareWrap);
            });
            return this;
        } else {
            return new Proxy(this, {
                get(target: Service, propertyKey: string): createRequestReturn | any {
                    if (propertyKey in target) {
                        return target[propertyKey];
                    }
                    if (propertyKey.startsWith('$')) {
                        propertyKey = propertyKey.substring(1);
                    }
                    if (propertyKey in target.apiSchemaList) {
                        return target.createRequest(propertyKey, target, middlewareWrap);
                    }
                },
                set(target: Service, propertyKey: string, value: any, receiver: object): boolean {
                    if (propertyKey.startsWith('$') && apiSchemaList[propertyKey.substring(1)]) {
                        if (process.env.NODE_ENV === 'development')
                            console.error(`can not set property ${propertyKey}`);
                        return false;
                    } else {
                        return Reflect.set(target, propertyKey, value, receiver);
                    }
                },
            });
        }
    }
}
export default Service;
