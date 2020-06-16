import Service from '../src/index';
import methods from '../src/methods';

beforeAll((): void => {

    process.env.NODE_ENV = 'development';
})
afterAll((): void => {

    process.env.NODE_ENV = '';
})
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

test('preprocess', (): void => {
    const service = new Service({}, function ({ config, url, mock }): Promise<object> {
        return Promise.resolve({
            config, url, mock
        });
    }).generator(apiSchemaList);
    service.list({
        config: {
            preprocess(requestInfo): void {
                requestInfo.url.headers.preprocess = 'preprocess';
            },
        },
    }).then((data): void => {
        expect(data.url.headers.preprocess).toStrictEqual('preprocess');
    });
});

test('postprocess', (): void => {
    const service = new Service({}, function ({ config, url, mock }): Promise<object> {
        return Promise.resolve({
            config, url, mock
        });
    }).generator(apiSchemaList);
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

test('custom post config', (): void => {
    const serviceGenerator = new Service({}, function ({ config, url, mock }): Promise<object> {
        return Promise.resolve({
            config, url, mock
        });
    })
    const service = serviceGenerator.generator(apiSchemaList);
    serviceGenerator.postConfig.set('postConfig1', {
        resolve(ctx, params, data): any {
            return {a:2};
        },
        reject(ctx, params, data): any {
            return {a:4};
        }
    });
    service.list({
        config: {
            mock: 'list.fail',
            postConfig1: true,
        },
    }).then((data): void => {
        expect(data).toStrictEqual({a:4});
    });
    service.list({
        config: {
            mock: 'list.success',
            postConfig1: true,
        },
    }).then((data): void => {
        expect(data).toStrictEqual({a:2});
    });

    service.list({
        config: {
            mock: 'list.success',
            postConfig1: true,
            postprocess(): number {
                return 1;
            },
        },
    }).then((data): void => {
        expect(data).toStrictEqual(1);
    });
    serviceGenerator.postConfig.set('resolve2', {
        resolve(): any {
            return {a:2};
        }
    });
    serviceGenerator.postConfig.set('reject4', {
        reject(): any {
            return Promise.reject({a:4});
        }
    });
    serviceGenerator.postConfig.set('resolve6', {
        resolve(): any {
            return {a:6};
        }
    });
    service.list({
        config: {
            mock: 'list.success',
            resolve2: true,
            reject4: true,
        },
    }).catch((data): void => {
        expect(data).toStrictEqual({a:2});
    });

    service.list({
        config: {
            mock: 'list.fail',
            reject4: true,
            resolve6: true,
        },
    }).catch((data): void => {
        expect(data).toStrictEqual({a:4});
    });
});
test('custom pre config', (): void => {

    const serviceGenerator = new Service({}, function ({ config, url, mock }): Promise<object> {
        return Promise.resolve({
            config, url, mock
        });
    })
    const service = serviceGenerator.generator(apiSchemaList);
    serviceGenerator.preConfig.set('reject', function (): Promise<any> {
        return Promise.reject('reject');
    });
    serviceGenerator.preConfig.set('changeHeader', function (ctx): Promise<any> {
        ctx.url.headers.changeHeader = 'changeHeader';
        return Promise.resolve('can not get message from reject');
    });
    serviceGenerator.preConfig.set('newReject', {
        reject(ctx, params, error): Promise<any> {
            return Promise.reject(error);
        }
    });
    service.list({
        config: {
            mock: 'list.fail',
            reject: true,
            changeHeader: true,
            newReject: true,
        },
    }).catch((err): void => {
        expect(err).toStrictEqual('reject');
    });
    service.list({
        config: {
            changeHeader: true,
            newReject: true,
        },
    }).then((data): void => {
        expect(data.url.headers.changeHeader).toStrictEqual('changeHeader');
    });
});