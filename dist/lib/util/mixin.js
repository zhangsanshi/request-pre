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
function mixin(serviceConfig, apiSchema, requestObj) {
    var _a, _b, _c;
    var apiSchemaURL = apiSchema.url;
    requestObj = requestObj || {};
    serviceConfig = serviceConfig || {};
    var apiSchemaURLInfo = __assign({}, apiSchemaURL);
    var apiSchemaInfo = {
        url: apiSchemaURLInfo,
    };
    var priority = __assign(__assign(__assign(__assign({}, ({
        preprocess: 100,
        postprocess: 0,
    })), (_a = serviceConfig === null || serviceConfig === void 0 ? void 0 : serviceConfig.config) === null || _a === void 0 ? void 0 : _a.priority), (_b = apiSchema === null || apiSchema === void 0 ? void 0 : apiSchema.config) === null || _b === void 0 ? void 0 : _b.priority), (_c = requestObj === null || requestObj === void 0 ? void 0 : requestObj.config) === null || _c === void 0 ? void 0 : _c.priority);
    apiSchemaInfo.config = __assign(__assign(__assign(__assign({}, serviceConfig === null || serviceConfig === void 0 ? void 0 : serviceConfig.config), apiSchema === null || apiSchema === void 0 ? void 0 : apiSchema.config), requestObj === null || requestObj === void 0 ? void 0 : requestObj.config), ({
        priority: priority,
    }));
    if (apiSchema.mock || requestObj.mock) {
        apiSchemaInfo.mock = apiSchema.mock;
    }
    if (requestObj.path) {
        apiSchemaURLInfo.path = utils_1.resolvePath(apiSchemaURL.path, requestObj.path);
    }
    if (serviceConfig.prefix) {
        apiSchemaURLInfo.path = serviceConfig.prefix + apiSchemaURLInfo.path;
    }
    if ((apiSchemaURL.body || requestObj.body)) {
        apiSchemaURLInfo.body = __assign(__assign({}, apiSchemaURL.body), requestObj.body);
        if (process.env.NODE_ENV === 'development') {
            if (!bodyMethods.includes(apiSchemaURLInfo.method)) {
                console.warn('HTTP methods like post,patch,put require a body.');
            }
        }
    }
    if (apiSchemaURL.query || requestObj.query) {
        apiSchemaURLInfo.query = __assign(__assign({}, apiSchemaURL.query), requestObj.query);
    }
    if (apiSchemaURL.headers || requestObj.headers || serviceConfig.headers) {
        apiSchemaURLInfo.headers = __assign(__assign(__assign({}, serviceConfig.headers), apiSchemaURL.headers), requestObj.headers);
    }
    return apiSchemaInfo;
}
exports.default = mixin;
