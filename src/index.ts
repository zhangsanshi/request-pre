import { ApiSchemaList, ApiSchemaData, ServiceConfig } from './api';
import mixins from './util/mixins';

type requestReturn = Promise<unknown>;
type createRequestReturn = (requestObj: ApiSchemaData) => requestReturn;
type requester = ({
    config: ApiSchemaConfig,
    mock: ApiSchemaMock,
    url: UrlSchema,
}) => requestReturn;
class Service {
    public constructor(apiSchemaList: ApiSchemaList, serviceConfig: ServiceConfig, requester: requester) {
        this.serviceConfig = serviceConfig;
        this.apiSchemaList = apiSchemaList;
        this.requester = requester;
        return this.initService();
    }
    [prop: string]: any;
    private apiSchemaList: ApiSchemaList;
    private requester: Function;
    private serviceConfig: ServiceConfig;
    private createRequest(apiName: string, target: Service): createRequestReturn {
        return function(requestObj: ApiSchemaData): requestReturn {
            const requestInfo = mixins(target.serviceConfig, target.apiSchemaList[apiName], requestObj);
            const { config, mock } = requestInfo;
            const mockStatus = config && config.mock;
            const mockInfo = mockStatus && mock && mock[mockStatus];
            if (process.env.NODE_ENV === 'development') {
                if (mockInfo) {
                    console.log(requestInfo);
                    return new Promise((res, rej): void => {
                        const action = mockInfo.success ? res : rej;
                        action(typeof mockInfo.data === 'function' ? mockInfo.data(config) : mockInfo.data);
                    });
                }
            }
            return target.requester(requestInfo);
        };
    }
    private initService(): Service {
        const { apiSchemaList } = this;
        if (!Proxy) {
            Object.keys(apiSchemaList).forEach((apiName): void => {
                this[apiName] = this['$' + apiName] = this.createRequest(apiName, this);
            });
            return this;
        } else {
            return new Proxy(this, {
                get(target: Service, propertyKey: string): createRequestReturn|unknown {
                    if (propertyKey in target) {
                        return target[propertyKey];
                    }
                    if (propertyKey.startsWith('$')) {
                        propertyKey = propertyKey.substring(1);
                    }
                    if (propertyKey in target.apiSchemaList) {
                        return target.createRequest(propertyKey, target);
                    }
                },
                set(target: Service, propertyKey: string, value: unknown, receiver: object): boolean {
                    if (propertyKey.startsWith('$') && apiSchemaList[propertyKey.substring(1)]) {
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