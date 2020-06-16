import { ApiSchemaConfig, ApiSchema } from './api';
import { requestReturn } from './util/request';
export declare const SKIP_NEXT: {};
export declare const SKIP_REQUEST: {};
export declare type apiConfig = Map<string, Function | {
    resolve?: Function;
    reject?: Function;
}>;
declare const _default: {
    pre(config: ApiSchemaConfig, configMap: apiConfig, initData: any, ctx: ApiSchema): Promise<any>;
    post(config: ApiSchemaConfig, configMap: apiConfig, initData: requestReturn, ctx: ApiSchema): Promise<any>;
};
export default _default;
