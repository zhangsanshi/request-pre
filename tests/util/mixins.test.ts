import mixins from '../../src/util/mixins';
const caseBase = function(caseInfo): void {
    test(`mixins(
        ${JSON.stringify(caseInfo.input.serviceConfig)},
        ${JSON.stringify(caseInfo.input.apiSchema)},
        ${JSON.stringify(caseInfo.input.requestObj)}
    )`, (): void => {
        expect(mixins(caseInfo.input.serviceConfig, caseInfo.input.apiSchema, caseInfo.input.requestObj)).toStrictEqual(caseInfo.output);
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
