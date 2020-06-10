"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function postprocess(requestInfo, postprocessFunc) {
    return postprocessFunc(requestInfo);
}
exports.default = postprocess;
