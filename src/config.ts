import { ApiSchemaConfig } from './api';
export const SKIP_NEXT = {};
export const SKIP_REQUEST = {};
export type serviceConfig = Map<string, Function | {
    resolve?: Function;
    reject?: Function;
}>;
interface ConfigHandler {
    params: any;
    resolve?: Function;
    reject?: Function;
}
function getConfig(config: ApiSchemaConfig, configMap: serviceConfig, defaultPriority: number): ApiSchemaConfig {
    const priority = config.priority;
    let targetConfig = Object.keys(config).filter((configName): boolean => {
        return configName !== 'priority' && configMap.has(configName);
    });
    if (priority) {
        targetConfig = targetConfig.sort((a, b): number => {
            function formatPriority(num: string): number {
                return (typeof priority[num] === 'number') ? priority[num] : defaultPriority;
            }
            return formatPriority(a) - formatPriority(b);
        });
    }
    return targetConfig.map((configName: string): ConfigHandler => {
        const handler = configMap.get(configName);
        let resolve;
        let reject;
        if (handler) {
            resolve = ('resolve' in handler) ? handler?.resolve : handler;
            reject = ('reject' in handler) ? handler.reject : undefined;
        }
        return {
            params: config[configName],
            resolve,
            reject,
        }; 
    });
}
export default {
    async pre(config: ApiSchemaConfig, configMap: serviceConfig, initData: any): Promise<any> {
        if (config) {
            return getConfig(config, configMap, 50).reduce((pre: Promise<any>, configHandler: ConfigHandler): Promise<any> => {
                return pre.then((prevData: any): void => {
                    if (configHandler.resolve) {
                        return configHandler.resolve(initData, configHandler.params, prevData);
                    }
                    return prevData;
                }, (error): any => {
                    if (configHandler.reject) {
                        return configHandler.reject(initData, configHandler.params, error);
                    }
                    return Promise.reject(error);
                });
            }, Promise.resolve(initData));
        }
        return initData;
    },
    async post(config: ApiSchemaConfig, configMap: serviceConfig, initData: Promise<any>): Promise<any> {
        if (config) {
            return getConfig(config, configMap, 50).reduce((pre: Promise<any>, configHandler: ConfigHandler): Promise<any> => {
                return pre.then((prevData: any): void => {
                    if (configHandler.resolve) {
                        return configHandler.resolve(prevData, configHandler.params, initData);
                    }
                    return prevData;
                }, (error): any => {
                    if (configHandler.reject) {
                        return configHandler.reject(error, configHandler.params, initData);
                    }
                    return Promise.reject(error);
                });
            }, Promise.resolve(initData));
        }
        return initData;
    }
};