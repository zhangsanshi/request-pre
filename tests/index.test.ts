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
                data: [],
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
const service = new Service(apiSchemaList, serviceConfig, function ({ config, url, mock }) {
    return Promise.resolve({
        config, url, mock
    });
});
const path =  serviceConfig.prefix + apiSchemaList.detail.url.path;
test('instanceof Service', () => {
    expect(service instanceof Service).toBe(true);
});

test('process.env.NODE_ENV=development & mock', () => {
    process.env.NODE_ENV = 'development';
    service.list({
        config: {
            mock: 'list.success',
        },
    }).then((data) => {
        expect(data).toBe(apiSchemaList.list.mock["list.success"].data);
    });
    service.list({
        config: {
            mock: 'list.fail',
        },
    }).catch((data) => {
        expect(data).toBe(apiSchemaList.list.mock["list.fail"].data);
    });
    service.$list({
        config: {
            mock: 'list.success',
        },
    }).then((data) => {
        expect(data).toBe(apiSchemaList.list.mock["list.success"].data);
    });
});

test('process.env.NODE_ENV=production', () => {
    process.env.NODE_ENV = 'production';
    service.list({
        config: {
            mock: 'list.success',
        },
    }).then(({ config, url, mock }) => {
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
    }).then(({ config, url, mock }) => {
        expect(url).toStrictEqual({
            ...apiSchemaList.detail.url,
            headers: serviceConfig.headers,
            path,
        });
    });
});

test('reset request method', () => {
    service.list = function (...args) {
        return service.$list(...args);
    };
    service.list({
        config: {
            mock: 'list.success',
        },
    }).then(({ config, url, mock }) => {
        expect(mock).toStrictEqual(apiSchemaList.list.mock);
        expect({
            ...apiSchemaList.list.url,
            headers: serviceConfig.headers,
            path,
        }).toStrictEqual(url);
    });
    expect(() => {
        service.$list = 'test';
    }).toThrow();
});

Proxy = null;
const service2 = new Service(apiSchemaList, serviceConfig, function ({ config, url, mock }) {
    return Promise.resolve({
        config, url, mock
    });
});
test('[no Proxy]process.env.NODE_ENV=development & mock', () => {
    process.env.NODE_ENV = 'development';
    service2.list({
        config: {
            mock: 'list.success',
        },
    }).then((data) => {
        expect(data).toBe(apiSchemaList.list.mock["list.success"].data);
    });
    service2.list({
        config: {
            mock: 'list.fail',
        },
    }).catch((data) => {
        expect(data).toBe(apiSchemaList.list.mock["list.fail"].data);
    });
    service2.$list({
        config: {
            mock: 'list.success',
        },
    }).then((data) => {
        expect(data).toBe(apiSchemaList.list.mock["list.success"].data);
    });
});
