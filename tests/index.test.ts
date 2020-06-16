import Service from '../src/index';
import methods from '../src/methods';
const apiSchemaList = {
    list: {
        url: {
            path: '/a/b',
            method: methods.GET,
            query: {
                search: 1,
            },
        },
        mock: {
            'list.success': {
                success: true,
                data: (): any[] => [],
            },
            'list.fail': {
                success: false,
                data: [],
            },
        },
    },
    detail: {
        url: {
            path: '/a/b',
            method: methods.POST,
            query: {
                search: 1,
            },
            body: {
                id: 1,
            },
        },
    },
};
const serviceConfig = {
    prefix: '/domain',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
};
const serviceWithDynamic = new Service(function ({ config, url, mock }): Promise<object> {
    return Promise.resolve({
        config, url, mock
    });
}).generator(apiSchemaList, {
    listAll(): number {
        return 1;
    }
}, serviceConfig);
const serviceWithoutDynamic = new Service(function ({ config, url, mock }): Promise<any> {
    return Promise.resolve({
        config, url, mock
    });
}).generator(apiSchemaList, null, serviceConfig);
const path = serviceConfig.prefix + apiSchemaList.detail.url.path;
test('instanceof Service', (): void => {
    expect(serviceWithDynamic instanceof Service).toBe(false);
});
test('custom add property', (): void => {
    expect((): void => {
        serviceWithDynamic.customProperty = 1;
    }).not.toThrow();
    expect((): void => {
        serviceWithoutDynamic.customProperty = 1;
    }).not.toThrow();
});
test('run dynamic method', (): void => {
    expect(serviceWithDynamic.listAll()).toBe(1);
});
test('set Service method', (): void => {
    expect((): void => {
        serviceWithDynamic.list = function (): Promise<any> {
            return Promise.resolve(1);
        }
    }).toThrow(TypeError);
    expect((): void => {
        serviceWithDynamic.listAll = function (): number {
            return 2;
        }
    }).not.toThrow();
});
test('process.env.NODE_ENV=development & mock', (): void => {
    process.env.NODE_ENV = 'development';
    serviceWithDynamic.list({
        config: {
            mock: 'list.success',
        },
    }).then((data): void => {
        expect(data).toStrictEqual(apiSchemaList.list.mock["list.success"].data());
    });
    serviceWithDynamic.list({
        config: {
            mock: 'list.fail',
        },
    }).catch((data): void => {
        expect(data).toBe(apiSchemaList.list.mock["list.fail"].data);
    });
});

test('process.env.NODE_ENV=production', (): void => {
    process.env.NODE_ENV = 'production';
    serviceWithDynamic.list({
        config: {
            mock: 'list.success',
        },
    }).then(({ config, url, mock }): void => {
        expect(mock).toStrictEqual(apiSchemaList.list.mock);
        expect({
            ...apiSchemaList.list.url,
            headers: serviceConfig.headers,
            path,
        }).toStrictEqual(url);
    });
    serviceWithDynamic.detail({
        config: {
            mock: 'list.success',
        },
    }).then(({ config, url, mock }): void => {
        expect(url).toStrictEqual({
            ...apiSchemaList.detail.url,
            headers: serviceConfig.headers,
            path,
        });
    });
});

test('[no Proxy]process.env.NODE_ENV=development & mock', (): void => {
    Proxy = undefined;
    process.env.NODE_ENV = 'development';
    serviceWithoutDynamic.list({
        config: {
            mock: 'list.success',
        },
    }).then((data): void => {
        expect(data).toStrictEqual(apiSchemaList.list.mock["list.success"].data());
    });
    serviceWithoutDynamic.list({
        config: {
            mock: 'list.fail',
        },
    }).catch((data): void => {
        expect(data).toBe(apiSchemaList.list.mock["list.fail"].data);
    });
});
