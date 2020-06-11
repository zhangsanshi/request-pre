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
const service = new Service(apiSchemaList, serviceConfig, function ({ config, url, mock }): Promise<object> {
    return Promise.resolve({
        config, url, mock
    });
});
const path =  serviceConfig.prefix + apiSchemaList.detail.url.path;
test('instanceof Service', (): void => {
    expect(service instanceof Service).toBe(true);
});
test('middleware', (): void => {
    const service = new Service(apiSchemaList, {}, function ({ config, url, mock }): Promise<object> {
        return Promise.resolve({
            config, url, mock
        });
    });
    service.list({
        config: {
            mock: 'list.success',
        },
    }).then((data): void => {
        expect(data.url.headers['Content-Type']).toStrictEqual('application/json;charset=UTF-8');
    });

    const service2 = new Service(apiSchemaList, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
    }, function ({ config, url, mock }): Promise<object> {
        return Promise.resolve({
            config, url, mock
        });
    });
    service2.list({
        config: {
            mock: 'list.success',
            requestType: 'form',
        },
    }).then((data): void => {
        expect(data.url.headers['Content-Type']).toStrictEqual('application/x-www-form-urlencoded;charset=UTF-8');
    });
});
test('custom middleware', (): void => {
    const service = new Service(apiSchemaList, {
        config: {
            custom: 'addHeader',
        },
    }, function ({ config, url, mock }): Promise<object> {
        return Promise.resolve({
            config, url, mock
        });
    });
    service.use(async function (apiSchema, next): Promise<any> {
        if (apiSchema.config.custom === 'addHeader') {
            const headers = apiSchema.url.headers = apiSchema.url.headers || {};
            headers.addHeader = 'addHeader';
        }
        return await next();
    });
    service.list().then((data): void => {
        expect(data.url.headers['addHeader']).toStrictEqual('addHeader');
    });
});
test('process.env.NODE_ENV=development & mock', (): void => {
    process.env.NODE_ENV = 'development';
    service.list({
        config: {
            mock: 'list.success',
        },
    }).then((data): void => {
        expect(data).toStrictEqual(apiSchemaList.list.mock["list.success"].data());
    });
    service.list({
        config: {
            mock: 'list.fail',
        },
    }).catch((data): void => {
        expect(data).toBe(apiSchemaList.list.mock["list.fail"].data);
    });
    service.$list({
        config: {
            mock: 'list.success',
        },
    }).then((data): void => {
        expect(data).toStrictEqual(apiSchemaList.list.mock["list.success"].data());
    });
});

test('process.env.NODE_ENV=production', (): void => {
    process.env.NODE_ENV = 'production';
    service.list({
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
    service.detail({
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
test('reset request method', (): void => {
    service.list = function (...args): Promise<object> {
        return service.$list(...args);
    };
    service.list({
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
    expect((): void => {
        service.$list = 'test';
    }).toThrow();
});


test('[no Proxy]process.env.NODE_ENV=development & mock', (): void => {
    Proxy = undefined;
    const service2 = new Service(apiSchemaList, serviceConfig, function ({ config, url, mock }): Promise<any> {
        return Promise.resolve({
            config, url, mock
        });
    });
    process.env.NODE_ENV = 'development';
    service2.list({
        config: {
            mock: 'list.success',
        },
    }).then((data): void => {
        expect(data).toStrictEqual(apiSchemaList.list.mock["list.success"].data());
    });
    service2.list({
        config: {
            mock: 'list.fail',
        },
    }).catch((data): void => {
        expect(data).toBe(apiSchemaList.list.mock["list.fail"].data);
    });
    service2.$list({
        config: {
            mock: 'list.success',
        },
    }).then((data): void => {
        expect(data).toStrictEqual(apiSchemaList.list.mock["list.success"].data());
    });
});


test('preprocess', (): void => {
    const service = new Service(apiSchemaList, {}, function ({ config, url, mock }): Promise<object> {
        return Promise.resolve({
            config, url, mock
        });
    });
    service.list({
        config: {
            preprocess(requestInfo): void {
                requestInfo.url.headers.xxxx = 'aaaa';
            },
        },
    }).then((data): void => {
        expect(data.url.headers.xxxx).toStrictEqual('aaaa');
    });
});

test('postprocess', (): void => {
    const service = new Service(apiSchemaList, {}, function ({ config, url, mock }): Promise<object> {
        return Promise.resolve({
            config, url, mock
        });
    });
    service.list({
        config: {
            postprocess(): number {
                return 1;
            },
        },
    }).then((data): void => {
        expect(data).toStrictEqual(1);
    });
});

test('custom config', (): void => {
    let p = false;
    const service = new Service(apiSchemaList, {}, function ({ config, url, mock }): Promise<object> {
        p = !p;
        return p ? Promise.resolve({
            config, url, mock
        }): Promise.reject({
            config, url, mock
        });
    });
    service.postConfig.set('xxx', {
        resolve(): any {
            return {a:2};
        },
        reject(): any {
            return {a:4};
        }
    });
    service.list({
        config: {
            xxx: true,
        },
    }).then((data): void => {
        expect(data).toStrictEqual({a:2});
    });
    service.list({
        config: {
            xxx: true,
        },
    }).then((data): void => {
        expect(data).toStrictEqual({a:4});
    });
    service.list({
        config: {
            mock: 'list.fail',
            xxx: true,
        },
    }).then((data): void => {
        expect(data).toStrictEqual({a:4});
    });
    service.list({
        config: {
            mock: 'list.success',
            xxx: true,
        },
    }).then((data): void => {
        expect(data).toStrictEqual({a:2});
    });

    service.list({
        config: {
            mock: 'list.success',
            xxx: true,
            postprocess() {
                return 1;
            },
        },
    }).then((data): void => {
        expect(data).toStrictEqual(1);
    });
});