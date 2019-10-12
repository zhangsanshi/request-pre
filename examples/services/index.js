
const Service = require('../../dist/lib/index').default;
const apiSchemaList = require('./apis');
const mocks = require('./mocks');


Object.keys(mocks).forEach((methodName) => {
    if (apiSchemaList[methodName]) {
        apiSchemaList[methodName].mock = mocks[methodName];
    }
});

const serviceConfig = {
    prefix: '/domain',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    config: {
        custom: 'option',
    },
};
const service = new Service(apiSchemaList, serviceConfig, function ({config, url, mock}) {
    return Promise.resolve({
        config,
        mock,
        url,
    });
});
service.list = function(...args) {
    return this.$list(...args);
};
module.exports = service;