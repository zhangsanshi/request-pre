import mixin from '../../src/util/mixin';
const caseBase = function (caseInfo): void {
    test(`mixin(
        ${JSON.stringify(caseInfo.input.serviceConfig)},
        ${JSON.stringify(caseInfo.input.apiSchema)},
        ${JSON.stringify(caseInfo.input.requestObj)}
    )`, (): void => {
        expect(mixin(caseInfo.input.serviceConfig, caseInfo.input.apiSchema, caseInfo.input.requestObj)).toStrictEqual(caseInfo.output);
    });
};
caseBase({
    input: {
        serviceConfig: {},
        apiSchema: {
            url: {},
        },
        requestObj: {},
    },
    output: {
        config: {
            "priority": {
                preprocess: 100,
                postprocess: 100,
            },
        },
        url: {},
    },
});
caseBase({
    input: {
        serviceConfig: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            prefix: '/domain',
            config: {
                other: 'anyway',
            },
        },
        apiSchema: {
            url: {
                path: '/a/b/{id}',
                method: 'GET',
                query: {
                    a: 1,
                },
            },
            mock: {
                listSuccess: {
                    data: [],
                    success: true,
                },
            },
        },
        requestObj: {
            path: {
                id: 1,
            },
            query: {
                b: 2,
            },
            config: {
                mock: 'listSuccess',
            },
        },
    },
    output: {
        url: {
            path: '/domain/a/b/1',
            method: 'GET',
            query: {
                a: 1,
                b: 2,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        },
        config: {
            "priority": {
                preprocess: 100,
                postprocess: 100,
            },
            mock: 'listSuccess',
            other: 'anyway',
        },
        mock: {
            listSuccess: {
                data: [],
                success: true,
            },
        },
    },
});

caseBase({
    input: {
        serviceConfig: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            prefix: '/domain',
        },
        apiSchema: {
            url: {
                path: '/a/b/{id}',
                method: 'GET',
                query: {
                    a: 1,
                },
            },
        },
        requestObj: {
            path: {
                id: 1,
            },
        },
    },
    output: {
        config: {
            "priority": {
                preprocess: 100,
                postprocess: 100,
            },
        },
        url: {
            path: '/domain/a/b/1',
            method: 'GET',
            query: {
                a: 1,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        },
    },
});

caseBase({
    input: {
        serviceConfig: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            prefix: '/domain',
        },
        apiSchema: {
            url: {
                path: '/a/b/{id}',
                method: 'POST',
                query: {
                    a: 1,
                },
            },
        },
        requestObj: {
            path: {
                id: 1,
            },
        },
    },
    output: {
        config: {
            "priority": {
                preprocess: 100,
                postprocess: 100,
            },
        },
        url: {
            path: '/domain/a/b/1',
            method: 'POST',
            query: {
                a: 1,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        },
    },
});

caseBase({
    input: {
        serviceConfig: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            prefix: '/domain',
        },
        apiSchema: {
            url: {
                path: '/a/b/{id}',
                method: 'POST',
                query: {
                    a: 1,
                },
            },
        },
        requestObj: {
            path: {
                id: 1,
            },
            body: {
                username: 'test',
            },
        },
    },
    output: {
        config: {
            "priority": {
                preprocess: 100,
                postprocess: 100,
            },
        },
        url: {
            path: '/domain/a/b/1',
            method: 'POST',
            query: {
                a: 1,
            },
            body: {
                username: 'test',
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        },
    },
});

caseBase({
    input: {
        serviceConfig: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            prefix: '/domain',
        },
        apiSchema: {
            url: {
                path: '/a/b',
                method: 'POST',
                query: {
                    a: 1,
                },
                headers: {
                    'x-xx': 1,
                },
            },
        },
        requestObj: {},
    },
    output: {
        config: {
            "priority": {
                preprocess: 100,
                postprocess: 100,
            },
        },
        url: {
            path: '/domain/a/b',
            method: 'POST',
            query: {
                a: 1,
            },
            headers: {
                'x-xx': 1,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        },
    },
});
