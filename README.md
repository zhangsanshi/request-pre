# request-pre

format data before request send

## api

### new Service(apiSchemaList: ApiSchemaList, serviceConfig: ServiceConfig, requester: ({config: Config,mock: Mock,url: UrlSchema,}) => requestReturn)

## usage

```javascript
// services/index.js
import Service from 'request-pre';
import apiSchemaList from './apis';

if (process.env.NODE_ENV === 'development') {
    const mocks = require('./mocks');
    Object.keys(mocks).forEach((methodName) => {
        if (apiSchemaList[methodName]) {
            apiSchemaList[methodName].mock = mocks[methodName];
        }
    });
}
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
    // requester
    const { path, query, body, method, headers } = url;
    return Promise.resolve({
        config,
        mock,
        ...url,
    });
});
service.list = function(...args) {
    return service.$list(...args).then((data) => {
        console.log('rewrite list');
        return data;
    });
};
// not do this
// service.$list = function(...args) {
//     return Promise.reject('');
// }; will throw error
```

```javascript
// services/apis.js
export default {
    list: {
        url: {
            path: '/a/b/{id}',
            method: methods.GET,
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
            method: methods.POST,
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
```

```javascript
// services/mocks.js
export default {
    list: {
        mock: {
            'list.success': {
                success: true,
                data: [], // or () => [],
            },
        },
    },
};
```

```javascript
// case
import service from '../services';
services.list({
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
});

```

```javascript
// before send data
{
    "config": {
        "custom": "option",
        "mock": "list.success"
    },
    "mock": {
        "mock": {
            "list.success": {
                "success": true,
                "data": []
            }
        }
    },
    "url": {
        "path": "/domain/a/b/2",
        "method": "GET",
        "query": {
            "search": 1,
            "status": 4
        },
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-option": "custom"
        }
    }
}
```
