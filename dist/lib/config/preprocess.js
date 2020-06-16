"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function preprocess(requestInfo, preprocessFunc, prevData) {
    return preprocessFunc(requestInfo, prevData);
}
exports.default = preprocess;
