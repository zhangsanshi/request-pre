"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function postprocess(prevData, postprocessFunc, requestInfo) {
    return postprocessFunc(prevData, requestInfo);
}
exports.default = postprocess;
