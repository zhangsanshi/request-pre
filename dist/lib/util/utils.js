"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resolvePath(url, path) {
    if (path)
        return url.replace(/\{(.*?)\}/g, function (a, b) { return (path[b] || a) + ''; });
    return url;
}
exports.resolvePath = resolvePath;
