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
test('middleware', (): void => {
    const service = new Service({}, function ({ config, url, mock }): Promise<object> {
        return Promise.resolve({
            config, url, mock
        });
    }).generator(apiSchemaList);
    service.list({
        config: {
            mock: 'list.success',
        },
    }).then((data): void => {
        expect(data.url.headers['Content-Type']).toStrictEqual('application/json;charset=UTF-8');
    });

    const service2 = new Service({
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
    }, function ({ config, url, mock }): Promise<object> {
        return Promise.resolve({
            config, url, mock
        });
    }).generator(apiSchemaList);
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
    const serviceGenerator = new Service( {
        config: {
            custom: 'addHeader',
        },
    }, function ({ config, url, mock }): Promise<object> {
        return Promise.resolve({
            config, url, mock
        });
    });
    const service = serviceGenerator.generator(apiSchemaList);
    serviceGenerator.use(async function (apiSchema, next): Promise<any> {
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