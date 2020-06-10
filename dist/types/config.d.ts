import { ApiSchemaConfig } from './api';
export declare const SKIP_NEXT: {};
export declare const SKIP_REQUEST: {};
export declare type serviceConfig = Map<string, Function | {
    resolve?: Function;
    reject?: Function;
}>;
declare const _default: {
    pre(config: ApiSchemaConfig, configMap: serviceConfig, initData: any): Promise<any>;
    post(config: ApiSchemaConfig, configMap: serviceConfig, initData: Promise<any>): Promise<any>;
};
export default _default;
