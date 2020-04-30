"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mixin_1 = require("./util/mixin");
var mock_1 = require("./util/mock");
var compose_1 = require("./util/compose");
var requestType_1 = require("./middleware/requestType");
var Service = /** @class */ (function () {
    function Service(apiSchemaList, serviceConfig, requester) {
        this.serviceConfig = serviceConfig;
        this.apiSchemaList = apiSchemaList;
        this.requester = requester;
        this.middlewareList = [
            requestType_1.default,
        ];
        return this.initService();
    }
    Service.prototype.use = function (middleware) {
        this.middlewareList.push(middleware);
        return this;
    };
    Service.prototype.createRequest = function (apiName, target, middlewareWrap) {
        return function (requestObj) {
            var requestInfo = mixin_1.default(target.serviceConfig, target.apiSchemaList[apiName], requestObj);
            return middlewareWrap(requestInfo, function (ctx) {
                var request = null;
                if (process.env.NODE_ENV === 'development') {
                    request = mock_1.default(ctx);
                }
                if (!request) {
                    request = target.requester(ctx);
                }
                return request;
            });
        };
    };
    Service.prototype.initService = function () {
        var _this = this;
        var apiSchemaList = this.apiSchemaList;
        var middlewareWrap = compose_1.default(this.middlewareList);
        if (typeof Proxy === 'undefined') {
            Object.keys(apiSchemaList).forEach(function (apiName) {
                _this[apiName] = _this['$' + apiName] = _this.createRequest(apiName, _this, middlewareWrap);
            });
            return this;
        }
        else {
            return new Proxy(this, {
                get: function (target, propertyKey) {
                    if (propertyKey in target) {
                        return target[propertyKey];
                    }
                    if (propertyKey.startsWith('$')) {
                        propertyKey = propertyKey.substring(1);
                    }
                    if (propertyKey in target.apiSchemaList) {
                        return target.createRequest(propertyKey, target, middlewareWrap);
                    }
                },
                set: function (target, propertyKey, value, receiver) {
                    if (propertyKey.startsWith('$') && apiSchemaList[propertyKey.substring(1)]) {
                        console.error("can not set property " + propertyKey);
                        return false;
                    }
                    else {
                        return Reflect.set(target, propertyKey, value, receiver);
                    }
                },
            });
        }
    };
    return Service;
}());
exports.default = Service;
