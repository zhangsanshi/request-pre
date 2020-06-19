"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = exports.resolvePath = void 0;
function resolvePath(url, path) {
    if (path)
        return url.replace(/\{(.*?)\}/g, function (a, b) { return (path[b] || a) + ''; });
    return url;
}
exports.resolvePath = resolvePath;
function isObject(data) {
    return Object.prototype.toString.call(data) === '[object Object]';
}
exports.isObject = isObject;
