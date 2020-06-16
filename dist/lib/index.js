"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mixin_1 = require("./util/mixin");
var compose_1 = require("./util/compose");
var config_1 = require("./config");
var mock_1 = require("./util/mock");
var preprocess_1 = require("./config/preprocess");
var postprocess_1 = require("./config/postprocess");
var requestType_1 = require("./middleware/requestType");
var Service = /** @class */ (function () {
    function Service(requester) {
        this.requester = requester;
        this.preConfig = new Map();
        this.postConfig = new Map();
        this.middlewareList = [
            requestType_1.default,
        ];
        this.preConfig.set('preprocess', preprocess_1.default);
        this.postConfig.set('postprocess', postprocess_1.default);
    }
    Service.prototype.use = function (middleware) {
        this.middlewareList.push(middleware);
        return this;
    };
    Service.prototype.createRequest = function (apiName, target, middlewareWrap, apiSchemaList, serviceConfig) {
        return function (requestObj) {
            var requestInfo = mixin_1.default(serviceConfig, apiSchemaList[apiName], requestObj);
            return middlewareWrap(requestInfo, function (ctx) {
                var config = ctx.config;
                var request = config_1.default.pre(config, target.preConfig, Promise.resolve(ctx), ctx);
                request = request.then(function () {
                    if (process.env.NODE_ENV === 'development') {
                        var mockData = mock_1.default(ctx);
                        if (mockData) {
                            return mockData;
                        }
                    }
                    return target.requester(ctx);
                });
                return config_1.default.post(config, target.postConfig, request, ctx);
            });
        };
    };
    Service.prototype.generator = function (apiSchemaList, dynamicServices, serviceConfig) {
        var _this = this;
        var middlewareWrap = compose_1.default(this.middlewareList);
        var services = Object.create(null);
        if (dynamicServices) {
            Object.keys(dynamicServices).forEach(function (key) {
                services[key] = dynamicServices[key];
            });
        }
        var self = this;
        if (typeof Proxy === 'undefined') {
            Object.keys(apiSchemaList).forEach(function (apiName) {
                services[apiName] = _this.createRequest(apiName, _this, middlewareWrap, apiSchemaList, serviceConfig);
            });
            return services;
        }
        else {
            return new Proxy(services, {
                get: function (target, propertyKey) {
                    if (propertyKey in target) {
                        return target[propertyKey];
                    }
                    if (propertyKey in apiSchemaList) {
                        return self.createRequest(propertyKey, self, middlewareWrap, apiSchemaList, serviceConfig);
                    }
                },
                set: function (target, propertyKey, value, receiver) {
                    if (propertyKey in apiSchemaList) {
                        if (process.env.NODE_ENV === 'development')
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
