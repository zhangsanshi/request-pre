const service = require('./services');
service.list({
    path: {
        id: 2,
    },
    query: {
        status: 4,
    },
    body: {
        xx: 2,
    },
    headers: {
        'x-option': 'custom',
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    config: {
        mock: 'list.success',
    },
}).then((data) => {
    console.log(JSON.stringify(data, null, 4));
});