"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mixins_1 = require("./util/mixins");
var Service = /** @class */ (function () {
    function Service(apiSchemaList, serviceConfig, requester) {
        this.serviceConfig = serviceConfig;
        this.apiSchemaList = apiSchemaList;
        this.requester = requester;
        return this.initService();
    }
    Service.prototype.createRequest = function (apiName, target) {
        return function (requestObj) {
            var requestInfo = mixins_1.default(target.serviceConfig, target.apiSchemaList[apiName], requestObj);
            var config = requestInfo.config, mock = requestInfo.mock;
            var mockStatus = config && config.mock;
            var mockInfo = mockStatus && mock && mock[mockStatus];
            if (process.env.NODE_ENV === 'development') {
                if (mockInfo) {
                    console.log(requestInfo);
                    return new Promise(function (res, rej) {
                        var action = mockInfo.success ? res : rej;
                        action(typeof mockInfo.data === 'function' ? mockInfo.data(config) : mockInfo.data);
                    });
                }
            }
            return target.requester(requestInfo);
        };
    };
    Service.prototype.initService = function () {
        var _this = this;
        var apiSchemaList = this.apiSchemaList;
        if (typeof Proxy === 'undefined') {
            Object.keys(apiSchemaList).forEach(function (apiName) {
                _this[apiName] = _this['$' + apiName] = _this.createRequest(apiName, _this);
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
                        return target.createRequest(propertyKey, target);
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
