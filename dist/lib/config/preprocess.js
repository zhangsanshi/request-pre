"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function preprocess(requestInfo, preprocessFunc) {
    return preprocessFunc(requestInfo);
}
exports.default = preprocess;
