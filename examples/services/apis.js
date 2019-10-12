module.exports = {
    list: {
        url: {
            path: '/a/b/{id}',
            method: 'GET',
            query: {
                search: 1,
            },
            headers: {
                'x-option': 'custom',
            },
        },
    },
    detail: {
        url: {
            path: '/a/b/{id}', // support path param
            method: 'POST',
            query: {
                search: 1,
            },
            body: {
                name: 'test',
            },
            headers: {
                'x-option': 'custom',
            },
        },
    },
};