"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var methods_1 = require("../methods");
var utils_1 = require("./utils");
var bodyMethods = [methods_1.default.PATCH, methods_1.default.POST, methods_1.default.PUT];
function mixins(serviceConfig, apiSchema, requestObj) {
    var apiSchemaURL = apiSchema.url;
    requestObj = requestObj || {};
    serviceConfig = serviceConfig || {};
    var requestObjURL = requestObj.url = requestObj.url || {};
    var apiSchemaURLInfo = __assign({}, apiSchemaURL);
    var apiSchemaInfo = {
        url: apiSchemaURLInfo,
    };
    if (serviceConfig.config || apiSchema.config || requestObj.config) {
        apiSchemaInfo.config = __assign({}, serviceConfig.config, apiSchema.config, requestObj.config);
    }
    if (apiSchema.mock || requestObj.mock) {
        apiSchemaInfo.mock = apiSchema.mock;
    }
    if (requestObjURL.path) {
        apiSchemaURLInfo.path = utils_1.resolvePath(apiSchemaURL.path, requestObjURL.path);
    }
    if (serviceConfig.prefix) {
        apiSchemaURLInfo.path = serviceConfig.prefix + apiSchemaURLInfo.path;
    }
    if ((apiSchemaURL.body || requestObjURL.body) && bodyMethods.includes(apiSchemaURLInfo.method)) {
        apiSchemaURLInfo.body = __assign({}, apiSchemaURL.body, requestObjURL.body);
    }
    if (apiSchemaURL.query || requestObjURL.query) {
        apiSchemaURLInfo.query = __assign({}, apiSchemaURL.query, requestObjURL.query);
    }
    if (apiSchemaURL.headers || requestObjURL.headers || serviceConfig.headers) {
        apiSchemaURLInfo.headers = __assign({}, serviceConfig.headers, apiSchemaURL.headers, requestObjURL.headers);
    }
    return apiSchemaInfo;
}
exports.default = mixins;
